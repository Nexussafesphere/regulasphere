-- ============================================
-- REGULASPHERE SEED DATA
-- Nexus SafeSphere Technologies Limited
-- ============================================

-- ============================================
-- REMEDIATION CHECKLISTS (regulatory_knowledge)
-- ============================================

-- NDPC REMEDIATION CHECKLISTS
INSERT INTO regulatory_knowledge (regulator, title, content, legal_basis, category, metadata) VALUES

('NDPC', 'How to File Annual Data Protection Audit', 'Step 1: Conduct internal data protection audit. Step 2: Engage a licensed DPCO. Step 3: Submit audit report via NDPC portal. Step 4: Pay filing fee. Step 5: Obtain acknowledgment from NDPC.', 'NDPA 2023 Section 4.1(7)', 'Data Protection', '{"difficulty": "Medium", "time_required": "30-45 days", "cost": "NGN 500,000 - 2,000,000"}'),

('NDPC', 'How to Conduct Data Protection Impact Assessment', 'Step 1: Identify data processing activities. Step 2: Assess risks to data subjects. Step 3: Document mitigation measures. Step 4: Submit DPIA to NDPC if high risk. Step 5: Obtain NDPC approval if required.', 'NDPA 2023 Section 28', 'Data Protection', '{"difficulty": "High", "time_required": "15-30 days", "cost": "NGN 1,000,000 - 5,000,000"}'),

('NDPC', 'Data Breach Response Protocol', 'Step 1: Document breach details. Step 2: Assess impact on data subjects. Step 3: Notify NDPC within 72 hours. Step 4: Notify affected data subjects. Step 5: Implement corrective measures. Step 6: Document lessons learned.', 'NDPA 2023 Section 40', 'Data Protection', '{"difficulty": "High", "time_required": "Immediate (72 hours)", "cost": "Varies by breach size"}'),

('NDPC', 'Data Subject Rights Compliance', 'Step 1: Create data subject request procedure. Step 2: Train staff on handling requests. Step 3: Respond within 30 days. Step 4: Document all requests and responses. Step 5: Implement right to erasure, rectification, and portability.', 'NDPA 2023 Sections 34-36', 'Data Protection', '{"difficulty": "Medium", "time_required": "Ongoing", "cost": "NGN 200,000 - 1,000,000"}'),

('NDPC', 'Cross-Border Data Transfer Compliance', 'Step 1: Map international data flows. Step 2: Assess recipient country adequacy. Step 3: Implement Standard Contractual Clauses. Step 4: Obtain NDPC approval if required. Step 5: Document transfer safeguards.', 'NDPA 2023 Section 41', 'Data Protection', '{"difficulty": "High", "time_required": "30-60 days", "cost": "NGN 500,000 - 2,000,000"}'),

('NDPC', 'Privacy Policy and Notice Creation', 'Step 1: Draft privacy policy. Step 2: Publish on website and app. Step 3: Ensure clear and accessible language. Step 4: Update regularly. Step 5: Obtain consent where required.', 'NDPA 2023 Section 25', 'Data Protection', '{"difficulty": "Low", "time_required": "5-10 days", "cost": "NGN 100,000 - 500,000"}'),

('NDPC', 'DPCO Engagement Guide', 'Step 1: Identify if DPCO needed (25+ employees or sensitive data). Step 2: Select licensed DPCO from NDPC list. Step 3: Sign engagement agreement. Step 4: File DPCO agreement with NDPC. Step 5: Work with DPCO on compliance.', 'NDPA 2023 Section 4.1(7)', 'Data Protection', '{"difficulty": "Medium", "time_required": "7-14 days", "cost": "NGN 500,000 - 3,000,000 annually"}'),

-- NITDA REMEDIATION CHECKLISTS
('NITDA', 'AI Governance Framework Compliance', 'Step 1: Register AI systems with NITDA. Step 2: Create AI governance policy. Step 3: Appoint AI officer. Step 4: Conduct algorithm impact assessment. Step 5: File compliance report. Step 6: Implement transparency measures.', 'NITDA AI Governance Framework 2025', 'AI Governance', '{"difficulty": "High", "time_required": "30-60 days", "cost": "NGN 2,000,000 - 10,000,000"}'),

('NITDA', 'AI Transparency Report Filing', 'Step 1: Document AI decision logic. Step 2: Prepare transparency report. Step 3: File quarterly report with NITDA. Step 4: Publish transparency notice. Step 5: Update as AI systems change.', 'NITDA AI Governance Framework 2025', 'AI Governance', '{"difficulty": "Medium", "time_required": "5-10 days", "cost": "NGN 500,000 - 2,000,000"}'),

('NITDA', 'Cybersecurity Compliance', 'Step 1: Conduct cybersecurity risk assessment. Step 2: Implement security controls. Step 3: Develop incident response plan. Step 4: Train staff on security. Step 5: File compliance certificate with NITDA.', 'NITDA Act 2024', 'AI Governance', '{"difficulty": "High", "time_required": "30-60 days", "cost": "NGN 1,000,000 - 5,000,000"}'),

-- CAC REMEDIATION CHECKLISTS
('CAC', 'Annual Returns Filing', 'Step 1: Login to CAC portal. Step 2: Fill Form CAC 10. Step 3: Upload financial statements. Step 4: Pay filing fee (NGN 5,000 - 50,000). Step 5: Submit returns. Step 6: Download acknowledgment.', 'CAMA 2020 Section 417', 'CAC', '{"difficulty": "Low", "time_required": "1-3 days", "cost": "NGN 5,000 - 50,000"}'),

('CAC', 'Business Name Renewal', 'Step 1: Check renewal date on certificate. Step 2: Login to CAC portal. Step 3: Pay renewal fee. Step 4: Update business information. Step 5: Download new certificate.', 'CAMA 2020', 'CAC', '{"difficulty": "Low", "time_required": "1-2 days", "cost": "NGN 5,000 - 20,000"}'),

('CAC', 'Company Incorporation', 'Step 1: Conduct name search. Step 2: Prepare incorporation documents. Step 3: Pay filing fee. Step 4: Submit to CAC. Step 5: Receive Certificate of Incorporation.', 'CAMA 2020', 'CAC', '{"difficulty": "Medium", "time_required": "5-14 days", "cost": "NGN 20,000 - 100,000"}'),

-- FIRS REMEDIATION CHECKLISTS
('FIRS', 'Company Income Tax Filing', 'Step 1: Prepare financial statements. Step 2: File Form CIT. Step 3: Pay tax due (30% for large companies, 20% for medium). Step 4: Obtain Tax Clearance Certificate. Step 5: Keep records for 6 years.', 'Companies Income Tax Act', 'Tax', '{"difficulty": "Medium", "time_required": "7-14 days", "cost": "Varies by revenue"}'),

('FIRS', 'VAT Monthly Remittance', 'Step 1: Calculate VAT collected (7.5%). Step 2: File Form VAT 002. Step 3: Pay by 21st of the month. Step 4: Keep records. Step 5: Reconcile monthly.', 'VAT Act', 'Tax', '{"difficulty": "Low", "time_required": "1-2 days monthly", "cost": "7.5% of taxable goods/services"}'),

('FIRS', 'Withholding Tax Remittance', 'Step 1: Calculate WHT deducted (5% or 10% depending on transaction). Step 2: File WHT schedule. Step 3: Remit to FIRS by 21st. Step 4: Issue WHT certificates to vendors. Step 5: Keep records.', 'WHT Regulations', 'Tax', '{"difficulty": "Low", "time_required": "1-2 days monthly", "cost": "5-10% of transaction value"}'),

('FIRS', 'Tax Clearance Certificate Application', 'Step 1: File all tax returns. Step 2: Pay all outstanding taxes. Step 3: Apply via FIRS portal. Step 4: Provide supporting documents. Step 5: Receive TCC (valid for 1 year).', 'FIRS Guidelines', 'Tax', '{"difficulty": "Medium", "time_required": "7-21 days", "cost": "Free if compliant"}'),

-- CBN REMEDIATION CHECKLISTS
('CBN', 'Fintech License Application', 'Step 1: Prepare business plan. Step 2: Meet capital requirements. Step 3: Submit application to CBN. Step 4: Pay application fee. Step 5: Await approval (30-90 days). Step 6: Obtain license.', 'CBN Guidelines on Electronic Payments', 'Licensing', '{"difficulty": "High", "time_required": "30-90 days", "cost": "NGN 5,000,000 - 50,000,000"}'),

('CBN', 'Fintech License Renewal', 'Step 1: Review license terms. Step 2: Prepare renewal documentation. Step 3: Submit renewal application. Step 4: Pay renewal fee. Step 5: Await approval. Step 6: Receive renewed license.', 'CBN Guidelines on Electronic Payments', 'Licensing', '{"difficulty": "High", "time_required": "30-60 days", "cost": "NGN 5,000,000+"}'),

('CBN', 'AML Report Filing', 'Step 1: Compile transaction data. Step 2: Run AML screening. Step 3: File quarterly report. Step 4: Update KYC records. Step 5: Report suspicious transactions. Step 6: Maintain audit trail.', 'CBN AML Guidelines', 'Licensing', '{"difficulty": "Medium", "time_required": "5-10 days quarterly", "cost": "Varies"}'),

-- SEC REMEDIATION CHECKLISTS
('SEC', 'VASP Registration', 'Step 1: Prepare board resolution. Step 2: Fill SEC Form A. Step 3: Pay NGN 500,000 fee. Step 4: Submit documentation. Step 5: Respond to SEC queries. Step 6: Await approval (30-90 days).', 'SEC Digital Assets Rules', 'Licensing', '{"difficulty": "High", "time_required": "30-90 days", "cost": "NGN 500,000 - 5,000,000"}'),

('SEC', 'Digital Asset Offering Compliance', 'Step 1: Prepare whitepaper. Step 2: Submit to SEC for approval. Step 3: Pay filing fee. Step 4: Obtain approval. Step 5: File post-offering reports.', 'SEC Digital Assets Rules', 'Licensing', '{"difficulty": "High", "time_required": "60-120 days", "cost": "NGN 1,000,000 - 10,000,000"}'),

-- PENCOM REMEDIATION CHECKLISTS
('PENCOM', 'Pension Remittance', 'Step 1: Calculate 18% total contribution (10% employee + 10% employer). Step 2: Remit to PFA. Step 3: File compliance schedule. Step 4: Keep records. Step 5: Provide statements to employees.', 'Pension Reform Act 2014', 'Pension', '{"difficulty": "Low", "time_required": "Monthly (within 7 days of salary)", "cost": "18% of salary"}'),

('PENCOM', 'Micro-Pension Plan Registration', 'Step 1: Identify eligible informal sector workers. Step 2: Register with PFA. Step 3: Set up mobile contribution. Step 4: Issue RSA. Step 5: File compliance report.', 'Micro-Pension Guidelines', 'Pension', '{"difficulty": "Low", "time_required": "1-2 weeks", "cost": "Varies"}'),

-- ITF REMEDIATION CHECKLISTS
('ITF', 'Skills Development Levy', 'Step 1: Calculate 1% of annual payroll. Step 2: File ITF Form 5. Step 3: Pay levy. Step 4: Obtain compliance certificate. Step 5: Submit training plans for refund.', 'ITF Act', 'Employment', '{"difficulty": "Low", "time_required": "Annual (March 31)", "cost": "1% of payroll"}'),

-- NSITF REMEDIATION CHECKLISTS
('NSITF', 'Employee Compensation Scheme', 'Step 1: Register employees with NSITF. Step 2: Calculate 1% of payroll. Step 3: Pay monthly. Step 4: File compliance report. Step 5: Display certificate.', 'Employee Compensation Act 2010', 'Employment', '{"difficulty": "Low", "time_required": "Monthly", "cost": "1% of payroll"}'),

-- NAFDAC REMEDIATION CHECKLISTS
('NAFDAC', 'Product Registration', 'Step 1: Prepare product documentation. Step 2: Submit samples for testing. Step 3: Pay registration fee. Step 4: Await approval (60-90 days). Step 5: Display NAFDAC number. Step 6: Renew every 2 years.', 'NAFDAC Act', 'Licensing', '{"difficulty": "High", "time_required": "60-90 days", "cost": "NGN 50,000 - 500,000"}'),

('NAFDAC', 'Product Registration Renewal', 'Step 1: Check expiration date. Step 2: Submit renewal application. Step 3: Pay renewal fee. Step 4: Submit updated documentation. Step 5: Receive renewed certificate.', 'NAFDAC Act', 'Licensing', '{"difficulty": "Medium", "time_required": "30-60 days", "cost": "NGN 25,000 - 250,000"}');

-- ============================================
-- SECTOR REQUIREMENTS
-- ============================================

INSERT INTO sector_requirements (sector, regulator, requirement, legal_basis, deadline, penalty, priority) VALUES

-- Fintech Sector
('Fintech', 'CBN', 'Payment Service Provider License', 'CBN Guidelines on Electronic Payments', 'Before operation', 'NGN 5,000,000 + revocation', 'Critical'),
('Fintech', 'SEC', 'VASP Registration (if crypto)', 'SEC Digital Assets Rules', 'Before crypto services', 'NGN 20,000,000', 'Critical'),
('Fintech', 'NDPC', 'Data Protection Audit', 'NDPA 2023', 'Annual (March 15)', '2% of revenue or NGN 10M', 'Critical'),
('Fintech', 'NITDA', 'AI Governance Compliance', 'NITDA AI Framework 2025', 'Before AI deployment', 'NGN 30,000,000', 'Critical'),
('Fintech', 'CBN', 'AML/CFT Reporting', 'CBN AML Guidelines', 'Quarterly', 'NGN 1,000,000/day', 'High'),
('Fintech', 'FIRS', 'VAT Remittance', 'VAT Act', 'Monthly (21st)', '5% of VAT due', 'High'),
('Fintech', 'CAC', 'Annual Returns', 'CAMA 2020', 'Annual (June 30)', 'NGN 5,000 - 50,000', 'High'),

-- Healthcare Sector
('Healthcare', 'NDPC', 'DPIA for Patient Data', 'NDPA 2023', 'Before processing', 'NGN 5,000,000', 'Critical'),
('Healthcare', 'NDPC', 'Sensitive Data Protection', 'NDPA 2023', 'Ongoing', '2% of revenue', 'Critical'),
('Healthcare', 'NAFDAC', 'Product Registration (if applicable)', 'NAFDAC Act', 'Before sale', 'Product seizure', 'Critical'),
('Healthcare', 'CAC', 'Business Registration', 'CAMA 2020', 'Before operation', 'Deregistration', 'Critical'),
('Healthcare', 'NSITF', 'Employee Compensation', 'Employee Compensation Act', 'Monthly', '5% of payroll', 'High'),

-- Manufacturing Sector
('Manufacturing', 'NAFDAC', 'Product Registration', 'NAFDAC Act', 'Before sale', 'Product seizure + NGN 500,000', 'Critical'),
('Manufacturing', 'NSITF', 'Employee Compensation', 'Employee Compensation Act', 'Monthly', '5% of payroll', 'High'),
('Manufacturing', 'ITF', 'Skills Development Levy', 'ITF Act', 'Annual (March 31)', '5% of amount due', 'Medium'),
('Manufacturing', 'FIRS', 'VAT Registration', 'VAT Act', 'Before operation', '5% of VAT due', 'High'),
('Manufacturing', 'CAC', 'Annual Returns', 'CAMA 2020', 'Annual', 'NGN 5,000 - 50,000', 'High'),

-- Agriculture Sector
('Agriculture', 'NAFDAC', 'Processed Food Registration', 'NAFDAC Act', 'Before sale', 'Product seizure', 'Critical'),
('Agriculture', 'NSITF', 'Farm Worker Compensation', 'Employee Compensation Act', 'Monthly', '5% of payroll', 'High'),
('Agriculture', 'CAC', 'Business Registration', 'CAMA 2020', 'Before operation', 'Deregistration', 'Critical'),

-- Trading Sector
('Trading', 'FIRS', 'VAT Registration', 'VAT Act', 'Before operation', '5% of VAT due', 'Critical'),
('Trading', 'CAC', 'Business Registration', 'CAMA 2020', 'Before operation', 'Deregistration', 'Critical'),
('Trading', 'FIRS', 'WHT Remittance', 'WHT Regulations', 'Monthly (21st)', '10% of WHT due', 'High'),

-- Technology Sector
('Technology', 'NITDA', 'AI Governance Compliance', 'NITDA AI Framework 2025', 'Before AI deployment', 'NGN 30,000,000', 'Critical'),
('Technology', 'NDPC', 'Data Protection Audit', 'NDPA 2023', 'Annual', '2% of revenue', 'Critical'),
('Technology', 'NITDA', 'Cybersecurity Compliance', 'NITDA Act 2024', 'Ongoing', 'NGN 10,000,000', 'High'),
('Technology', 'CAC', 'Annual Returns', 'CAMA 2020', 'Annual', 'NGN 5,000 - 50,000', 'High'),

-- Construction Sector
('Construction', 'NSITF', 'Worker Compensation', 'Employee Compensation Act', 'Monthly', '5% of payroll', 'High'),
('Construction', 'ITF', 'Skills Development Levy', 'ITF Act', 'Annual', '5% of amount due', 'Medium'),
('Construction', 'CAC', 'Business Registration', 'CAMA 2020', 'Before operation', 'Deregistration', 'Critical'),

-- Education Sector
('Education', 'NDPC', 'Student Data Protection', 'NDPA 2023', 'Ongoing', '2% of revenue', 'Critical'),
('Education', 'CAC', 'Business Registration', 'CAMA 2020', 'Before operation', 'Deregistration', 'Critical'),
('Education', 'NSITF', 'Staff Compensation', 'Employee Compensation Act', 'Monthly', '5% of payroll', 'High');

-- ============================================
-- PENALTY STRUCTURES
-- ============================================

INSERT INTO penalty_structures (regulator, violation, fine_type, fine_amount, fine_percentage, daily_amount, legal_basis) VALUES

-- NDPC Penalties (NDPA 2023)
('NDPC', 'Failure to file annual audit', 'Both', 'NGN 10,000,000', '2% of annual gross revenue', NULL, 'NDPA 2023 Section 4.1(7)'),
('NDPC', 'Data breach notification failure', 'Fixed', 'NGN 10,000,000', NULL, NULL, 'NDPA 2023 Section 40'),
('NDPC', 'Non-compliance with DPIA requirements', 'Both', 'NGN 5,000,000', '1% of annual gross revenue', NULL, 'NDPA 2023 Section 28'),
('NDPC', 'Cross-border transfer violation', 'Fixed', 'NGN 10,000,000', NULL, NULL, 'NDPA 2023 Section 41'),
('NDPC', 'Data subject rights violation', 'Fixed', 'NGN 5,000,000', NULL, NULL, 'NDPA 2023 Sections 34-36'),
('NDPC', 'Privacy policy non-compliance', 'Fixed', 'NGN 5,000,000', NULL, NULL, 'NDPA 2023 Section 25'),

-- NITDA Penalties (NITDA Act 2024)
('NITDA', 'AI Governance Framework non-compliance', 'Fixed', 'NGN 30,000,000', NULL, NULL, 'NITDA Act 2024'),
('NITDA', 'Cybersecurity non-compliance', 'Fixed', 'NGN 10,000,000', NULL, NULL, 'NITDA Act 2024'),
('NITDA', 'First-time corporate offender', 'Fixed', 'NGN 10,000,000', NULL, NULL, 'NITDA Act 2024 Section 17'),
('NITDA', 'Subsequent corporate offender', 'Fixed', 'NGN 30,000,000', NULL, NULL, 'NITDA Act 2024 Section 17'),

-- CAC Penalties (CAMA 2020)
('CAC', 'Late annual returns filing', 'Fixed', 'NGN 5,000 - NGN 50,000', NULL, 'NGN 5,000 per year', 'CAMA 2020 Section 417'),
('CAC', 'Failure to file annual returns', 'Fixed', 'NGN 50,000', NULL, NULL, 'CAMA 2020 Section 417'),
('CAC', 'Business name deregistration', 'Fixed', 'Deregistration', NULL, NULL, 'CAMA 2020'),

-- FIRS Penalties (Finance Act 2025)
('FIRS', 'Late CIT filing - first month', 'Fixed', 'NGN 25,000', NULL, NULL, 'Finance Act 2025'),
('FIRS', 'Late CIT filing - subsequent months', 'Fixed', 'NGN 12,500', NULL, 'NGN 12,500 per month', 'Finance Act 2025'),
('FIRS', 'Late VAT remittance', 'Both', NULL, '5% of VAT due', '10% interest per annum', 'VAT Act'),
('FIRS', 'Late WHT remittance', 'Both', NULL, '10% of WHT due', 'Interest per annum', 'WHT Regulations'),
('FIRS', 'Failure to file tax returns', 'Fixed', 'NGN 100,000', NULL, NULL, 'Finance Act 2025'),

-- CBN Penalties
('CBN', 'Fintech license violation', 'Fixed', 'NGN 5,000,000', NULL, NULL, 'CBN Guidelines on Electronic Payments'),
('CBN', 'AML non-compliance', 'Daily', NULL, NULL, 'NGN 1,000,000 per day', 'CBN AML Guidelines'),
('CBN', 'License revocation', 'Fixed', 'License revocation', NULL, NULL, 'CBN Guidelines'),
('CBN', 'Capital requirement failure', 'Fixed', 'NGN 5,000,000,000 minimum', NULL, NULL, 'CBN Guidelines'),

-- SEC Penalties
('SEC', 'VASP registration failure', 'Fixed', 'NGN 20,000,000', NULL, NULL, 'SEC Digital Assets Rules'),
('SEC', 'Capital market violation', 'Fixed', 'NGN 10,000,000', NULL, NULL, 'SEC Rules'),
('SEC', 'Digital asset offering violation', 'Fixed', 'NGN 20,000,000', NULL, NULL, 'SEC Digital Assets Rules'),

-- PENCOM Penalties
('PENCOM', 'Late pension remittance', 'Percentage', NULL, '2% monthly interest', NULL, 'Pension Reform Act 2014'),
('PENCOM', 'Failure to remit pension', 'Fixed', 'NGN 10,000,000', NULL, NULL, 'Pension Reform Act 2014'),

-- ITF Penalties
('ITF', 'Skills development levy non-payment', 'Percentage', NULL, '5% of amount due', NULL, 'ITF Act'),
('ITF', 'Failure to file ITF returns', 'Fixed', 'NGN 500,000', NULL, NULL, 'ITF Act'),

-- NSITF Penalties
('NSITF', 'Employee compensation non-compliance', 'Percentage', NULL, '5% of monthly payroll', NULL, 'Employee Compensation Act 2010'),
('NSITF', 'Failure to register employees', 'Fixed', 'NGN 1,000,000', NULL, NULL, 'Employee Compensation Act 2010'),

-- NAFDAC Penalties
('NAFDAC', 'Product registration failure', 'Both', 'NGN 500,000', NULL, NULL, 'NAFDAC Act'),
('NAFDAC', 'Selling unregistered products', 'Both', 'Product seizure', NULL, NULL, 'NAFDAC Act');

-- ============================================
-- SEED COMPLETE
-- ============================================