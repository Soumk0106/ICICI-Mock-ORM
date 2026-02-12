
export enum PaymentRail {
  RTGS = 'RTGS',
  NEFT = 'NEFT',
  ORM = 'ORM'
}

export type OrmType = 'LRS' | 'TRADE_ADVANCE' | 'TRADE_DIRECT';

export type TrackingStatus = 'completed' | 'in_progress' | 'pending' | 'failed' | 'stuck';

export interface TimelineEvent {
  event: string;
  status: TrackingStatus;
  timestamp?: string;
  location?: string;
}

export interface TrackingInfo {
  txn_id: string;
  rail: PaymentRail;
  orm_type?: OrmType;
  uetr?: string;
  beneficiary: string;
  currency: string;
  amount: number;
  last_updated: string;
  overall_status: TrackingStatus;
  timeline: TimelineEvent[];
}

export interface ExceptionItem {
  id: string;
  field: string;
  issue: string;
  why_it_occurred: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Beneficiary {
  beneficiary_id: string;
  name: string;
  account_number: string;
  ifsc_or_bic: string;
  bank_name: string;
  country: string;
  preferred_payment_mode: PaymentRail;
  last_successful_mode: PaymentRail;
  avg_transfer_amount: number;
  risk_score: number;
  discrepancy_patterns: string[];
  cif_id?: string;
  email?: string;
  mobile?: string;
  address?: string;
  lei?: string;
  lei_expiry?: string;
}

export interface Transaction {
  txn_id: string;
  beneficiary_id: string;
  beneficiary_name: string;
  amount: number;
  currency: string;
  rail: PaymentRail;
  date_time: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  status_color: 'green' | 'red' | 'amber';
  intelligence_tags: string[];
  failure_reason?: string;
}

export interface CustomerProfile {
  cif_id: string;
  customer_name: string;
  primary_account_number: string;
  available_balance: number;
  debit_account_number: string;
  debit_account_balance: number;
  remitter_name: string;
  contact_number: string;
  email: string;
  contact_person: string;
  priority_processing: string;
  address: string;
  pan_no: string;
  ie_ref_no: string;
  deferral_status: string;
  deferral_reason: string;
  deferral_due_date: string;
}

export interface GpiDetails {
  uetr: string;
  gpi_service_level: 'STANDARD' | 'URGENT' | 'INSTANT';
  instruction_priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  compliance_status: 'PASS' | 'REVIEW' | 'FAIL';
  sanctions_screening_ref: string;
  screening_timestamp: string;
  intermediary_bic: string;
  routing_bic: string;
  gpi_transfer_type: 'MT103' | 'MT202/202COV';
  remitter_legal_address: string;
  beneficiary_legal_address: string;
  compliance_reason_code?: string;
  nostro_path?: string[];
}

export interface PaymentState {
  beneficiary: Beneficiary | null;
  amount: number;
  rail: PaymentRail | null;
  ormType?: OrmType;
  purpose: string;
  chargeType: 'SHA' | 'OUR' | 'BEN';
  manualName?: string;
  manualAccount?: string;
  manualIfscBic?: string;
  advanced: Record<string, any>;
  cif_id?: string;
  customerProfile?: CustomerProfile | null;
  leiDetails?: any;
  ormDetails?: any;
  gpiDetails?: GpiDetails;
}
