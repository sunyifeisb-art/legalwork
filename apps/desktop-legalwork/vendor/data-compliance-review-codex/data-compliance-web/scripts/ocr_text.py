from __future__ import annotations

import os
import platform
import re
import shutil
import subprocess
import sys
from pathlib import Path

try:
    import numpy as np
except Exception:  # pragma: no cover - optional dependency
    np = None

try:
    import fitz  # PyMuPDF
except Exception:  # pragma: no cover - optional dependency
    fitz = None

try:
    from PIL import Image
except Exception:  # pragma: no cover - optional dependency
    Image = None

try:
    import pytesseract
except Exception:  # pragma: no cover - optional dependency
    pytesseract = None

try:
    from paddleocr import PaddleOCR
except Exception:  # pragma: no cover - optional dependency
    PaddleOCR = None


OCR_LANG = 'chi_sim+eng'
OCR_FALLBACK_LANG = 'eng'
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tif', '.tiff'}
TESSERACT_ENV_KEYS = ('LEGALWORK_TESSERACT_CMD', 'TESSERACT_CMD')
OCR_ROOT_ENV_KEYS = ('LEGALWORK_OCR_ROOT', 'TESSERACT_ROOT')
PADDLE_MODEL_ROOT_ENV_KEYS = ('LEGALWORK_PADDLEOCR_MODEL_ROOT', 'PADDLEOCR_MODEL_ROOT')
PADDLE_LANG = os.environ.get('LEGALWORK_PADDLEOCR_LANG', 'ch')
_PADDLE_ENGINE = None


class OcrUnavailable(RuntimeError):
    pass


def _bbox_rect(box) -> tuple[float, float, float, float] | None:
    try:
        if hasattr(box, 'tolist'):
            box = box.tolist()
        if len(box) == 4 and all(isinstance(item, (int, float)) for item in box):
            x0, y0, x1, y1 = [float(item) for item in box]
            return min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1)
        points = []
        for point in box:
            if hasattr(point, 'tolist'):
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


def _median(values: list[float], default: float) -> float:
    values = sorted(value for value in values if value > 0)
    if not values:
        return default
    mid = len(values) // 2
    if len(values) % 2:
        return values[mid]
    return (values[mid - 1] + values[mid]) / 2


def _is_cjk_or_punctuation(char: str) -> bool:
    return bool(re.match(r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef，。；：？！、）】》」』]', char))


def _needs_space(previous: str, current: str, gap: float, median_height: float) -> bool:
    if not previous or not current:
        return False
    if _is_cjk_or_punctuation(previous[-1]) or _is_cjk_or_punctuation(current[0]):
        return False
    return gap > max(2.0, median_height * 0.12)


def _assemble_ocr_rows(rows: list[tuple[list[list[float]], str, float]]) -> str:
    positioned = []
    unpositioned: list[str] = []
    for box, text, _score in rows:
        clean = str(text).strip()
        if not clean:
            continue
        rect = _bbox_rect(box)
        if rect is None:
            unpositioned.append(clean)
            continue
        x0, y0, x1, y1 = rect
        positioned.append({
            'text': clean,
            'x0': x0,
            'y0': y0,
            'x1': x1,
            'y1': y1,
            'cy': (y0 + y1) / 2,
            'height': max(1.0, y1 - y0),
        })

    if not positioned:
        return '\n'.join(unpositioned).strip()

    median_height = _median([item['height'] for item in positioned], 14.0)
    line_threshold = max(4.0, median_height * 0.65)
    lines: list[list[dict]] = []
    for item in sorted(positioned, key=lambda part: (part['cy'], part['x0'])):
        target = None
        for line in reversed(lines[-3:]):
            line_center = sum(part['cy'] for part in line) / len(line)
            if abs(item['cy'] - line_center) <= line_threshold:
                target = line
                break
        if target is None:
            lines.append([item])
        else:
            target.append(item)

    output_lines: list[str] = []
    previous_bottom: float | None = None
    paragraph_gap = max(10.0, median_height * 1.65)
    for line in lines:
        line.sort(key=lambda part: part['x0'])
        line_top = min(part['y0'] for part in line)
        line_bottom = max(part['y1'] for part in line)
        if previous_bottom is not None and line_top - previous_bottom > paragraph_gap:
            output_lines.append('')
        parts: list[str] = []
        previous_right: float | None = None
        for item in line:
            if parts and previous_right is not None and _needs_space(parts[-1], item['text'], item['x0'] - previous_right, median_height):
                parts.append(' ')
            parts.append(item['text'])
            previous_right = item['x1']
        output_lines.append(''.join(parts).strip())
        previous_bottom = line_bottom

    if unpositioned:
        output_lines.extend(unpositioned)
    return '\n'.join(output_lines).strip()


def _paddle_engine():
    global _PADDLE_ENGINE
    if PaddleOCR is None or np is None:
        return None
    if _PADDLE_ENGINE is not None:
        return _PADDLE_ENGINE
    kwargs = {
        'lang': PADDLE_LANG,
        'show_log': False,
        'use_textline_orientation': True,
    }
    model_dirs = _paddle_model_dirs()
    kwargs.update(_paddle_model_kwargs(model_dirs))
    if model_dirs:
        kwargs.pop('lang', None)
    try:
        _PADDLE_ENGINE = PaddleOCR(**kwargs)
    except (TypeError, ValueError):
        kwargs.pop('show_log', None)
        try:
            _PADDLE_ENGINE = PaddleOCR(**kwargs)
        except (TypeError, ValueError):
            kwargs.pop('use_angle_cls', None)
            kwargs['use_textline_orientation'] = True
            _PADDLE_ENGINE = PaddleOCR(**kwargs)
    return _PADDLE_ENGINE


def _candidate_paddle_model_roots() -> list[Path]:
    explicit_roots: list[Path] = []
    for key in PADDLE_MODEL_ROOT_ENV_KEYS:
        raw = os.environ.get(key)
        if raw:
            explicit_roots.append(Path(raw).expanduser())
    if explicit_roots:
        return explicit_roots

    roots: list[Path] = []
    for root in _candidate_ocr_roots():
        roots.extend([
            root / 'paddle-models',
            root / 'paddleocr-models',
            root / 'official_models',
        ])
    roots.append(Path.home() / '.paddlex' / 'official_models')
    return roots


def _paddle_model_dir(name: str) -> str | None:
    for root in _candidate_paddle_model_roots():
        candidate = root / name
        if candidate.is_dir():
            return str(candidate)
    return None


def _paddle_model_dirs() -> dict[str, str]:
    v6_mapping = {
        'doc_orientation_classify_model_dir': 'PP-LCNet_x1_0_doc_ori',
        'doc_unwarping_model_dir': 'UVDoc',
        'textline_orientation_model_dir': 'PP-LCNet_x1_0_textline_ori',
        'text_detection_model_dir': 'PP-OCRv6_medium_det',
        'text_recognition_model_dir': 'PP-OCRv6_medium_rec',
    }
    v6_result: dict[str, str] = {}
    for key, name in v6_mapping.items():
        model_dir = _paddle_model_dir(name)
        if model_dir:
            v6_result[key] = model_dir
    if (
        'text_detection_model_dir' in v6_result
        and 'text_recognition_model_dir' in v6_result
    ):
        return v6_result

    v4_mapping = {
        'text_detection_model_dir': 'PP-OCRv4_mobile_det',
        'text_recognition_model_dir': 'PP-OCRv4_mobile_rec',
    }
    v4_result: dict[str, str] = {}
    for key, name in v4_mapping.items():
        model_dir = _paddle_model_dir(name)
        if model_dir:
            v4_result[key] = model_dir
    return v4_result


def _paddle_model_kwargs(model_dirs: dict[str, str]) -> dict:
    kwargs = dict(model_dirs)
    det_dir = model_dirs.get('text_detection_model_dir')
    rec_dir = model_dirs.get('text_recognition_model_dir')
    if (
        det_dir
        and rec_dir
        and Path(det_dir).name == 'PP-OCRv4_mobile_det'
        and Path(rec_dir).name == 'PP-OCRv4_mobile_rec'
    ):
        kwargs.update({
            'text_detection_model_name': 'PP-OCRv4_mobile_det',
            'text_recognition_model_name': 'PP-OCRv4_mobile_rec',
            'use_doc_orientation_classify': False,
            'use_doc_unwarping': False,
            'use_textline_orientation': False,
        })
    return kwargs


def _paddle_available() -> bool:
    try:
        return _paddle_engine() is not None
    except Exception:
        return False


def _normalize_paddle_result(result) -> list[tuple[list[list[float]], str, float]]:
    """Normalize PaddleOCR 2.x/3.x outputs into (box, text, score)."""
    rows: list[tuple[list[list[float]], str, float]] = []

    def add_line(line) -> None:
      if not line:
          return
      if isinstance(line, dict):
          text = line.get('text') or line.get('rec_text') or ''
          score = line.get('score') or line.get('rec_score') or 0
          box = line.get('points') or line.get('box') or line.get('dt_polys')
          if text and box is not None:
              rows.append((box, str(text), float(score or 0)))
          return
      if isinstance(line, (list, tuple)) and len(line) >= 2:
          box = line[0]
          payload = line[1]
          if isinstance(payload, (list, tuple)) and payload:
              text = payload[0]
              score = payload[1] if len(payload) > 1 else 0
              rows.append((box, str(text), float(score or 0)))

    if isinstance(result, dict):
        texts = result.get('rec_texts') or result.get('texts') or []
        scores = result.get('rec_scores') or result.get('scores') or []
        boxes = result.get('rec_polys') or result.get('rec_boxes') or result.get('dt_polys') or result.get('boxes') or []
        for index, text in enumerate(texts):
            if not text:
                continue
            box = boxes[index] if index < len(boxes) else None
            if box is None:
                continue
            score = scores[index] if index < len(scores) else 0
            rows.append((box, str(text), float(score or 0)))
        return rows

    if isinstance(result, list):
        for item in result:
            if isinstance(item, dict):
                rows.extend(_normalize_paddle_result(item))
            elif isinstance(item, list) and item and isinstance(item[0], (list, tuple, dict)):
                # PaddleOCR 2.x returns one page list around line results.
                for line in item:
                    add_line(line)
            else:
                add_line(item)
    return rows


def _paddle_ocr_rows(image) -> list[tuple[list[list[float]], str, float]]:
    engine = _paddle_engine()
    if engine is None or np is None:
        return []
    array = np.array(image.convert('RGB'))
    try:
        raw = engine.ocr(array, cls=True)
    except TypeError:
        raw = engine.ocr(array)
    return _normalize_paddle_result(raw)


def _paddle_image_to_string(image) -> str:
    rows = _paddle_ocr_rows(image)
    return _assemble_ocr_rows(rows)


def _paddle_image_to_data(image) -> dict:
    rows = _paddle_ocr_rows(image)
    data = {
        'text': [],
        'left': [],
        'top': [],
        'width': [],
        'height': [],
        'line_num': [],
        'word_num': [],
        'block_num': [],
        'par_num': [],
        'conf': [],
    }
    for index, (box, text, score) in enumerate(rows, start=1):
        try:
            xs = [float(point[0]) for point in box]
            ys = [float(point[1]) for point in box]
        except Exception:
            continue
        left = int(max(0, min(xs)))
        top = int(max(0, min(ys)))
        right = int(max(xs))
        bottom = int(max(ys))
        data['text'].append(text)
        data['left'].append(left)
        data['top'].append(top)
        data['width'].append(max(1, right - left))
        data['height'].append(max(1, bottom - top))
        data['line_num'].append(index)
        data['word_num'].append(1)
        data['block_num'].append(index)
        data['par_num'].append(1)
        data['conf'].append(round(score * 100, 2))
    return data


def ocr_backend_status() -> dict:
    return {
        'preferred': 'paddleocr',
        'paddleocr_importable': PaddleOCR is not None,
        'numpy_importable': np is not None,
        'paddleocr_available': PaddleOCR is not None and np is not None,
        'paddleocr_initialized': _PADDLE_ENGINE is not None,
        'bundled_model_count': len(_paddle_model_dirs()),
        'pytesseract_importable': pytesseract is not None,
        'tesseract_available': bool(_configure_tesseract()) if pytesseract is not None else False,
    }


def _binary_names() -> list[str]:
    return ['tesseract.exe', 'tesseract'] if sys.platform == 'win32' else ['tesseract']


def _platform_tags() -> list[str]:
    machine = platform.machine().lower()
    aliases = {
        'aarch64': 'arm64',
        'x86_64': 'x64',
        'amd64': 'x64',
    }
    normalized_machine = aliases.get(machine, machine)
    system = {
        'darwin': 'mac',
        'win32': 'win',
        'linux': 'linux',
    }.get(sys.platform, sys.platform)
    return [
        f'{sys.platform}-{machine}',
        f'{sys.platform}-{normalized_machine}',
        f'{system}-{normalized_machine}',
        system,
    ]


def _candidate_ocr_roots() -> list[Path]:
    roots: list[Path] = []
    for key in OCR_ROOT_ENV_KEYS:
        raw = os.environ.get(key)
        if raw:
            roots.append(Path(raw).expanduser())

    script_dir = Path(__file__).resolve().parent
    for parent in [script_dir, *script_dir.parents]:
        roots.extend([
            parent / 'ocr-runtime',
            parent / 'vendor' / 'ocr-runtime',
            parent / 'runtime' / 'ocr',
        ])

    return roots


def _candidate_tesseract_paths() -> list[Path]:
    candidates: list[Path] = []
    for root in _candidate_ocr_roots():
        for tag in _platform_tags():
            for name in _binary_names():
                candidates.extend([
                    root / tag / 'bin' / name,
                    root / 'bin' / tag / name,
                ])
        for name in _binary_names():
            candidates.extend([
                root / 'bin' / name,
                root / name,
            ])
    return candidates


def _is_executable(path: Path) -> bool:
    return path.is_file() and (sys.platform == 'win32' or os.access(path, os.X_OK))


def _find_tesseract_cmd() -> str | None:
    for key in TESSERACT_ENV_KEYS:
        raw = os.environ.get(key)
        if raw and _is_executable(Path(raw).expanduser()):
            return str(Path(raw).expanduser())

    found = shutil.which('tesseract')
    if found:
        return found

    for candidate in _candidate_tesseract_paths():
        if _is_executable(candidate):
            return str(candidate)
    return None


def _find_homebrew_cmd() -> str | None:
    for candidate in ('/opt/homebrew/bin/brew', '/usr/local/bin/brew'):
        if _is_executable(Path(candidate)):
            return candidate
    return shutil.which('brew')


def _try_install_tesseract() -> bool:
    return False


def _candidate_tessdata_dirs(tesseract_cmd: str) -> list[Path]:
    command = Path(tesseract_cmd).resolve()
    roots = [command.parent.parent, *_candidate_ocr_roots()]
    dirs: list[Path] = []
    for root in roots:
        for tag in _platform_tags():
            dirs.extend([
                root / tag / 'share' / 'tessdata',
                root / tag / 'tessdata',
            ])
        dirs.extend([
            root / 'share' / 'tessdata',
            root / 'tessdata',
        ])
    return dirs


def _configure_tesseract() -> str | None:
    cmd = _find_tesseract_cmd()
    if not cmd:
        return None

    if pytesseract is not None:
        pytesseract.pytesseract.tesseract_cmd = cmd

    if not os.environ.get('TESSDATA_PREFIX'):
        for tessdata_dir in _candidate_tessdata_dirs(cmd):
            if tessdata_dir.is_dir():
                os.environ['TESSDATA_PREFIX'] = str(tessdata_dir)
                break

    return cmd


def _missing_dependencies(require_pdf: bool = False) -> list[str]:
    missing: list[str] = []
    if require_pdf and fitz is None:
        missing.append('PDF 页面读取组件')
    if Image is None:
        missing.append('图片处理组件')
    if _paddle_available():
        return missing
    if pytesseract is None:
        missing.append('图片文字识别组件 PaddleOCR')
    elif not _configure_tesseract() and not (_try_install_tesseract() and _configure_tesseract()):
        missing.append('OCR 识别引擎 PaddleOCR')
    return missing


def ensure_ocr_available(*, require_pdf: bool = False) -> None:
    missing = _missing_dependencies(require_pdf=require_pdf)
    if missing:
        raise OcrUnavailable(
            '材料脱敏需要 OCR 组件，但当前环境缺少：'
            + '、'.join(missing)
            + '。请在软件内修复 OCR 组件后重试；如仍失败，请联系技术支持。'
        )


def _image_to_string(image) -> str:
    if _paddle_available():
        return _paddle_image_to_string(image)
    assert pytesseract is not None
    try:
        return pytesseract.image_to_string(image, lang=OCR_LANG)
    except Exception:
        return pytesseract.image_to_string(image, lang=OCR_FALLBACK_LANG)


def ocr_image_to_data(image) -> dict:
    ensure_ocr_available()
    if _paddle_available():
        return _paddle_image_to_data(image)
    assert pytesseract is not None
    try:
        return pytesseract.image_to_data(image, lang=OCR_LANG, output_type=pytesseract.Output.DICT)
    except Exception:
        return pytesseract.image_to_data(image, lang=OCR_FALLBACK_LANG, output_type=pytesseract.Output.DICT)


def extract_image_text(path: Path) -> str:
    ensure_ocr_available()
    assert Image is not None
    with Image.open(path) as image:
        return _image_to_string(image.convert('RGB')).strip()


def extract_pdf_ocr_text(path: Path, *, scale: int = 2) -> str:
    ensure_ocr_available(require_pdf=True)
    assert fitz is not None
    assert Image is not None
    pages: list[str] = []
    pdf = fitz.open(str(path))
    try:
        for page_index, page in enumerate(pdf, start=1):
            pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
            image = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
            page_text = _image_to_string(image).strip()
            if page_text:
                pages.append(f'--- OCR 第 {page_index} 页 ---\n{page_text}')
            else:
                pages.append(f'--- OCR 第 {page_index} 页 ---')
    finally:
        pdf.close()

    text = '\f'.join(pages).strip()
    body_text = '\n'.join(
        line
        for part in pages
        for line in part.splitlines()
        if not line.strip().startswith('--- OCR 第')
    ).strip()
    if not text or not body_text:
        raise RuntimeError('OCR 未识别到可审查文本')
    return text
