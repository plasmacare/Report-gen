
# Suggested production data model

## patients
- id
- name
- age
- sex
- phone
- address
- created_at

## reports
- id
- patient_id
- registration_no
- category
- test_id
- referred_by
- registered_at
- collected_at
- received_at
- reported_at
- status: draft | verified | released
- notes
- created_at

## report_results
- id
- report_id
- parameter_name
- value
- unit
- reference_range
- flag
- sort_order

## staff
- id
- name
- role
- signature_url
- active

For a real lab system, add authentication, role permissions, audit logs, report verification, immutable released reports, backups, and a secure backend/database.
