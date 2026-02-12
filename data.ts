import { Beneficiary, Transaction, PaymentRail, CustomerProfile, TrackingInfo, ExceptionItem } from './types';

export const DASHBOARD_DATA = {
  "dashboard": {
    "recent_payments": [
      {
        "beneficiary": "Global Auto Components",
        "orm_type": "Trade Advance",
        "amount": "USD 12,000",
        "status": "In-Progress"
      },
      {
        "beneficiary": "Mehta Exports LLP",
        "orm_type": "Trade Direct",
        "amount": "USD 8,500",
        "status": "Completed"
      },
      {
        "beneficiary": "Aarav International",
        "orm_type": "LRS",
        "amount": "USD 2,000",
        "status": "Submitted"
      }
    ],
    "quick_actions": [
      "Make a Payment",
      "Pay Again",
      "Track Payment",
      "Add Beneficiary"
    ],
    "suggestions": [
      "You frequently send USD to US beneficiaries.",
      "Your last payment to Mehta Exports was 6 days ago.",
      "Finish your pending draft payment."
    ]
  }
};

export const DASHBOARD_INSIGHTS = {
  "fx_savings_inr": 4200,
  "fx_savings_percent": "0.65%",
  "success_rate": "98.7%",
  "average_delivery_time": "4h 32m"
};

export const TRACKING_RIBBON_METADATA = {
  "icons": {
    "previous": "check",
    "current": "dot",
    "next": "clock"
  },
  "colors": {
    "previous": "#8F8F8F",
    "current": "#1A73E8",
    "next": "#B0B0B0"
  }
};

export const TRACKING_FILTERS = {
  "orm_types": ["LRS", "Trade Advance", "Trade Direct"],
  "status": ["In Progress", "Completed", "Failed", "On Hold"],
  "date_ranges": ["Today", "Last 7 days", "Last 30 days", "Custom"],
  "amount_bands": ["Below 1L", "1L-10L", "Above 10L"],
  "currencies": ["INR", "USD", "EUR", "GBP", "AED"]
};

export const EXCEPTION_HANDLING_DATA: { recent_exceptions: ExceptionItem[] } = {
  "recent_exceptions": [
    {
      "id": "EX001",
      "field": "BIC/SWIFT Code",
      "issue": "Invalid BIC format entered",
      "why_it_occurred": "BIC did not match the MDM registry for country = US",
      "suggestion": "Check BIC using Search BIC feature",
      "severity": "medium"
    },
    {
      "id": "EX001_ALT", // Mapping helper for Trade Forms
      "field": "BIC Code",
      "issue": "Invalid BIC format entered",
      "why_it_occurred": "BIC did not match the MDM registry for country = US",
      "suggestion": "Check BIC using Search BIC feature",
      "severity": "medium"
    },
    {
      "id": "EX002",
      "field": "HS Code",
      "issue": "HS Code missing for import transaction",
      "why_it_occurred": "User skipped HS Code on Trade Direct import",
      "suggestion": "HS Code is mandatory for Trade flows",
      "severity": "high"
    },
    {
      "id": "EX003",
      "field": "PAN Number",
      "issue": "PAN mismatch detected",
      "why_it_occurred": "PAN in CIF did not match user-entered PAN",
      "suggestion": "Use PAN auto-fill from CIF",
      "severity": "medium"
    },
    {
      "id": "EX003_ALT", // Mapping helper for Forms
      "field": "PAN No.",
      "issue": "PAN mismatch detected",
      "why_it_occurred": "PAN in CIF did not match user-entered PAN",
      "suggestion": "Use PAN auto-fill from CIF",
      "severity": "medium"
    },
    {
      "id": "EX004",
      "field": "Invoice Amount",
      "issue": "Invoice Amount did not match Utilisation Amount",
      "why_it_occurred": "User entered higher utilisation than invoice amount",
      "suggestion": "Ensure Utilisation Amount <= Invoice Amount",
      "severity": "high"
    }
  ]
};

export const ADVANCE_FEES_FX_DATA = {
  "fx_rate_prediction": "83.42",
  "fx_spread": "0.18%",
  "bank_charges": "INR 1,000",
  "correspondent_charges": "USD 18",
  "gst_on_charges": "INR 180",
  "expected_total_debit_inr": "INR 1,86,450",
  "expected_total_debit_ccy": "USD 2,200",
  "notes": "Based on your previous ORM transactions, correspondent charges are typically USD 15–20."
};

export const NOTIFICATION_SETTINGS_DATA = {
  "notification_settings": {
    "channels": ["mobile_push", "sms", "whatsapp"],
    "templates": {
      "mobile_push": "Your ORM request (Ref {{id}}) has been received.",
      "sms": "ICICI Bank: ORM Ref {{id}} submitted successfully.",
      "whatsapp": "Your ORM {{type}} payment has been submitted. Ref {{id}}."
    },
    "sample_values": {
      "id": "ORM202602120001",
      "type": "Trade Advance",
      "amount": "USD 12,000"
    }
  }
};

export const PERSONALIZATION_DATA = {
  "user_pattern": {
    "popular_currency": "USD",
    "popular_country": "US",
    "average_transfer_amount": "USD 8,500",
    "average_transfer_time_hours": 14,
    "historical_fx_pattern": "Better FX rates observed between 10:00–12:00 IST",
    "common_errors": ["Incorrect BIC", "Missing HS Code"]
  }
};

export const GPI_TIME_ESTIMATES: Record<string, Record<string, string>> = {
  "LRS": {
    "Payment Initiated": "1–2 minutes",
    "Bank Processing": "10–15 minutes",
    "Screening (Conditional)": "5–12 minutes",
    "Sent to Correspondent Bank": "6–8 hours",
    "Payment Credited": "2–4 hours later"
  },
  "TRADE_ADVANCE": {
    "Payment Initiated": "1–3 minutes",
    "Trade Compliance Verification": "10–20 minutes",
    "Contract / Proforma Invoice Validation": "20–30 minutes",
    "Screening (Mandatory)": "15–25 minutes",
    "Intermediary Bank Routing": "3–5 hours",
    "Correspondent Bank Processing": "6–10 hours",
    "Final Bank Processing": "1–2 hours",
    "Payment Credited": "Instant after final processing"
  },
  "TRADE_DIRECT": {
    "Payment Initiated": "1–3 minutes",
    "Shipment Document Check": "15–25 minutes",
    "Invoice Validation": "10–20 minutes",
    "Screening (Conditional)": "10–15 minutes",
    "Intermediary Bank Routing": "2–4 hours",
    "Correspondent Bank": "4–7 hours",
    "Payment Credited": "1–2 hours later"
  }
};

export const COUNTERPARTY_ETA_DATA: Record<string, number> = {
  "LRS_USD_US": 18,
  "TRADE_ADVANCE_USD_EU": 24,
  "TRADE_DIRECT_USD_SG": 16
};

export const SCREENING_STAGE_DATA = {
  "reason": "Routine AML & sanctions screening",
  "checks_running": [
    "Sanctions list scan",
    "Beneficiary risk evaluation",
    "Bank/Branch compliance validation"
  ],
  "estimated_time": "10–20 minutes",
  "notes": "Screening is automatic; no user action required."
};

export const SCREENING_COMPLETION_DATA = {
  "status": "completed",
  "duration": "12 minutes",
  "checks_passed": [
    "Sanctions list screening",
    "Beneficiary verification",
    "Corridor risk scan"
  ],
  "notes": "No action required; screening successful."
};

export const NEW_CUSTOMER_LOOKUP: Record<string, any> = {
  "CIF90801": {
    "customer_name": "Aarav International Pvt Ltd",
    "account_number": "001122330099",
    "address": "Sector 21, Gurgaon, Haryana",
    "contact": "+91-9898989898",
    "email": "finance@aaravintl.com",
    "pan": "AAACA9988D"
  },
  "CIF77821": {
    "customer_name": "Mehta Exports LLP",
    "account_number": "009911223344",
    "address": "Fort, Mumbai, Maharashtra",
    "contact": "+91-9820202020",
    "email": "accounts@mehtaexp.com",
    "pan": "AABCM7788R"
  }
};

export const GPI_ROUTING_PATHS = [
  {
    intermediary_bic: 'CHASUS33XXX',
    routing_bic: 'CITIUS33XXX',
    transfer_type: 'MT103',
    nostro_path: ['ICICINBB', 'CHASUS33', 'CITIUS33']
  }
];

export const SANCTIONS_RESULTS = [
  {
    beneficiary: 'Nova Trading LLC',
    sanctions_status: 'PASS',
    screening_ref: 'SCR-99221-A'
  },
  {
    beneficiary: 'Euro Machines AG',
    sanctions_status: 'PASS',
    screening_ref: 'SCR-88112-B'
  },
  {
    beneficiary: 'Global Exports LLC',
    sanctions_status: 'PASS',
    screening_ref: 'SCR-77332-C'
  }
];

export const MOCK_TRACKING: TrackingInfo[] = [
  {
    "txn_id": "TXN9001",
    "rail": PaymentRail.ORM,
    "orm_type": "TRADE_ADVANCE",
    "uetr": "uetr-adv-93b12c5e-0d91",
    "beneficiary": "Nova Trading LLC",
    "currency": "USD",
    "amount": 11000,
    "last_updated": new Date().toISOString(),
    "overall_status": "in_progress",
    "timeline": [
      { "event": "Payment Initiated", "status": "completed", "timestamp": "2026-02-04T10:01Z" },
      { "event": "Trade Compliance Verification", "status": "completed", "timestamp": "2026-02-04T10:02Z" },
      { "event": "Contract/Invoice Validation", "status": "completed", "timestamp": "2026-02-04T10:03Z" },
      { "event": "Screening (Mandatory)", "status": "in_progress", "timestamp": "2026-02-04T10:04Z" },
      { "event": "Intermediary Bank Routing", "status": "pending" },
      { "event": "Correspondent Bank Processing", "status": "pending" },
      { "event": "Final Bank Processing", "status": "pending" },
      { "event": "Payment Credited", "status": "pending" }
    ]
  },
  {
    "txn_id": "TXN-LRS-01",
    "rail": PaymentRail.ORM,
    "orm_type": "LRS",
    "uetr": "uetr-lrs-8822-bc77",
    "beneficiary": "Euro Machines AG",
    "currency": "EUR",
    "amount": 2500,
    "last_updated": new Date().toISOString(),
    "overall_status": "in_progress",
    "timeline": [
      { "event": "Payment Initiated", "status": "completed", "timestamp": "2026-02-05T09:00Z" },
      { "event": "Bank Processing", "status": "completed", "timestamp": "2026-02-05T09:15Z" },
      { "event": "Screening (Conditional)", "status": "in_progress", "timestamp": "2026-02-05T09:30Z" },
      { "event": "Sent to Correspondent Bank", "status": "pending" },
      { "event": "Payment Credited", "status": "pending" }
    ]
  },
  {
    "txn_id": "TXN-DIR-02",
    "rail": PaymentRail.ORM,
    "orm_type": "TRADE_DIRECT",
    "uetr": "uetr-dir-5566-ff99",
    "beneficiary": "Global Tech Corp",
    "currency": "USD",
    "amount": 45000,
    "last_updated": new Date().toISOString(),
    "overall_status": "in_progress",
    "timeline": [
      { "event": "Payment Initiated", "status": "completed", "timestamp": "2026-02-05T08:00Z" },
      { "event": "Shipment Document Check", "status": "completed", "timestamp": "2026-02-05T08:20Z" },
      { "event": "Invoice Validation", "status": "completed", "timestamp": "2026-02-05T08:45Z" },
      { "event": "Screening (Conditional)", "status": "in_progress", "timestamp": "2026-02-05T09:00Z" },
      { "event": "Intermediary Bank Routing", "status": "pending" },
      { "event": "Correspondent Bank", "status": "pending" },
      { "event": "Payment Credited", "status": "pending" }
    ]
  },
  {
    "txn_id": "TXN9002",
    "rail": PaymentRail.RTGS,
    "beneficiary": "Apex Global Industries",
    "currency": "INR",
    "amount": 550000,
    "last_updated": new Date().toISOString(),
    "overall_status": "in_progress",
    "timeline": [
      { "event": "Payment Created", "status": "completed", "timestamp": "2026-02-02T11:20Z" },
      { "event": "Entered RBI Queue", "status": "in_progress", "timestamp": "2026-02-02T11:22Z" },
      { "event": "RBI Settlement Window (Queue 112)", "status": "pending" },
      { "event": "RTGS Settled", "status": "pending" },
      { "event": "Beneficiary Credited", "status": "pending" }
    ]
  },
  {
    "txn_id": "TXN9003",
    "rail": PaymentRail.NEFT,
    "beneficiary": "Zenith Electronics",
    "currency": "INR",
    "amount": 32000,
    "last_updated": new Date(Date.now() - 7200000).toISOString(),
    "overall_status": "stuck",
    "timeline": [
      { "event": "Batch Accepted", "status": "completed", "timestamp": "2026-02-02T08:00Z" },
      { "event": "RBI Batch Processing", "status": "in_progress", "timestamp": "2026-02-02T08:05Z" },
      { "event": "Payment Released", "status": "pending" },
      { "event": "Final Credit", "status": "pending" }
    ]
  }
];

export const MOCK_BENEFICIARIES: Beneficiary[] = [
  {
    "beneficiary_id": "B001",
    "name": "Global Exports LLC",
    "account_number": "123456789012",
    "ifsc_or_bic": "HDFCINBB",
    "bank_name": "HDFC Bank",
    "country": "IN",
    "preferred_payment_mode": PaymentRail.RTGS,
    "last_successful_mode": PaymentRail.RTGS,
    "avg_transfer_amount": 550000,
    "risk_score": 12,
    "discrepancy_patterns": ["none"]
  },
  {
    "beneficiary_id": "B002",
    "name": "Sunrise Trading Ltd",
    "account_number": "US768900001122",
    "ifsc_or_bic": "CITIUS33",
    "bank_name": "Citibank",
    "country": "US",
    "preferred_payment_mode": PaymentRail.ORM,
    "last_successful_mode": PaymentRail.ORM,
    "avg_transfer_amount": 12000,
    "risk_score": 33,
    "discrepancy_patterns": ["wrong_bic_once"]
  },
  {
    "beneficiary_id": "B003",
    "name": "Local Retail retailer Store",
    "account_number": "987654321098",
    "ifsc_or_bic": "ICIC0001234",
    "bank_name": "ICICI Bank",
    "country": "IN",
    "preferred_payment_mode": PaymentRail.NEFT,
    "last_successful_mode": PaymentRail.NEFT,
    "avg_transfer_amount": 25000,
    "risk_score": 5,
    "discrepancy_patterns": ["none"]
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    txn_id: 'TXN8001',
    beneficiary_id: 'B001',
    beneficiary_name: 'Global Exports LLC',
    amount: 550000,
    currency: 'INR',
    rail: PaymentRail.RTGS,
    date_time: '2026-02-01T10:00:00Z',
    status: 'SUCCESS',
    status_color: 'green',
    intelligence_tags: ['recurring', 'high_value']
  },
  {
    txn_id: 'TXN8002',
    beneficiary_id: 'B002',
    beneficiary_name: 'Sunrise Trading Ltd',
    amount: 12000,
    currency: 'USD',
    rail: PaymentRail.ORM,
    date_time: '2026-02-02T14:30:00Z',
    status: 'SUCCESS',
    status_color: 'green',
    intelligence_tags: ['trade_settlement']
  },
  {
    txn_id: 'TXN8003',
    beneficiary_id: 'B003',
    beneficiary_name: 'Local Retailer Store',
    amount: 25000,
    currency: 'INR',
    rail: PaymentRail.NEFT,
    date_time: '2026-02-03T09:15:00Z',
    status: 'SUCCESS',
    status_color: 'green',
    intelligence_tags: ['utility_payment']
  }
];

export const CUSTOMER_MASTER: CustomerProfile[] = [
  {
    "cif_id": "CIF1001",
    "customer_name": "Apex Global Industries",
    "primary_account_number": "001123300112",
    "available_balance": 22500000,
    "debit_account_number": "001123300112",
    "debit_account_balance": 22500000,
    "remitter_name": "Apex Global Industries",
    "contact_number": "+91-9988776655",
    "email": "finance@apexglobal.com",
    "contact_person": "Rahul Mehta",
    "priority_processing": "Yes",
    "address": "10th Floor, Cyber Greens, Gurugram",
    "pan_no": "AACCA9988F",
    "ie_ref_no": "IEC99887755",
    "deferral_status": "None",
    "deferral_reason": "",
    "deferral_due_date": ""
  },
  {
    "cif_id": "CIF1002",
    "customer_name": "Zenith Electronics Pvt Ltd",
    "primary_account_number": "000889922337",
    "available_balance": 7800000,
    "debit_account_number": "000889922337",
    "debit_account_balance": 7800000,
    "remitter_name": "Zenith Electronics Pvt Ltd",
    "contact_number": "+91-9090901234",
    "email": "accounts@zenith.com",
    "contact_person": "Asha Kapoor",
    "priority_processing": "No",
    "address": "Sector 21, Navi Mumbai",
    "pan_no": "AAACZ7733K",
    "ie_ref_no": "IEC77665544",
    "deferral_status": "Pending Additional Docs",
    "deferral_reason": "Shipping documents required",
    "deferral_due_date": "2026-02-10"
  }
];

export const ORM_BENEFICIARIES: Beneficiary[] = [
  {
    "beneficiary_id": "ORMB001",
    "name": "Nova Trading LLC",
    "account_number": "US098712345678",
    "ifsc_or_bic": "CITIUS33XXX",
    "country": "USA",
    "bank_name": "Citibank New York",
    "address": "102 Madison Ave, New York, USA",
    "email": "payments@novatrading.com",
    "mobile": "+1-202-554-8800",
    "lei": "529900T8BM49AURSDO17",
    "lei_expiry": "2026-08-31",
    "preferred_payment_mode": PaymentRail.ORM,
    "last_successful_mode": PaymentRail.ORM,
    "avg_transfer_amount": 50000,
    "risk_score": 10,
    "discrepancy_patterns": [],
    "cif_id": "CIF1001"
  },
  {
    "beneficiary_id": "ORMB002",
    "name": "Euro Machines AG",
    "account_number": "DE098712345678",
    "ifsc_or_bic": "DEUTDEFF500",
    "country": "Germany",
    "bank_name": "Deutsche Bank Frankfurt",
    "address": "Mainzer Landstraße 11, Frankfurt",
    "email": "finance@euromachines.de",
    "mobile": "+49-69-123456",
    "lei": "52990045GD3FRANK2001",
    "lei_expiry": "2025-11-30",
    "preferred_payment_mode": PaymentRail.ORM,
    "last_successful_mode": PaymentRail.ORM,
    "avg_transfer_amount": 120000,
    "risk_score": 5,
    "discrepancy_patterns": [],
    "cif_id": "CIF1002"
  }
];

export const DUMMY_BENEFICIARY_DATA = {
  "beneficiaries": [
    {
      "id": "BEN1001",
      "name": "Rahul Enterprises",
      "account_number": "001122334455",
      "ifsc": "ICIC0001234",
      "bank_name": "ICICI Bank",
      "email": "payments@rahulent.com",
      "mobile": "+91-9876543210",
      "country": "India",
      "preferred_mode": "RTGS"
    },
    {
      "id": "BEN2001",
      "name": "Global Export LLC",
      "account_number": "US778899001122",
      "bic": "CITIUS33",
      "bank_name": "Citibank New York",
      "email": "finance@globalexport.com",
      "mobile": "+1-202-555-0145",
      "country": "United States",
      "preferred_mode": "SWIFT"
    }
  ]
};

export const PROFILE_DATA = {
  "customer_name": "Rahul Sharma",
  "cif_id": "CIF90801",
  "mobile": "+91-9876543210",
  "email": "rahul.sharma@example.com",
  "last_login": "2026-02-05 10:42 AM",
  "kyc_status": "KYC Verified",
  "default_debit_account": "ICICI Bank - 001122330099",
  "preferred_currency": "USD",
  "total_payments_done": 47,
  "success_rate": "98.7%"
};

export const PROFILE_LIMITS = {
  "lrs_limit": "USD 250,000/year",
  "trade_advance_limit": "Configured by Bank",
  "trade_direct_limit": "Configured by Bank"
};

export const ACTIVE_CARD_RIBBON_STYLE = {
  "previous": { "icon": "check", "color": "#4CAF50" },
  "current": { "icon": "clock", "color": "#FFC107" },
  "next": { "icon": "dots", "color": "#B8B8B8", "opacity": 0.6 }
};

export const PAYMENT_ADVICE_TEMPLATE = {
  "title": "Payment Advice",
  "note": "This is a system-generated advice for your records.",
  "dummy_reference": "ADVC-2026-001",
  "dummy_value_date": "2026-02-05"
};

export const AUTH_DATA = {
  "valid_username": "soumya",
  "valid_password": "newgen",
  "is_logged_in": false
};

export const CURRENCY_HISTORY = {
  "usd_inr": {
    "today": 83.12,
    "7d": [82.70, 82.85, 82.91, 83.00, 83.05, 83.10, 83.12]
  },
  "eur_inr": {
    "today": 89.76,
    "7d": [88.90, 89.10, 89.20, 89.30, 89.40, 89.60, 89.76]
  }
};
