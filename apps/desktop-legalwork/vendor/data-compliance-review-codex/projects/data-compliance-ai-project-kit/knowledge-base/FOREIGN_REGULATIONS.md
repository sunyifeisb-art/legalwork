# Foreign Regulation Libraries

This knowledge base keeps foreign privacy and data laws separate from the existing local regulation database.

## Layout

- `local-regulations.sqlite3` remains the original local regulation database.
- `foreign-regulations/manifest.json` lists all foreign jurisdiction libraries.
- `foreign-regulations/<jurisdiction>/regulations.sqlite3` is one independent SQLite database per jurisdiction.
- `foreign-regulations-md/<jurisdiction>/` stores markdown exports for the same jurisdiction.
- `foreign-regulations-source-docs/<jurisdiction>/` stores downloaded official-source documents for full-text imports.
- `extension/public/assets/foreign-regulations/` stores one browser-search JSON index per jurisdiction.

## Source Inputs

- `foreign-regulations-seed/foreign-regulations.json`
  - Structured seed records with official source URLs, topics, keywords, and obligation summaries.
- `foreign-regulations-seed/foreign-regulations-fulltext-sources.json`
  - Priority full-text sources. These are downloaded, extracted, chunked, and inserted into the matching jurisdiction database.

## Build

From the project root:

```bash
python3 project/scripts/build_foreign_regulation_libraries.py --rebuild
python3 project/scripts/ingest_foreign_fulltext_sources.py
python3 extension/scripts/export_foreign_regulation_indexes.py
```

The extension build runs the same foreign-library steps before bundling:

```bash
cd extension
npm run build
```

## Current Coverage

- 84 separated jurisdiction libraries.
- 146 foreign law, regulation, regulator guidance, transfer instrument, sector privacy, data-security, and draft/proposed-law tracking records.
- 5 official full-text imports.

Main coverage groups:

- EU-level law, transfer instruments, EDPB guidance, and selected platform/cyber/data acts.
- EU/EEA national GDPR implementation laws for major member states and EEA jurisdictions.
- UK data protection, e-privacy, transfer, children, marketing, and sharing codes.
- US federal sector privacy/security laws plus comprehensive state privacy, biometric, health, data-broker, and data-security laws.
- Canada federal and provincial privacy laws, plus CASL and proposed federal reform tracking.
- Australia, New Zealand, and selected APAC jurisdictions.
- Latin America, Middle East, and Africa priority privacy laws.

## Current Full-Text Coverage

- EU: GDPR
- UK: Data Protection Act 2018
- US-CA: CCPA/CPRA statute
- India: Digital Personal Data Protection Act, 2023
- Brazil: LGPD official English text

Other jurisdictions currently have structured legal-reference records and can be upgraded by adding entries to `foreign-regulations-fulltext-sources.json`.
