"""
OCR Router - OCR 路由器

职责：
1. 根据文件类型和 profile 选择最优 OCR 引擎
2. 管理多种 OCR 引擎适配器
3. 处理引擎不可用时的降级策略
4. 统一输出格式（text / markdown / ldir）

支持的引擎：
- PaddleOCR：默认中文 OCR（v2.x / v3.x 兼容）
- Tesseract：兜底 OCR

预留（v0.2+）：
- MinerU：PDF 结构化解析（在 parser 层实现）
- GOT-OCR：复杂视觉内容
- Surya：多语种版面
"""

from pathlib import Path
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
import os
import re
import tempfile


@dataclass
class OCROutput:
    """OCR 统一输出"""
    text: str = ""
    markdown: str = ""
    blocks: List[Dict[str, Any]] = field(default_factory=list)
    pages: List[Dict[str, Any]] = field(default_factory=list)
    confidence: float = 0.0
    engine: str = ""
    engine_version: str = ""
    processing_time_ms: int = 0
    profile: str = ""


@dataclass
class OCRProfile:
    """OCR Profile 配置"""
    name: str
    engine: str
    fallback_engines: List[str] = field(default_factory=list)
    output_formats: List[str] = field(default_factory=lambda: ["text", "markdown"])
    lang: str = "ch_sim"
    options: Dict[str, Any] = field(default_factory=dict)


def _bbox_rect(bbox: Any) -> Optional[tuple[float, float, float, float]]:
    """Normalize OCR bbox variants to x0, y0, x1, y1."""
    if bbox is None:
        return None
    try:
        if hasattr(bbox, "tolist"):
            bbox = bbox.tolist()
        if len(bbox) == 4 and all(isinstance(item, (int, float)) for item in bbox):
            x0, y0, x1, y1 = [float(item) for item in bbox]
            return min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1)
        points = []
        for point in bbox:
            if hasattr(point, "tolist"):
                point = point.tolist()
            if len(point) >= 2:
                points.append((float(point[0]), float(point[1])))
        if points:
            xs = [point[0] for point in points]
            ys = [point[1] for point in points]
            return min(xs), min(ys), max(xs), max(ys)
    except Exception:
        return None
    return None


def _median(values: List[float], default: float) -> float:
    values = sorted(value for value in values if value > 0)
    if not values:
        return default
    mid = len(values) // 2
    if len(values) % 2:
        return values[mid]
    return (values[mid - 1] + values[mid]) / 2


def _is_cjk_or_punctuation(char: str) -> bool:
    return bool(re.match(r"[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef，。；：？！、）】》」』]", char))


def _needs_space(prev: str, current: str, gap: float, median_height: float) -> bool:
    if not prev or not current:
        return False
    if _is_cjk_or_punctuation(prev[-1]) or _is_cjk_or_punctuation(current[0]):
        return False
    return gap > max(2.0, median_height * 0.12)


def _assemble_ocr_text(blocks: List[Dict[str, Any]]) -> str:
    """Assemble OCR blocks into readable lines using their coordinates."""
    normalized = []
    for block in blocks:
        text = str(block.get("text", "")).strip()
        rect = _bbox_rect(block.get("bbox"))
        if not text:
            continue
        if rect is None:
            normalized.append({"text": text, "rect": None})
            continue
        x0, y0, x1, y1 = rect
        normalized.append({
            "text": text,
            "rect": rect,
            "x0": x0,
            "y0": y0,
            "x1": x1,
            "y1": y1,
            "cy": (y0 + y1) / 2,
            "height": max(1.0, y1 - y0),
        })

    positioned = [item for item in normalized if item.get("rect") is not None]
    unpositioned = [item["text"] for item in normalized if item.get("rect") is None]
    if not positioned:
        return "\n".join(unpositioned).strip()

    median_height = _median([item["height"] for item in positioned], 14.0)
    line_threshold = max(4.0, median_height * 0.65)
    lines: List[List[Dict[str, Any]]] = []

    for item in sorted(positioned, key=lambda part: (part["cy"], part["x0"])):
        target_line = None
        for line in reversed(lines[-3:]):
            line_center = sum(part["cy"] for part in line) / len(line)
            if abs(item["cy"] - line_center) <= line_threshold:
                target_line = line
                break
        if target_line is None:
            lines.append([item])
        else:
            target_line.append(item)

    assembled_lines = []
    previous_bottom: Optional[float] = None
    paragraph_gap = max(10.0, median_height * 1.65)

    for line in lines:
        line.sort(key=lambda part: part["x0"])
        line_top = min(part["y0"] for part in line)
        line_bottom = max(part["y1"] for part in line)
        if previous_bottom is not None and line_top - previous_bottom > paragraph_gap:
            assembled_lines.append("")

        pieces: List[str] = []
        previous_right: Optional[float] = None
        for part in line:
            text = part["text"]
            if pieces and previous_right is not None:
                gap = part["x0"] - previous_right
                if _needs_space(pieces[-1], text, gap, median_height):
                    pieces.append(" ")
            pieces.append(text)
            previous_right = part["x1"]
        assembled_lines.append("".join(pieces).strip())
        previous_bottom = line_bottom

    if unpositioned:
        assembled_lines.extend(unpositioned)
    return "\n".join(line for line in assembled_lines if line is not None).strip()


def _paddle_model_dirs() -> Dict[str, str]:
    """Resolve bundled PaddleOCR models without triggering downloads."""
    raw_root = (
        os.environ.get("LEGALWORK_PADDLEOCR_MODEL_ROOT")
        or os.environ.get("PADDLEOCR_MODEL_ROOT")
    )
    if not raw_root:
        return {}

    root = Path(raw_root).expanduser()
    v6_mapping = {
        "doc_orientation_classify_model_dir": "PP-LCNet_x1_0_doc_ori",
        "doc_unwarping_model_dir": "UVDoc",
        "textline_orientation_model_dir": "PP-LCNet_x1_0_textline_ori",
        "text_detection_model_dir": "PP-OCRv6_medium_det",
        "text_recognition_model_dir": "PP-OCRv6_medium_rec",
    }
    v6_result = {
        argument: str(model_dir)
        for argument, model_name in v6_mapping.items()
        if (model_dir := root / model_name).is_dir()
    }
    if (
        "text_detection_model_dir" in v6_result
        and "text_recognition_model_dir" in v6_result
    ):
        return v6_result

    v4_mapping = {
        "text_detection_model_dir": "PP-OCRv4_mobile_det",
        "text_recognition_model_dir": "PP-OCRv4_mobile_rec",
    }
    return {
        argument: str(model_dir)
        for argument, model_name in v4_mapping.items()
        if (model_dir := root / model_name).is_dir()
    }


def _paddle_model_options(model_dirs: Dict[str, str]) -> Dict[str, Any]:
    options: Dict[str, Any] = dict(model_dirs)
    det_dir = model_dirs.get("text_detection_model_dir")
    rec_dir = model_dirs.get("text_recognition_model_dir")
    if (
        det_dir
        and rec_dir
        and Path(det_dir).name == "PP-OCRv4_mobile_det"
        and Path(rec_dir).name == "PP-OCRv4_mobile_rec"
    ):
        options.update(
            {
                "text_detection_model_name": "PP-OCRv4_mobile_det",
                "text_recognition_model_name": "PP-OCRv4_mobile_rec",
                "use_doc_orientation_classify": False,
                "use_doc_unwarping": False,
                "use_textline_orientation": False,
            }
        )
    return options


class BaseOCRAdapter:
    """OCR 适配器基类"""

    name: str = "base"
    version: str = "0.0.1"

    def is_available(self) -> bool:
        """检查引擎是否可用"""
        return False

    def recognize(self, image_path: str, **kwargs) -> OCROutput:
        """识别单张图片"""
        raise NotImplementedError

    def recognize_pdf(self, pdf_path: str, **kwargs) -> OCROutput:
        """识别 PDF（逐页转图片后 OCR）"""
        raise NotImplementedError


class PaddleOCRAdapter(BaseOCRAdapter):
    """PaddleOCR 适配器 - 默认中文 OCR 引擎

    兼容 PaddleOCR v2.x 和 v3.x。
    v3.x 需要 paddlepaddle 运行时，不可用时 is_available() 返回 False。
    """

    name = "paddleocr"

    def __init__(self):
        self._engine = None
        self._initialized = False
        self._version = "0.0.0"
        self._import_error = None

    def _get_paddleocr_version(self) -> str:
        """获取已安装的 PaddleOCR 版本"""
        try:
            import paddleocr
            return getattr(paddleocr, "__version__", "unknown")
        except ImportError:
            return "0.0.0"

    def is_available(self) -> bool:
        """深度检查 PaddleOCR 是否可用

        v2.x: import 时就需要 paddle，不可用则直接返回 False
        v3.x: import 成功，但需要 paddlepaddle 运行时；尝试初始化引擎验证
        """
        # Step 1: 检查 paddleocr 包是否可导入
        try:
            import paddleocr
            self._version = getattr(paddleocr, "__version__", "unknown")
        except ImportError as e:
            self._import_error = str(e)
            return False

        # Step 2: 对于 v3.x，检查 paddlepaddle 运行时是否可用
        if self._version.startswith("3.") or self._version.startswith("2."):
            # v2.x 在 import 阶段就已经需要 paddle，走到这里说明 v3.x
            try:
                # 尝试轻量初始化，不下载模型
                from paddleocr import PaddleOCR
                # 仅检查 paddlepaddle 是否可导入
                import importlib
                if importlib.util.find_spec("paddle") is None:
                    self._import_error = "缺少 paddlepaddle 运行时"
                    return False
                return True
            except Exception as e:
                self._import_error = str(e)
                return False

        return True

    def _init_engine(self, lang: str = "ch"):
        """初始化 PaddleOCR 引擎，兼容 v2.x 和 v3.x API"""
        if self._initialized and self._engine is not None:
            return

        try:
            from paddleocr import PaddleOCR

            # 探测 paddleocr 版本
            import paddleocr
            ver = getattr(paddleocr, "__version__", "0.0.0")
            is_v3 = ver.startswith("3.")

            if is_v3:
                # PaddleOCR v3.x API
                options: Dict[str, Any] = {
                    "lang": lang,
                    "use_textline_orientation": True,
                }
                model_dirs = _paddle_model_dirs()
                options.update(_paddle_model_options(model_dirs))
                if model_dirs:
                    options.pop("lang", None)
                self._engine = PaddleOCR(**options)
            else:
                # PaddleOCR v2.x API
                self._engine = PaddleOCR(
                    use_angle_cls=True,
                    lang=lang,
                    show_log=False,
                )
            self._initialized = True
            self._version = ver
        except Exception as e:
            self._initialized = False
            self._engine = None
            raise RuntimeError(f"PaddleOCR 初始化失败: {e}")

    def recognize(self, image_path: str, lang: str = "ch", **kwargs) -> OCROutput:
        """识别图片"""
        if not self.is_available():
            return OCROutput(text="", engine=self.name, confidence=0.0)

        try:
            self._init_engine(lang)
        except Exception as e:
            print(f"[PaddleOCR] 引擎初始化失败: {e}")
            return OCROutput(text="", engine=self.name, confidence=0.0)

        start = datetime.now()

        try:
            is_v3 = self._version.startswith("3.")

            if is_v3:
                # PaddleOCR v3.x API: predict(input, ...)
                result = self._engine.predict(image_path)
                if not result:
                    return OCROutput(text="", engine=self.name, confidence=0.0)

                page_result = result[0] if isinstance(result, list) else result
                texts = page_result.get("rec_texts", [])
                scores = page_result.get("rec_scores", [])
                boxes = page_result.get("rec_boxes", [])

                blocks = []
                total_confidence = 0.0
                count = 0
                for text, confidence, box in zip(texts, scores, boxes):
                    text = str(text).strip()
                    if not text:
                        continue
                    blocks.append({
                        "text": text,
                        "bbox": box.tolist() if hasattr(box, "tolist") else list(box),
                        "confidence": float(confidence),
                    })
                    total_confidence += float(confidence)
                    count += 1

                avg_confidence = total_confidence / count if count > 0 else 0.0
                full_text = _assemble_ocr_text(blocks)
            else:
                # PaddleOCR v2.x API: ocr(img, cls=True)
                result = self._engine.ocr(image_path, cls=True)
                if not result or not result[0]:
                    return OCROutput(text="", engine=self.name, confidence=0.0)

                blocks = []
                total_confidence = 0.0
                count = 0

                for line in result[0]:
                    bbox, (text, confidence) = line
                    blocks.append({
                        "text": text,
                        "bbox": bbox,
                        "confidence": confidence,
                    })
                    total_confidence += confidence
                    count += 1

                avg_confidence = total_confidence / count if count > 0 else 0.0
                full_text = _assemble_ocr_text(blocks)

            elapsed = int((datetime.now() - start).total_seconds() * 1000)

            return OCROutput(
                text=full_text,
                markdown=full_text,
                blocks=blocks,
                confidence=round(avg_confidence, 3),
                engine=self.name,
                engine_version=self._version,
                processing_time_ms=elapsed,
            )
        except Exception as e:
            print(f"[PaddleOCR] 识别失败: {e}")
            return OCROutput(text="", engine=self.name, confidence=0.0)

    def recognize_pdf(self, pdf_path: str, lang: str = "ch", **kwargs) -> OCROutput:
        """识别 PDF（逐页转为图片后 OCR）"""
        if not self.is_available():
            return OCROutput(text="", engine=self.name, confidence=0.0)

        try:
            import fitz  # PyMuPDF
        except ImportError:
            return OCROutput(text="", engine=self.name, confidence=0.0)

        try:
            doc = fitz.open(pdf_path)
        except Exception as e:
            return OCROutput(text="", engine=self.name, confidence=0.0)

        all_texts = []
        all_blocks = []
        pages = []
        page_confidences = []

        try:
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                # 将页面转为图片
                pix = page.get_pixmap(dpi=200)
                # 使用临时文件
                img_path = os.path.join(
                    tempfile.gettempdir(),
                    f"legalclaw_ocr_page_{page_num}.png"
                )
                pix.save(img_path)

                # OCR
                output = self.recognize(img_path, lang=lang)
                if output.text:
                    all_texts.append(f"--- Page {page_num + 1} ---\n{output.text}")
                all_blocks.extend(output.blocks)
                page_confidences.append(output.confidence)

                pages.append({
                    "page_number": page_num + 1,
                    "width": pix.width,
                    "height": pix.height,
                    "blocks": output.blocks,
                    "confidence": output.confidence,
                })

                # 清理临时文件
                try:
                    os.remove(img_path)
                except OSError:
                    pass

            avg_confidence = (
                sum(page_confidences) / len(page_confidences)
                if page_confidences else 0.0
            )
            full_text = "\n\n".join(all_texts)

            return OCROutput(
                text=full_text,
                markdown=full_text,
                blocks=all_blocks,
                pages=pages,
                confidence=round(avg_confidence, 3),
                engine=self.name,
                engine_version=self._version,
            )
        except Exception as e:
            print(f"[PaddleOCR] PDF 识别失败: {e}")
            return OCROutput(text="", engine=self.name, confidence=0.0)
        finally:
            doc.close()


class TesseractAdapter(BaseOCRAdapter):
    """Tesseract 适配器 - 兜底 OCR 引擎"""

    name = "tesseract"
    version = "5.0"

    def __init__(self):
        self._available = None

    def is_available(self) -> bool:
        if self._available is not None:
            return self._available
        try:
            import pytesseract
            # 检查 tesseract 可执行文件是否存在
            version = pytesseract.get_tesseract_version()
            self._available = version is not None
            self.version = str(version.major) if version else "0.0"
            return self._available
        except Exception:
            self._available = False
            return False

    def _check_chinese_lang(self) -> bool:
        """检查中文语言包是否可用"""
        try:
            import pytesseract
            langs = pytesseract.get_languages()
            return "chi_sim" in langs
        except Exception:
            return False

    def recognize(self, image_path: str, lang: str = "chi_sim+eng", **kwargs) -> OCROutput:
        """识别图片"""
        if not self.is_available():
            return OCROutput(text="", engine=self.name, confidence=0.0)

        import pytesseract
        from PIL import Image

        start = datetime.now()

        try:
            img = Image.open(image_path)

            # 语言代码映射：兼容不同来源的 lang 参数（如 Profile 传来的 "ch"）
            lang_map = {
                "ch": "chi_sim",
                "chi": "chi_sim",
                "chinese": "chi_sim",
                "zh": "chi_sim+eng",
                "zh-cn": "chi_sim+eng",
            }
            lang = lang_map.get(lang, lang)

            # 自适应语言：如果 chi_sim 不可用，回退到 eng
            if "chi_sim" in lang and not self._check_chinese_lang():
                lang = "eng"
                print("[Tesseract] 中文语言包不可用，回退到英文")

            data = pytesseract.image_to_data(
                img, lang=lang, output_type=pytesseract.Output.DICT
            )

            blocks = []
            total_confidence = 0.0
            count = 0

            for i in range(len(data["text"])):
                text = data["text"][i].strip()
                conf = int(data["conf"][i]) if data["conf"][i] != "-1" else 0
                if text:
                    blocks.append({
                        "text": text,
                        "bbox": [
                            data["left"][i],
                            data["top"][i],
                            data["left"][i] + data["width"][i],
                            data["top"][i] + data["height"][i],
                        ],
                        "confidence": conf / 100.0,
                    })
                    total_confidence += conf
                    count += 1

            avg_confidence = total_confidence / (count * 100.0) if count > 0 else 0.0
            full_text = _assemble_ocr_text(blocks)

            elapsed = int((datetime.now() - start).total_seconds() * 1000)

            # 后处理：清理中文 OCR 产生的多余空格
            clean_text = self._clean_ocr_text(full_text)

            return OCROutput(
                text=clean_text,
                markdown=clean_text,
                blocks=blocks,
                confidence=round(avg_confidence, 3),
                engine=self.name,
                engine_version=self.version,
                processing_time_ms=elapsed,
            )
        except Exception as e:
            print(f"[Tesseract] 识别失败: {e}")
            return OCROutput(text="", engine=self.name, confidence=0.0)

    @staticmethod
    def _clean_ocr_text(text: str) -> str:
        """清理 Tesseract OCR 后的冗余空格，保留中英文之间的合理间距"""
        if not text:
            return text
        # 中文字符（含中文标点）之间的空格去掉
        text = re.sub(r'([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])[ \t]+([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])', r'\1\2', text)
        # 中文字符与中文标点之间的空格去掉
        text = re.sub(r'([\u4e00-\u9fff])[ \t]+([，。；：？！、）】》」\'"])', r'\1\2', text)
        text = re.sub(r'([（【「『])[ \t]+([\u4e00-\u9fff])', r'\1\2', text)
        # 连续空格压缩为一个
        text = re.sub(r' {2,}', ' ', text)
        return text.strip()

    def recognize_pdf(self, pdf_path: str, lang: str = "chi_sim+eng", **kwargs) -> OCROutput:
        """识别 PDF（逐页转为图片后 OCR）"""
        if not self.is_available():
            return OCROutput(text="", engine=self.name, confidence=0.0)

        try:
            import fitz  # PyMuPDF
        except ImportError:
            return OCROutput(text="", engine=self.name, confidence=0.0)

        try:
            doc = fitz.open(pdf_path)
        except Exception as e:
            return OCROutput(text="", engine=self.name, confidence=0.0)

        all_texts = []
        all_blocks = []
        pages = []
        page_confidences = []

        try:
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                pix = page.get_pixmap(dpi=200)
                img_path = os.path.join(
                    tempfile.gettempdir(),
                    f"legalclaw_tess_page_{page_num}.png"
                )
                pix.save(img_path)

                output = self.recognize(img_path, lang=lang)
                if output.text:
                    all_texts.append(f"--- Page {page_num + 1} ---\n{output.text}")
                all_blocks.extend(output.blocks)
                page_confidences.append(output.confidence)

                pages.append({
                    "page_number": page_num + 1,
                    "width": pix.width,
                    "height": pix.height,
                    "blocks": output.blocks,
                    "confidence": output.confidence,
                })

                try:
                    os.remove(img_path)
                except OSError:
                    pass

            avg_confidence = (
                sum(page_confidences) / len(page_confidences)
                if page_confidences else 0.0
            )
            full_text = "\n\n".join(all_texts)

            return OCROutput(
                text=full_text,
                markdown=full_text,
                blocks=all_blocks,
                pages=pages,
                confidence=round(avg_confidence, 3),
                engine=self.name,
                engine_version=self.version,
            )
        except Exception as e:
            print(f"[Tesseract] PDF 识别失败: {e}")
            return OCROutput(text="", engine=self.name, confidence=0.0)
        finally:
            doc.close()


class OCRRouter:
    """OCR 路由器：管理 OCR 引擎选择和降级"""

    def __init__(self):
        self.adapters: Dict[str, BaseOCRAdapter] = {
            "paddleocr": PaddleOCRAdapter(),
            "tesseract": TesseractAdapter(),
        }
        self.profiles: Dict[str, OCRProfile] = self._init_profiles()

    def _init_profiles(self) -> Dict[str, OCRProfile]:
        """初始化 OCR Profile"""
        return {
            "fast_local_ocr": OCRProfile(
                name="fast_local_ocr",
                engine="paddleocr",
                fallback_engines=["tesseract"],
                output_formats=["text", "markdown", "ldir"],
                lang="ch",
            ),
            "legal_pdf_parser": OCRProfile(
                name="legal_pdf_parser",
                engine="paddleocr",
                fallback_engines=["tesseract"],
                output_formats=["markdown", "json", "ldir"],
                lang="ch",
            ),
            "complex_document": OCRProfile(
                name="complex_document",
                engine="paddleocr",
                fallback_engines=["tesseract"],
                output_formats=["markdown", "json", "ldir"],
                lang="ch",
                options={"requires_review": True},
            ),
            "browser_local": OCRProfile(
                name="browser_local",
                engine="tesseract",
                output_formats=["plain_text", "temporary_markdown"],
                lang="chi_sim+eng",
            ),
        }

    def get_available_engines(self) -> List[str]:
        """获取当前可用的引擎列表"""
        return [
            name for name, adapter in self.adapters.items()
            if adapter.is_available()
        ]

    def process(self, file_path: str, profile_name: str = "fast_local_ocr",
                **kwargs) -> OCROutput:
        """
        处理文件：选择合适的引擎执行 OCR。

        策略：
        1. 根据 profile 选择首选引擎
        2. 首选引擎不可用时，按 fallback 列表降级
        3. 全部不可用时返回空结果 + 错误信息
        """
        profile = self.profiles.get(profile_name, self.profiles["fast_local_ocr"])
        path = Path(file_path)
        is_pdf = path.suffix.lower() == ".pdf"

        engines_to_try = [profile.engine] + profile.fallback_engines

        for engine_name in engines_to_try:
            adapter = self.adapters.get(engine_name)
            if not adapter:
                continue
            if not adapter.is_available():
                print(f"[OCR] 引擎 {engine_name} 不可用，尝试下一个")
                continue

            print(f"[OCR] 使用引擎: {engine_name}")
            try:
                if is_pdf:
                    result = adapter.recognize_pdf(str(path), lang=profile.lang, **kwargs)
                else:
                    result = adapter.recognize(str(path), lang=profile.lang, **kwargs)
            except Exception as e:
                print(f"[OCR] 引擎 {engine_name} 执行失败: {e}，尝试下一个")
                continue

            if result.text:
                result.profile = profile_name
                return result
            else:
                print(f"[OCR] 引擎 {engine_name} 未识别到文本，尝试下一个")

        # 所有引擎都不可用或未识别到文本
        print("[OCR] 警告: 所有 OCR 引擎均不可用或未识别到文本")
        return OCROutput(
            text="",
            engine="none",
            confidence=0.0,
            profile=profile_name,
        )

    def get_profile(self, name: str) -> Optional[OCRProfile]:
        """获取 profile 配置"""
        return self.profiles.get(name)
