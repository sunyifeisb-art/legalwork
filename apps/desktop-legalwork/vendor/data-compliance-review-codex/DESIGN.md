# Data Compliance Extension Design Guide

## Direction

This project already has a clear product UI language in [web/templates/index.html](/Users/xiangyang/Desktop/研发测试/data-compliance-review-codex/web/templates/index.html:1) and [web/templates/result.html](/Users/xiangyang/Desktop/研发测试/data-compliance-review-codex/web/templates/result.html:1). The browser extension should preserve that visual system instead of introducing a new brand direction.

The extension should feel like a compact continuation of the existing product:
- clean light surfaces
- editorial card layout
- legal/compliance tone, not consumer-playful
- strong hierarchy around risk levels, evidence, and actions

## Tokens

### Color

- Background: `#f8fafc`
- Surface: `#ffffff`
- Primary text: `#0f172a`
- Secondary text: `#475569`
- Muted text: `#94a3b8`
- Border: `#e2e8f0`
- Accent: `#4f46e5`
- Accent hover: `#4338ca`
- Accent tint: `#e0e7ff`
- High risk: `#ef4444`
- High risk bg: `#fef2f2`
- Medium risk: `#f97316`
- Medium risk bg: `#fff7ed`
- Advisory: `#3b82f6`
- Advisory bg: `#eff6ff`
- Success: `#22c55e`

### Typography

- Heading family: `"Plus Jakarta Sans", "Inter", "Noto Sans SC", sans-serif`
- Body family: `"Inter", "Noto Sans SC", sans-serif`
- Large hero/result headings: 32px to 52px, weight `800`
- Section headings: 22px to 24px, weight `700`
- Card headings: 15px to 18px, weight `600`
- Body text: 14px to 16px
- Meta labels: 12px to 13px uppercase where appropriate

### Radius and Shadow

- Large surface/card radius: `20px` to `24px`
- Input/button radius: `12px`
- Small chips/badges: `999px`
- Standard shadow: `0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.05)`
- Elevated shadow: `0 10px 40px rgba(0,0,0,0.08)`

## Layout Rules

- Side panel should use a dense, single-column card stack with generous internal padding.
- Result page should use a wide reading layout with a sticky sidebar on desktop-like widths.
- Keep the “overview -> risks -> remediation -> evidence” reading order from the current product.
- Information-rich sections should live in white cards on the pale background.

## Components

### Buttons

- Primary button uses accent background, white text, medium shadow.
- Hover should lift subtly and darken accent.
- Disabled buttons reduce opacity and remove lift.

### Inputs

- Inputs and textareas sit on subtle tinted background with 1px border.
- Focus uses accent border.
- File drop area uses dashed border and accent tint on hover/drag.

### Risk Presentation

- Risk badges must be immediate and color-coded.
- Risk cards keep a left analysis column and right action column when space allows.
- Evidence and regulatory details should collapse under a secondary reveal.

### Progress and Feedback

- Long-running review flows use a modal or prominent inline progress card.
- Progress copy should sound operational and calm, not playful.
- Errors should surface in a bordered card/modal with direct recovery guidance.

## Extension-Specific Adaptation

- Side panel is not a marketing page; remove oversized hero flourishes but keep the typography and visual tokens.
- Result page can keep the current desktop-like audit report structure.
- Settings page should look like a lightweight admin/preferences screen in the same design language.
- Recent jobs should appear as quiet list cards, not dashboard widgets.

## Do Not

- Do not switch to a dark theme for the extension.
- Do not introduce gradients, glassmorphism, neon, or consumer SaaS styling.
- Do not replace the existing risk palette with a new semantic system.
- Do not make the popup/side panel feel like a browser-tool toy; it should still read like a professional review product.
