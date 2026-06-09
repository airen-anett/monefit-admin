export type UserStatus = 'Active' | 'Blocked';
export type AppStatus = 'Incoming' | 'In review' | 'Approved' | 'Rejected' | 'Expired' | 'Canceled';
export type CardStatus = 'Active' | 'Blocked' | 'Expired' | 'Frozen';
export type TrxStatus = 'Accepted' | 'Cleared' | 'Settled' | 'Declined';
export type DisputeStatus = 'Received' | 'Under review' | 'Won' | 'Lost';
export type AgreementStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  created: string;
  status: UserStatus;
  lastActivity: string;
  idcode: string;
  homeAddress: string;
  bankAccount: string;
  registered: string;
  appVersion: string;
  riskScore: number;
  riskLimit: string;
  kyc: string;
  pep: string;
  amlFlags: string;
  twoFA: string;
  verificationMethod: string;
  documentType: string;
  documentNumber: string;
  expiryDate: string;
  populationRegistryPDF: string;
}

export interface Application {
  id: string;
  userId: string;
  applicantName: string;
  product: string;
  amount: string;
  status: AppStatus;
  submitted: string;
  expiryDate: string;
  decidedBy: string;
  interestRate: string;
  limit: string;
  agreementRef: string;
  secciRef: string;
  decided: string;
  notes: AppNote[];
  auditLog: AuditEntry[];
  questionnaire: Questionnaire;
  policyChecks: PolicyCheck[];
  bankStatements: BankStatement[];
}

export interface AppNote {
  text: string;
  date: string;
  author: string;
}

export interface AuditEntry {
  action: string;
  date: string;
  initiator: string;
  note: string;
}

export interface PolicyCheck {
  name: string;
  passed: boolean;
  detail?: string;
}

export interface BankStatement {
  name: string;
  date: string;
}

export interface Questionnaire {
  employmentType: string;
  employerName: string;
  employerField: string;
  position: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  maritalStatus: string;
  financialDependents: string;
  hasCreditHistory: string;
  hasActiveCredit: string;
  ownsProperty: string;
  propertyType: string;
  isPep: string;
  purposeOfCredit: string;
  dateCompleted: string;
}

export interface Agreement {
  id: string;
  userId: string;
  status: AgreementStatus;
  principal: string;
  outstanding: string;
  apr: string;
  nextPayment: string;
  opened: string;
  details: AgreementDetails;
}

export interface AgreementDetails {
  outstandingAmt: string;
  principalAmt: string;
  interest: string;
  refInterest: string;
  lateInterest: string;
  monthFee: string;
  subFee: string;
  mgmtFee: string;
  prevForgiven: string;
  unusedPrepayment: string;
  balInvoicedOutstanding: string;
  balPrincipal: string;
  balInterest: string;
  balRefInterest: string;
  balLateInterest: string;
  balMonthFee: string;
  balSubFee: string;
  balMgmtFee: string;
  balPrevForgiven: string;
  balUnusedPrepayment: string;
  type: string;
  currency: string;
  annualInterestRate: string;
  annualRefRate: string;
  aprVal: string;
  aprc: string;
  dailyLateInterestRate: string;
}

export interface Card {
  token: string;
  last4: string;
  status: CardStatus;
  created: string;
  type: string;
  exp: string;
  product: string;
  scheme: string;
  currency: string;
  activation: string;
  network: string;
  userId: string;
}

export interface Transaction {
  id: string;
  dt: string;
  type: string;
  status: TrxStatus;
  merchant: string;
  mcc: string;
  billing: string;
  trx: string;
  reasonCode: string;
  balance: string;
  userId: string;
}

export interface Payment {
  id: string;
  due: string;
  amount: string;
  userId: string;
}

export interface Invoice {
  id: string;
  sent: string;
  due: string;
  amount: string;
  userId: string;
}

export interface CommMessage {
  sender: string;
  type: 'customer' | 'support' | 'internal';
  topic: string;
  date: string;
  body: string;
  userId: string;
}

export interface Notification {
  type: 'SMS' | 'Push' | 'Email';
  date: string;
  status: 'Sent' | 'Delivered' | 'Opened' | 'Failed';
  title: string;
  body: string;
  userId: string;
}

export interface Dispute {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  amount: string;
  currency: string;
  merchant: string;
  mcc: string;
  reason: string;
  status: DisputeStatus;
  created: string;
  updated: string;
  timeline: TimelineEntry[];
  documents: string[];
  systemEvidence: string[];
}

export interface TimelineEntry {
  dt: string;
  event: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  status: 'Enabled' | 'Disabled';
  environment: 'Staging' | 'Production' | 'Development';
  updatedBy: string;
  updatedAt: string;
}

export interface GlobalAuditEntry {
  action: string;
  date: string;
  initiator: string;
  userId: string;
  userName: string;
  note: string;
  category: string;
}

export interface Doc {
  name: string;
  type: string;
  uploadedBy: string;
  date: string;
  userId: string;
}

// ────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────

export const USERS: User[] = [
  { id: 'u1', name: 'May Adams', phone: '+37253255334', email: 'may.adams@gmail.com', created: '18/05/2026', status: 'Active', lastActivity: '18/05/2026', idcode: '4934567890', homeAddress: 'Marja tn 6, Tallinn, Harjumaa, 12345, Eesti', bankAccount: 'EE892200001106444611', registered: '20/05/2026', appVersion: '2.4.1', riskScore: 22, riskLimit: '€500', kyc: 'Verified', pep: 'Clear (checked 3 days ago)', amlFlags: 'None', twoFA: 'Enabled', verificationMethod: 'Smart ID', documentType: 'ID card', documentNumber: 'DOC-1234', expiryDate: '31/12/2027', populationRegistryPDF: 'population_registry_4934567890_13.05.2026.pdf' },
  { id: 'u2', name: 'Maria Kask', phone: '+37253255335', email: 'maria.kask@gmail.com', created: '18/05/2024', status: 'Blocked', lastActivity: '18/05/2024', idcode: '3812045678', homeAddress: 'Narva mnt 10, Tallinn, 10117, Eesti', bankAccount: 'EE342200001234567890', registered: '18/05/2024', appVersion: '2.1.0', riskScore: 78, riskLimit: '€0', kyc: 'Verified', pep: 'Clear (checked 120 days ago)', amlFlags: '1 flag — suspicious pattern', twoFA: 'Disabled', verificationMethod: 'Smart ID', documentType: 'Passport', documentNumber: 'DOC-5678', expiryDate: '15/08/2029', populationRegistryPDF: 'population_registry_3812045678_01.05.2024.pdf' },
  { id: 'u3', name: 'Kaspar Laas', phone: '+37253255336', email: 'kaspar.laas@gmail.com', created: '12/03/2023', status: 'Active', lastActivity: '08/04/2022', idcode: '3910155234', homeAddress: 'Viru 5, Tartu, 51003, Eesti', bankAccount: 'EE122200009876543210', registered: '12/03/2023', appVersion: '2.3.5', riskScore: 35, riskLimit: '€1000', kyc: 'Verified', pep: 'Clear (checked 60 days ago)', amlFlags: 'None', twoFA: 'Enabled', verificationMethod: 'Mobile ID', documentType: 'ID card', documentNumber: 'DOC-9012', expiryDate: '22/03/2028', populationRegistryPDF: 'population_registry_3910155234_12.03.2023.pdf' },
  { id: 'u4', name: 'Jane Põld', phone: '+37253255337', email: 'jane.pold@gmail.com', created: '08/04/2022', status: 'Active', lastActivity: '15/05/2021', idcode: '4612034567', homeAddress: 'Pärnu mnt 15, Tallinn, 10141, Eesti', bankAccount: 'EE552200004567890123', registered: '08/04/2022', appVersion: '2.0.8', riskScore: 15, riskLimit: '€2000', kyc: 'Verified', pep: 'Clear (checked 30 days ago)', amlFlags: 'None', twoFA: 'Enabled', verificationMethod: 'Smart ID', documentType: 'ID card', documentNumber: 'DOC-3456', expiryDate: '10/11/2026', populationRegistryPDF: 'population_registry_4612034567_08.04.2022.pdf' },
  { id: 'u5', name: 'Mike Collins', phone: '+37253255338', email: 'mike.collins@gmail.com', created: '15/05/2021', status: 'Active', lastActivity: '12/03/2023', idcode: '3801234567', homeAddress: 'Raekoja plats 1, Tartu, 51004, Eesti', bankAccount: 'EE772200007890123456', registered: '15/05/2021', appVersion: '2.4.0', riskScore: 45, riskLimit: '€750', kyc: 'Verified', pep: 'Clear (checked 14 days ago)', amlFlags: 'None', twoFA: 'Disabled', verificationMethod: 'Mobile ID', documentType: 'Passport', documentNumber: 'DOC-7890', expiryDate: '05/06/2030', populationRegistryPDF: 'population_registry_3801234567_15.05.2021.pdf' },
];

export const APPLICATIONS: Application[] = [
  {
    id: 'app_214', userId: 'u1', applicantName: 'May Adams', product: 'Credit card / monefit card',
    amount: '€3,400.00', status: 'In review', submitted: '20/05/2026', expiryDate: '20/06/2026',
    decidedBy: '—', interestRate: '25.00% APR (fixed)', limit: '€2,000', agreementRef: 'agrmnt-0241',
    secciRef: 'secci-0241', decided: '—',
    notes: [{ text: 'Waiting for new Bank Statement from the customer', date: '18/05/2026 09:14', author: 'Ulla Ugast' }],
    auditLog: [
      { action: 'Application created', date: '20/05/2026 09:10', initiator: 'System', note: '' },
      { action: 'Application sent to manual review', date: '20/05/2026 09:12', initiator: 'System', note: 'Manual review triggered by policy check' },
    ],
    questionnaire: { employmentType: 'Full-time employee', employerName: 'Tallinn City Government', employerField: 'Public administration', position: 'Senior Analyst', monthlyIncome: '€3,200', monthlyExpenses: '€1,800', maritalStatus: 'Single', financialDependents: '0', hasCreditHistory: 'Yes', hasActiveCredit: 'No', ownsProperty: 'Yes', propertyType: 'Apartment', isPep: 'No', purposeOfCredit: 'Home renovation', dateCompleted: '20/05/2026' },
    policyChecks: [
      { name: 'KYC verified', passed: true },
      { name: 'Sanctions', passed: true },
      { name: 'PEP', passed: true },
      { name: 'Pliance', passed: true },
      { name: 'Pre-assessment', passed: true },
      { name: 'Manual review required', passed: false, detail: 'Income-to-expense ratio below threshold. Monthly net income €3,200 with expenses €1,800 leaves €1,400 disposable. Policy minimum is €1,500 for this credit limit.' },
    ],
    bankStatements: [{ name: 'Bank Statement — May Adams — May 2026', date: '18/05/2026 08:45' }],
  },
  {
    id: 'app_212', userId: 'u2', applicantName: 'Maria Kask', product: 'Installment loan',
    amount: '€1,200.00', status: 'Rejected', submitted: '18/05/2024', expiryDate: '18/06/2024',
    decidedBy: 'Ulla Ugast', interestRate: '18.00% APR (fixed)', limit: '€1,200', agreementRef: '—',
    secciRef: 'secci-0198', decided: '20/05/2024',
    notes: [{ text: 'AML flag triggered. Escalated to compliance team.', date: '19/05/2024 11:30', author: 'Ulla Ugast' }],
    auditLog: [
      { action: 'Application created', date: '18/05/2024 08:00', initiator: 'System', note: '' },
      { action: 'Application rejected', date: '20/05/2024 10:00', initiator: 'CS', note: 'AML flag — suspicious transaction pattern' },
    ],
    questionnaire: { employmentType: 'Self-employed', employerName: 'Kask OÜ', employerField: 'Retail trade', position: 'Owner', monthlyIncome: '€2,100', monthlyExpenses: '€1,900', maritalStatus: 'Married', financialDependents: '2', hasCreditHistory: 'Yes', hasActiveCredit: 'Yes', ownsProperty: 'No', propertyType: '—', isPep: 'No', purposeOfCredit: 'Business expansion', dateCompleted: '18/05/2024' },
    policyChecks: [
      { name: 'KYC verified', passed: true },
      { name: 'Sanctions', passed: true },
      { name: 'PEP', passed: true },
      { name: 'Pliance', passed: false, detail: 'AML flag raised: unusual pattern of small incoming transfers from multiple foreign accounts within 30 days.' },
      { name: 'Pre-assessment', passed: false, detail: 'Income stability check failed. Irregular income reported over 6-month period.' },
    ],
    bankStatements: [],
  },
  {
    id: 'app_211', userId: 'u5', applicantName: 'Mike Collins', product: 'Credit card / monefit card',
    amount: '€800.00', status: 'Expired', submitted: '15/05/2021', expiryDate: '15/06/2021',
    decidedBy: '—', interestRate: '22.00% APR (fixed)', limit: '€800', agreementRef: '—',
    secciRef: 'secci-0099', decided: '—',
    notes: [],
    auditLog: [
      { action: 'Application created', date: '15/05/2021 15:00', initiator: 'System', note: '' },
      { action: 'Application expired', date: '15/06/2021 00:00', initiator: 'System', note: 'No decision within validity period' },
    ],
    questionnaire: { employmentType: 'Part-time employee', employerName: 'Tartu University', employerField: 'Education', position: 'Lecturer', monthlyIncome: '€1,600', monthlyExpenses: '€1,200', maritalStatus: 'Single', financialDependents: '0', hasCreditHistory: 'No', hasActiveCredit: 'No', ownsProperty: 'No', propertyType: '—', isPep: 'No', purposeOfCredit: 'Personal expenses', dateCompleted: '15/05/2021' },
    policyChecks: [
      { name: 'KYC verified', passed: true },
      { name: 'Sanctions', passed: true },
      { name: 'PEP', passed: true },
      { name: 'Pliance', passed: true },
      { name: 'Pre-assessment', passed: true },
    ],
    bankStatements: [],
  },
];

export const AGREEMENTS: Agreement[] = [
  {
    id: 'Agreement-421', userId: 'u1', status: 'Active', principal: '€3,000', outstanding: '€2,859', apr: '12%', nextPayment: '22/06/2026', opened: '22/05/2026',
    details: { outstandingAmt: '2,859.30', principalAmt: '2,859.06', interest: '0.24', refInterest: '0.00', lateInterest: '0.00', monthFee: '0.00', subFee: '0.00', mgmtFee: '0.00', prevForgiven: '0.00', unusedPrepayment: '0.00', balInvoicedOutstanding: '21.14', balPrincipal: '20.96', balInterest: '0.18', balRefInterest: '0.00', balLateInterest: '0.00', balMonthFee: '0.00', balSubFee: '0.00', balMgmtFee: '0.00', balPrevForgiven: '0.00', balUnusedPrepayment: '0.00', type: 'CreditLine', currency: 'EUR', annualInterestRate: '10.00%', annualRefRate: '0.00%', aprVal: '10.00%', aprc: '13.02%', dailyLateInterestRate: '0.00%' },
  },
  {
    id: 'Agreement-310', userId: 'u3', status: 'Inactive', principal: '€1,000', outstanding: '€0', apr: '10%', nextPayment: '—', opened: '12/03/2023',
    details: { outstandingAmt: '0.00', principalAmt: '0.00', interest: '0.00', refInterest: '0.00', lateInterest: '0.00', monthFee: '0.00', subFee: '0.00', mgmtFee: '0.00', prevForgiven: '0.00', unusedPrepayment: '0.00', balInvoicedOutstanding: '0.00', balPrincipal: '0.00', balInterest: '0.00', balRefInterest: '0.00', balLateInterest: '0.00', balMonthFee: '0.00', balSubFee: '0.00', balMgmtFee: '0.00', balPrevForgiven: '0.00', balUnusedPrepayment: '0.00', type: 'CreditLine', currency: 'EUR', annualInterestRate: '10.00%', annualRefRate: '0.00%', aprVal: '10.00%', aprc: '12.50%', dailyLateInterestRate: '0.00%' },
  },
];

export const CARDS: Card[] = [
  { token: '53214221', last4: '4221', status: 'Active', created: '16/05/2026', type: 'Virtual', exp: '12/30', product: 'CSR_EST_VS', scheme: 'Creditstar EU & UK', currency: 'EUR', activation: '25/05/2026', network: 'Mastercard', userId: 'u1' },
  { token: '59039012', last4: '9012', status: 'Blocked', created: '16/05/2026', type: 'Physical', exp: '12/30', product: 'CSR_EST_VS', scheme: 'Creditstar EU & UK', currency: 'EUR', activation: '20/05/2026', network: 'Mastercard', userId: 'u1' },
  { token: '55214411', last4: '4411', status: 'Expired', created: '15/05/2026', type: 'Physical', exp: '12/26', product: 'CSR_EST_VS', scheme: 'Creditstar EU & UK', currency: 'EUR', activation: '15/05/2026', network: 'Mastercard', userId: 'u1' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: '13a97e-5d', dt: '18/05/2026 07:23', type: 'Authorisation', status: 'Accepted', merchant: 'Udu', mcc: '5812', billing: '€15.00', trx: '€15.00', reasonCode: '00-Approved', balance: '€150.00', userId: 'u1' },
  { id: '8c1e7d-2f', dt: '17/05/2026 18:53', type: 'Presentment', status: 'Cleared', merchant: 'IKEA', mcc: '5411', billing: '€134.50', trx: '€134.50', reasonCode: '', balance: '€134.50', userId: 'u1' },
  { id: 'b74f91-8a', dt: '17/05/2026 16:42', type: 'Settlement', status: 'Settled', merchant: 'Prisma', mcc: '5411', billing: '€65.20', trx: '€65.20', reasonCode: '', balance: '€650.20', userId: 'u1' },
  { id: '2d8b3a-41', dt: '17/05/2026 14:36', type: 'Monthly fee', status: 'Declined', merchant: 'Netflix', mcc: '4899', billing: '$15.00', trx: '€12.88', reasonCode: '62-Restricted card', balance: '€120.88', userId: 'u1' },
  { id: '9a6c81-7d', dt: '17/05/2026 12:04', type: 'Authorisation', status: 'Accepted', merchant: 'IKEA', mcc: '5712', billing: '€134.50', trx: '€134.50', reasonCode: '00-Approved', balance: '€434.50', userId: 'u1' },
];

export const PAYMENTS: Payment[] = [
  { id: 'pmt-4121', due: '05/06/2026', amount: '€115.00', userId: 'u1' },
];

export const INVOICES: Invoice[] = [
  { id: 'inv-004121', sent: '31/05/2026', due: '15/06/2026', amount: '€38.00', userId: 'u1' },
];

export const COMMUNICATIONS: CommMessage[] = [
  { sender: 'May Adams', type: 'customer', topic: 'Declined payment query', date: '31/05/2026', body: 'Hi, I tried to pay with my card but it got declined. Could you please check?', userId: 'u1' },
  { sender: 'Ulla Ugast', type: 'support', topic: '', date: '31/05/2026', body: 'Hi May! I can see the transaction was declined due to a card restriction. Your card is active — please try again and let us know.', userId: 'u1' },
  { sender: 'Ulla Ugast', type: 'internal', topic: 'Internal note', date: '01/06/2026', body: 'Spoke with customer re: upcoming repayment. They asked to push date by 5 days due to delayed salary. Approved one-time skip.', userId: 'u1' },
];

export const NOTIFICATIONS: Notification[] = [
  { type: 'SMS', date: '15/05/2026', status: 'Sent', title: 'Payment reminder', body: 'Dear May Adams, your next payment of €115.00 is due on 22/06/2026. Log in to the app to manage your account.', userId: 'u1' },
  { type: 'Push', date: '14/05/2026', status: 'Delivered', title: 'Transaction approved', body: 'Your Mastercard ending 4221 was used for €15.00 at Udu. If this was not you, contact support immediately.', userId: 'u1' },
  { type: 'Email', date: '13/05/2026', status: 'Opened', title: 'Monthly statement ready', body: 'Your monthly statement for May 2026 is ready. Log in to view and download your statement.', userId: 'u1' },
];

export const USER_AUDIT_LOG: AuditEntry[] = [
  { action: 'User account created', date: '20/05/2026 09:10', initiator: 'System', note: 'Registration via app' },
  { action: 'KYC verified', date: '20/05/2026 09:12', initiator: 'System', note: 'Smart ID verification successful' },
  { action: 'Virtual card issued', date: '25/05/2026 11:00', initiator: 'System', note: 'V. card issued successfully' },
  { action: 'Card limit updated', date: '26/05/2026 14:22', initiator: 'Ulla Ugast', note: 'Increased limit to €3,000' },
  { action: 'Payment confirmation provided', date: '01/06/2026 09:45', initiator: 'Ulla Ugast', note: 'Payment confirmation provided' },
];

export const DOCS: Doc[] = [
  { name: 'Kliendileping_Premium_4759651989.pdf', type: 'Agreement', uploadedBy: 'Ulla Ugast', date: '22/05/2026', userId: 'u1' },
  { name: 'Euroopa_tarbijakrediidi_standardinfo_teabeleht_Premium.pdf', type: 'SECCI', uploadedBy: 'System', date: '22/05/2026', userId: 'u1' },
  { name: 'terms_and_conditions.pdf', type: 'T&C', uploadedBy: 'System', date: '20/05/2026', userId: 'u1' },
  { name: 'digital_identification_47907040162_13.05.2026.txt', type: 'ID verification', uploadedBy: 'System', date: '20/05/2026', userId: 'u1' },
  { name: 'digital_registration_document_47907040162_13.05.2026.html', type: 'Registration', uploadedBy: 'System', date: '20/05/2026', userId: 'u1' },
  { name: 'population_registry_47907040162_13.05.2026.html', type: 'Population registry', uploadedBy: 'System', date: '20/05/2026', userId: 'u1' },
  { name: 'Secci_document.pdf', type: 'SECCI', uploadedBy: 'Ulla Ugast', date: '22/05/2026', userId: 'u1' },
];

export const DISPUTES: Dispute[] = [
  {
    id: 'DSP-3', transactionId: '92e7d4b0f3..', userId: 'u1', userName: 'May Adams', userEmail: 'may.adams@gmail.com', userPhone: '+37253255334',
    amount: '€20.00', currency: 'EUR', merchant: 'Bolt', mcc: '7299', reason: 'Unauthorized transaction',
    status: 'Received', created: '15/05/2026', updated: '25/05/2026',
    timeline: [
      { dt: '25/05/2026 09:14', event: 'Dispute created by user' },
      { dt: '25/05/2026 09:15', event: 'Transaction auto-flagged as suspicious' },
      { dt: '25/05/2026 09:20', event: 'Card temporarily frozen' },
      { dt: '25/05/2026 09:45', event: 'Evidence requested from merchant' },
      { dt: '25/05/2026 10:02', event: 'Case under review' },
    ],
    documents: ['User statement — 25/05/2026', 'Screenshot of transaction notification'],
    systemEvidence: ['3DS authentication: Not triggered', 'IP address: 195.43.xx.xx (Tallinn, EE)', 'Device: iPhone 14 Pro (last registered)', 'Merchant MCC 7299 — first transaction at this merchant'],
  },
  {
    id: 'DSP-2', transactionId: '7f20c6e4d9..', userId: 'u3', userName: 'Kaspar Laas', userEmail: 'kaspar.laas@gmail.com', userPhone: '+37253255336',
    amount: '$30.00', currency: 'USD', merchant: 'Amazon', mcc: '5999', reason: 'Goods not received',
    status: 'Under review', created: '14/05/2026', updated: '24/05/2026',
    timeline: [
      { dt: '14/05/2026 11:00', event: 'Dispute created by user' },
      { dt: '14/05/2026 11:05', event: 'Evidence requested from merchant' },
      { dt: '23/05/2026 14:20', event: 'Merchant response received — no proof of delivery' },
      { dt: '24/05/2026 09:00', event: 'Case escalated for chargeback review' },
    ],
    documents: ['Order confirmation email', 'Amazon tracking — no delivery scan'],
    systemEvidence: ['3DS authentication: Passed', 'IP address: 195.43.xx.xx (Tallinn, EE)', 'Device: Samsung Galaxy S24', 'Previous purchases at Amazon: 4'],
  },
  {
    id: 'DSP-1', transactionId: 'f2a7c6b83e..', userId: 'u5', userName: 'Mike Collins', userEmail: 'mike.collins@gmail.com', userPhone: '+37253255338',
    amount: '£20.00', currency: 'GBP', merchant: 'Tesco', mcc: '5411', reason: 'Duplicate charge',
    status: 'Won', created: '13/05/2026', updated: '23/05/2026',
    timeline: [
      { dt: '13/05/2026 08:30', event: 'Dispute created by user' },
      { dt: '13/05/2026 08:35', event: 'Duplicate authorisation identified in system' },
      { dt: '13/05/2026 10:00', event: 'Merchant notified of duplicate charge' },
      { dt: '23/05/2026 09:15', event: 'Chargeback approved — refund issued' },
    ],
    documents: ['Receipt showing single purchase'],
    systemEvidence: ['Two identical authorisations within 3 seconds', 'Same terminal ID', 'Merchant confirmed POS malfunction'],
  },
];

export const FEATURE_FLAGS: FeatureFlag[] = [
  { id: 'ff1', name: 'virtual_card_instant_issue', description: 'Enable instant virtual card issuance after application approval', status: 'Enabled', environment: 'Production', updatedBy: 'Admin', updatedAt: '01/06/2026' },
  { id: 'ff2', name: 'apple_pay_tokenization', description: 'Allow customers to add card to Apple Pay wallet', status: 'Enabled', environment: 'Production', updatedBy: 'Admin', updatedAt: '28/05/2026' },
  { id: 'ff3', name: 'enhanced_aml_screening', description: 'Run enhanced AML screening on all applications over €1,000', status: 'Enabled', environment: 'Production', updatedBy: 'Admin', updatedAt: '20/05/2026' },
  { id: 'ff4', name: 'google_pay_tokenization', description: 'Allow customers to add card to Google Pay wallet', status: 'Disabled', environment: 'Staging', updatedBy: 'Dev', updatedAt: '15/05/2026' },
  { id: 'ff5', name: 'manual_credit_limit_override', description: 'Allow CS team to manually override approved credit limits', status: 'Disabled', environment: 'Development', updatedBy: 'Dev', updatedAt: '10/05/2026' },
  { id: 'ff6', name: 'pep_auto_reject', description: 'Automatically reject applications flagged as PEP', status: 'Enabled', environment: 'Production', updatedBy: 'Admin', updatedAt: '05/05/2026' },
];

export const GLOBAL_AUDIT_LOG: GlobalAuditEntry[] = [
  { action: 'User account created', date: '20/05/2026 09:10', initiator: 'System', userId: 'u1', userName: 'May Adams', note: 'Registration via app', category: 'User' },
  { action: 'KYC verified', date: '20/05/2026 09:12', initiator: 'System', userId: 'u1', userName: 'May Adams', note: 'Smart ID verification', category: 'Compliance' },
  { action: 'Application submitted', date: '20/05/2026 09:13', initiator: 'Customer', userId: 'u1', userName: 'May Adams', note: 'app_214 — Credit card', category: 'Application' },
  { action: 'Application sent to manual review', date: '20/05/2026 09:15', initiator: 'System', userId: 'u1', userName: 'May Adams', note: 'Policy check failed: income threshold', category: 'Application' },
  { action: 'Virtual card issued', date: '25/05/2026 11:00', initiator: 'System', userId: 'u1', userName: 'May Adams', note: 'Token 53214221', category: 'Card' },
  { action: 'Card limit updated', date: '26/05/2026 14:22', initiator: 'Ulla Ugast', userId: 'u1', userName: 'May Adams', note: 'Limit increased to €3,000', category: 'Card' },
  { action: 'Account blocked', date: '20/05/2024 10:00', initiator: 'Risk', userId: 'u2', userName: 'Maria Kask', note: 'AML flag triggered', category: 'Compliance' },
  { action: 'Application rejected', date: '20/05/2024 10:00', initiator: 'CS', userId: 'u2', userName: 'Maria Kask', note: 'AML flag — suspicious pattern', category: 'Application' },
  { action: 'Dispute created', date: '25/05/2026 09:14', initiator: 'Customer', userId: 'u1', userName: 'May Adams', note: 'DSP-3 — Unauthorized transaction', category: 'Dispute' },
  { action: 'Feature flag toggled', date: '01/06/2026 14:00', initiator: 'Admin', userId: '', userName: '', note: 'virtual_card_instant_issue → Enabled (Production)', category: 'System' },
];

// Helpers
export function getUserById(id: string) { return USERS.find(u => u.id === id); }
export function getApplicationById(id: string) { return APPLICATIONS.find(a => a.id === id); }
export function getApplicationsByUser(userId: string) { return APPLICATIONS.filter(a => a.userId === userId); }
export function getAgreementsByUser(userId: string) { return AGREEMENTS.filter(a => a.userId === userId); }
export function getCardsByUser(userId: string) { return CARDS.filter(c => c.userId === userId); }
export function getCardByToken(token: string) { return CARDS.find(c => c.token === token); }
export function getTransactionsByUser(userId: string) { return TRANSACTIONS.filter(t => t.userId === userId); }
export function getPaymentsByUser(userId: string) { return PAYMENTS.filter(p => p.userId === userId); }
export function getInvoicesByUser(userId: string) { return INVOICES.filter(i => i.userId === userId); }
export function getCommunicationsByUser(userId: string) { return COMMUNICATIONS.filter(c => c.userId === userId); }
export function getNotificationsByUser(userId: string) { return NOTIFICATIONS.filter(n => n.userId === userId); }
export function getDocsByUser(userId: string) { return DOCS.filter(d => d.userId === userId); }
export function getDisputeById(id: string) { return DISPUTES.find(d => d.id === id); }
