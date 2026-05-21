# Global Commercial CADs for Lung Cancer Screening

A reference database of FDA 510(k)/PMA-cleared and CE-marked AI software devices for pulmonary nodule detection and management, compiled from regulatory databases and published literature (2001–2026).

**Live site:** https://ouyangxiaotong.github.io/global-cads-for-lcs/

---

## Features

- 42 companies · 100+ products across 8 regions
- Filter by clearance type (FDA / CE), region, and AI era
- Full-text search across companies and products
- FDA submission numbers linked to the FDA 510(k) database
- AI era classification: Rule-based → ML/Radiomics → Deep learning → VLM/Multimodal

## Data sources

- FDA 510(k)/PMA database (CDRH)
- European CE-mark AI registries, including AIforRadiology.com
- Published systematic reviews

## Repository structure

```
docs/index.html      # Public-facing static page (GitHub Pages)
src/                 # Next.js admin app (local use only)
prisma/              # Database schema and seed data
```

## Local admin

The `src/` directory contains a Next.js app for managing the database locally.

```bash
npm install
npm run dev
```

Open http://localhost:3000/admin to add or edit entries. After updating, copy the changes into `docs/index.html` and push to publish.

## License

Data compiled for academic and research reference. See individual regulatory filings for official product information.
