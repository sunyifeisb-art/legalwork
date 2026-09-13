from __future__ import annotations

import json
import os
from urllib import error, request


def runtime_model_available() -> bool:
    return bool(
        os.environ.get('LEGALWORK_RUNTIME_BASE_URL', '').strip()
        and os.environ.get('LEGALWORK_RUNTIME_TOKEN', '').strip()
    )


def generate_model_text(
    system_prompt: str,
    user_prompt: str,
    *,
    model: str = '',
    max_tokens: int = 2048,
    response_format: str = 'json_object',
) -> str:
    base_url = os.environ.get('LEGALWORK_RUNTIME_BASE_URL', '').strip().rstrip('/')
    token = os.environ.get('LEGALWORK_RUNTIME_TOKEN', '').strip()
    if not base_url or not token:
        raise RuntimeError('Legalwork Agent runtime is not available.')

    payload = {
        'systemPrompt': system_prompt,
        'userPrompt': user_prompt,
        'maxTokens': max_tokens,
        'reasoningEffort': 'off',
        'responseFormat': response_format,
    }
    if model.strip():
        payload['model'] = model.strip()

    req = request.Request(
        f'{base_url}/v1/model/generate',
        data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        method='POST',
    )
    try:
        with request.urlopen(req, timeout=120) as response:
            body = response.read().decode('utf-8')
    except error.HTTPError as exc:
        detail = exc.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'Legalwork Agent model call failed (HTTP {exc.code}): {detail}') from exc
    except error.URLError as exc:
        raise RuntimeError(f'Legalwork Agent model call failed: {exc.reason}') from exc

    try:
        parsed = json.loads(body)
    except json.JSONDecodeError as exc:
        raise RuntimeError('Legalwork Agent model call returned invalid JSON.') from exc
    text = parsed.get('text') if isinstance(parsed, dict) else None
    if not isinstance(text, str) or not text.strip():
        raise RuntimeError('Legalwork Agent model call returned no text.')
    return text.strip()
