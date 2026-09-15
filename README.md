
# Plasma Care — Laboratory Report Generator

A browser-based report generator inspired by the supplied LabSmart-style report formats. The brand is **Plasma Care**.

## Included
- 105 supplied PDF report formats organized by category as reference assets.
- Categories: Biochemistry, Serology & Immunology, Panels, Haematology, Clinical Pathology, Endocrinology, Microbiology.
- Test search and category filtering.
- Patient/registration fields.
- Editable report parameters, units and reference ranges.
- Add/remove parameters.
- Clinical notes/comments.
- A4 PDF generation directly in the browser.
- Responsive UI for desktop/mobile.
- No server or database is required for the starter version.

## Run locally
```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Build
```bash
npm run build
```

The `dist/` folder can be deployed to GitHub Pages or another static host.

## Important
The PDFs in `public/reference-formats/` are the user-supplied reference formats. They are included so each test can be mapped to its source format while the UI is being expanded.

For production clinical use, have a qualified laboratory/pathologist validate every test's reference range, units, interpretation, report wording, calculations, and authorization/signature workflow. The software should not automatically diagnose a patient.
