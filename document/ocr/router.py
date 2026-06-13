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
                self._engine = PaddleOCR(
                    lang=lang,
                    use_textline_orientation=True,
                )
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
                full_text = "\n".join(block["text"] for block in blocks)
            else:
                # PaddleOCR v2.x API: ocr(img, cls=True)
                result = self._engine.ocr(image_path, cls=True)
                if not result or not result[0]:
                    return OCROutput(text="", engine=self.name, confidence=0.0)

                texts = []
                blocks = []
                total_confidence = 0.0
                count = 0

                for line in result[0]:
                    bbox, (text, confidence) = line
                    texts.append(text)
                    blocks.append({
                        "text": text,
                        "bbox": bbox,
                        "confidence": confidence,
                    })
                    total_confidence += confidence
                    count += 1

                avg_confidence = total_confidence / count if count > 0 else 0.0
                full_text = "\n".join(texts)

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

            texts = []
            blocks = []
            total_confidence = 0.0
            count = 0

            for i in range(len(data["text"])):
                text = data["text"][i].strip()
                conf = int(data["conf"][i]) if data["conf"][i] != "-1" else 0
                if text:
                    texts.append(text)
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
            full_text = "\n".join(texts)

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
        text = re.sub(r'([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])\s+([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])', r'\1\2', text)
        # 中文字符与中文标点之间的空格去掉
        text = re.sub(r'([\u4e00-\u9fff])\s+([，。；：？！、）】》」\'"])', r'\1\2', text)
        text = re.sub(r'([（【「『])\s+([\u4e00-\u9fff])', r'\1\2', text)
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
