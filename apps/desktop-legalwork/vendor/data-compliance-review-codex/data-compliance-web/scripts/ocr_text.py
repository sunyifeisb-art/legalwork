from __future__ import annotations

import shutil
from pathlib import Path

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


OCR_LANG = 'chi_sim+eng'
OCR_FALLBACK_LANG = 'eng'
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tif', '.tiff'}


class OcrUnavailable(RuntimeError):
    pass


def _missing_dependencies(require_pdf: bool = False) -> list[str]:
    missing: list[str] = []
    if require_pdf and fitz is None:
        missing.append('PyMuPDF')
    if Image is None:
        missing.append('Pillow')
    if pytesseract is None:
        missing.append('pytesseract')
    if not shutil.which('tesseract'):
        missing.append('system tesseract')
    return missing


def ensure_ocr_available(*, require_pdf: bool = False) -> None:
    missing = _missing_dependencies(require_pdf=require_pdf)
    if missing:
        raise OcrUnavailable('OCR 依赖缺失：' + ', '.join(missing))


def _image_to_string(image) -> str:
    assert pytesseract is not None
    try:
        return pytesseract.image_to_string(image, lang=OCR_LANG)
    except Exception:
        return pytesseract.image_to_string(image, lang=OCR_FALLBACK_LANG)


def ocr_image_to_data(image) -> dict:
    ensure_ocr_available()
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
