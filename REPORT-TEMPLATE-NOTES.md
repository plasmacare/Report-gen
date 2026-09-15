
# Template implementation notes

The supplied archive contains report PDFs for individual tests and panels. Their common visual structure is:

1. Plasma Care/laboratory header
2. Patient and registration information
3. Department heading
4. Test title
5. TEST / VALUE / UNIT / REFERENCE table
6. Optional clinical notes/interpretation/comments
7. Lab in-charge and pathologist footer
8. End-of-report marker

The starter application implements this common structure and preloads representative parameter rows for CBC, Urine Routine and several common individual tests. Other supplied tests start with a matching parameter name and can be expanded with exact parameter rows/reference values during the next template-mapping pass.
