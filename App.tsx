import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  CreditCard,
  User,
  History,
  TrendingUp,
  Fingerprint,
  ChevronDown,
  ChevronRight,
  Plus,
  Zap,
  Building2,
  Lock,
  Phone,
  ShieldCheck,
  Activity,
  MapPin,
  FileText,
  RefreshCw,
  ListChecks,
  AlertTriangle,
  Package,
  Truck,
  CheckSquare,
  ShieldAlert,
  Anchor,
  Navigation,
  BrainCircuit,
  Sparkles,
  UploadCloud,
  Loader2,
  Info,
  Bell,
  MessageSquare,
  Smartphone,
  Target,
  Clock,
  SearchCheck,
  UserPlus,
  Link as LinkIcon,
  X,
  Coins,
  ShieldHalf,
  Timer,
  Search,
  Circle,
  Filter,
  Calendar,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  ChevronLeft,
  MoreHorizontal,
  Download,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Beneficiary, PaymentRail, PaymentState, CustomerProfile, GpiDetails, OrmType, ExceptionItem, TrackingInfo, TrackingStatus, Transaction } from './types';
import { 
  CUSTOMER_MASTER,
  ORM_BENEFICIARIES,
  GPI_ROUTING_PATHS,
  SANCTIONS_RESULTS,
  MOCK_TRACKING,
  MOCK_TRANSACTIONS,
  EXCEPTION_HANDLING_DATA,
  ADVANCE_FEES_FX_DATA,
  NOTIFICATION_SETTINGS_DATA,
  PERSONALIZATION_DATA,
  GPI_TIME_ESTIMATES,
  COUNTERPARTY_ETA_DATA,
  SCREENING_STAGE_DATA,
  SCREENING_COMPLETION_DATA,
  NEW_CUSTOMER_LOOKUP,
  DASHBOARD_DATA,
  DASHBOARD_INSIGHTS,
  DUMMY_BENEFICIARY_DATA,
  TRACKING_RIBBON_METADATA,
  TRACKING_FILTERS,
  PROFILE_DATA,
  PROFILE_LIMITS,
  ACTIVE_CARD_RIBBON_STYLE,
  PAYMENT_ADVICE_TEMPLATE,
  AUTH_DATA,
  CURRENCY_HISTORY
} from './data';

// --- GPI Milestone Mapping ---

const GPI_MAP: Record<OrmType, string[]> = {
  'LRS': [
    "Payment Initiated",
    "Bank Processing",
    "Screening (Conditional)",
    "Sent to Correspondent Bank",
    "Payment Credited"
  ],
  'TRADE_ADVANCE': [
    "Payment Initiated",
    "Trade Compliance Verification",
    "Contract / Proforma Invoice Validation",
    "Screening (Mandatory)",
    "Intermediary Bank Routing",
    "Correspondent Bank Processing",
    "Final Bank Processing",
    "Payment Credited"
  ],
  'TRADE_DIRECT': [
    "Payment Initiated",
    "Shipment Document Check",
    "Invoice Validation",
    "Screening (Conditional)",
    "Intermediary Bank Routing",
    "Correspondent Bank",
    "Payment Credited"
  ]
};

// --- Mini Graph Component ---

const MiniGraph = ({ data, color }: { data: number[], color: string }) => {
  const min = Math.min(...data) - 0.05;
  const max = Math.max(...data) + 0.05;
  const range = max - min;
  const width = 200;
  const height = 60;
  
  const getX = (i: number) => (i / (data.length - 1)) * width;
  const getY = (v: number) => height - ((v - min) / range) * height;

  const points = data.map((v, i) => ({ x: getX(i), y: getY(v) }));
  
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    d += ` Q ${p0.x} ${p0.y} ${cpX} ${(p0.y + p1.y) / 2} T ${p1.x} ${p1.y}`;
  }

  return (
    <div className="relative w-full h-12 mt-4 xl:h-16">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible opacity-80">
        <path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="opacity-10" />
      </svg>
    </div>
  );
};

// --- Currency Trends Widget ---

const CurrencyTrendsWidget = () => {
  const h = CURRENCY_HISTORY;
  return (
    <div className="animate-icici">
      <p className="text-[9px] xl:text-[13px] font-black text-[#C0382B] uppercase tracking-[0.2em] mb-4 xl:mb-8 opacity-60">💱 Currency Trends (vs INR)</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-8">
        {[
          { label: 'USD → INR', value: `₹${h.usd_inr.today}`, history: h.usd_inr['7d'], color: '#EF6623', bg: 'bg-orange-50/30' },
          { label: 'EUR → INR', value: `₹${h.eur_inr.today}`, history: h.eur_inr['7d'], color: '#4A90E2', bg: 'bg-blue-50/30' }
        ].map((c, i) => (
          <div key={i} className="bg-white border border-[#E5D4C3] rounded-2xl p-5 xl:p-8 xl:rounded-[24px] shadow-sm xl:shadow-md group hover:border-[#EF6623] transition-all">
            <div className="flex justify-between items-start mb-1 xl:mb-2">
              <div>
                <p className="text-[10px] xl:text-[14px] font-black text-[#6A6A6A] uppercase tracking-widest">{c.label}</p>
                <p className="text-xl xl:text-3xl font-black text-[#C0382B] mt-1">{c.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${c.bg}`}>
                <TrendingUp size={16} style={{ color: c.color }} className="xl:w-6 xl:h-6" />
              </div>
            </div>
            <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] opacity-40 uppercase">7D Historical Trend</p>
            <MiniGraph data={c.history} color={c.color} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Login Screen Component ---

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === AUTH_DATA.valid_username && password === AUTH_DATA.valid_password) {
      onLogin();
    } else {
      setError("Incorrect username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col items-center justify-center p-6 xl:p-0">
      <div className="w-full max-w-md bg-white border border-[#E5D4C3] rounded-[32px] p-8 xl:p-12 shadow-2xl animate-icici">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#EF6623] p-4 rounded-3xl text-white shadow-lg mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl xl:text-3xl font-black text-[#C0382B] uppercase tracking-tight text-center">Smart Payments</h1>
          <p className="text-[10px] xl:text-[12px] font-bold text-[#6A6A6A] uppercase tracking-[0.2em] mt-2 opacity-60">ICICI Bank • Secure Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[9px] xl:text-[11px] font-black text-[#6A6A6A] uppercase tracking-widest block mb-2 opacity-60">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#EF6623]" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(null); }}
                className="w-full border-b-2 border-[#E5D4C3] py-3 pl-8 text-sm xl:text-base font-bold text-[#C0382B] outline-none focus:border-[#EF6623] transition-colors bg-transparent"
                placeholder="Enter Username"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] xl:text-[11px] font-black text-[#6A6A6A] uppercase tracking-widest block mb-2 opacity-60">Password</label>
            <div className="relative">
              <Fingerprint size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#EF6623]" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                className="w-full border-b-2 border-[#E5D4C3] py-3 pl-8 pr-10 text-sm xl:text-base font-bold text-[#C0382B] outline-none focus:border-[#EF6623] transition-colors bg-transparent"
                placeholder="Enter Password"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#B0B0B0] hover:text-[#EF6623] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
              <p className="text-[9px] xl:text-[11px] font-bold text-red-700 uppercase">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-[#EF6623] text-white font-black py-5 xl:py-6 rounded-[16px] xl:rounded-[20px] uppercase text-xs xl:text-sm tracking-[0.2em] shadow-xl hover:bg-[#C0382B] transition-colors active:scale-95 mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[8px] xl:text-[10px] font-bold text-[#6A6A6A] uppercase tracking-widest opacity-40">
            By logging in, you agree to our terms of service and security policy.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Payment Advice Component ---

const PaymentAdviceCard = ({ data, t }: { data: PaymentState, t?: TrackingInfo }) => {
  const [toast, setToast] = useState<string | null>(null);
  const advice = PAYMENT_ADVICE_TEMPLATE;

  const handleAction = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const displayData = {
    beneficiary_name: t?.beneficiary || data.beneficiary?.name || data.advanced?.beneficiaryName || "N/A",
    beneficiary_account: data.beneficiary?.account_number || data.advanced?.beneficiaryAccount || "N/A",
    bank_name: data.beneficiary?.bank_name || "N/A",
    amount: t?.amount || data.amount,
    currency: t?.currency || data.advanced?.remittanceIn || "USD",
    charges: data.chargeType || "SHA",
    txn_ref_no: t?.txn_id || data.advanced?.uniqueRefNo || advice.dummy_reference,
    uetr: t?.uetr || data.gpiDetails?.uetr || "a2b7c1d8-4421-49f9-91c0-112233445566",
    value_date: advice.dummy_value_date,
    purpose: data.advanced?.purposeDesc || "S0007 - Family Maintenance",
    remitter: data.customerProfile?.customer_name || PROFILE_DATA.customer_name,
    debit_account: data.customerProfile?.primary_account_number || PROFILE_DATA.default_debit_account
  };

  const Row = ({ label, value, mono = false }: any) => (
    <div className="flex justify-between items-start py-2 border-b border-[#FAF9F7] last:border-0 xl:py-3">
      <span className="text-[8px] xl:text-[10px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 w-1/3">{label}</span>
      <span className={`text-[9px] xl:text-[11px] font-bold text-[#C0382B] text-right flex-1 break-all uppercase ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );

  return (
    <div className="relative animate-icici">
      {toast && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-[100] w-full animate-icici">
           <div className="bg-[#EF6623] text-white py-2 px-4 rounded-xl text-[9px] xl:text-[11px] font-black uppercase text-center shadow-xl">
             {toast}
           </div>
        </div>
      )}
      <div className="bg-white border border-[#E5D4C3] rounded-[24px] overflow-hidden shadow-sm xl:shadow-md">
        <div className="bg-[#FAF9F7] px-6 py-4 flex items-center justify-between border-b border-[#E5D4C3]/30 xl:px-8 xl:py-5">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#EF6623] xl:w-5 xl:h-5" />
            <h3 className="text-[10px] xl:text-[12px] font-black text-[#C0382B] uppercase tracking-widest">{advice.title}</h3>
          </div>
          <span className="text-[8px] xl:text-[10px] font-bold text-[#6A6A6A] opacity-40">REF: {displayData.txn_ref_no}</span>
        </div>
        
        <div className="p-6 space-y-1 xl:p-8 xl:space-y-2">
          <Row label="Beneficiary" value={displayData.beneficiary_name} />
          <Row label="Account No" value={displayData.beneficiary_account} mono />
          <Row label="Bank" value={displayData.bank_name} />
          <Row label="Amount" value={`${displayData.amount.toLocaleString()} ${displayData.currency}`} />
          <Row label="Charges" value={displayData.charges} />
          <Row label="UETR" value={displayData.uetr} mono />
          <Row label="Value Date" value={displayData.value_date} />
          <Row label="Purpose Code" value={displayData.purpose} />
          <Row label="Remitter" value={displayData.remitter} />
          <Row label="Debit Account" value={displayData.debit_account} mono />
          
          <p className="pt-4 text-[8px] xl:text-[10px] text-[#6A6A6A] font-bold opacity-40 leading-relaxed italic">
            {advice.note}
          </p>
        </div>

        <div className="flex border-t border-[#E5D4C3]/30">
          <button 
            onClick={() => handleAction("Advice downloaded (dummy).")}
            className="flex-1 flex items-center justify-center gap-2 py-4 xl:py-5 bg-[#FAF9F7] text-[9px] xl:text-[11px] font-black text-[#6A6A6A] uppercase tracking-widest hover:bg-white transition-colors"
          >
            <Download size={14} className="xl:w-4 xl:h-4" /> PDF
          </button>
          <div className="w-px bg-[#E5D4C3]/30"></div>
          <button 
            onClick={() => handleAction("Advice shared successfully (dummy).")}
            className="flex-1 flex items-center justify-center gap-2 py-4 xl:py-5 bg-[#FAF9F7] text-[9px] xl:text-[11px] font-black text-[#6A6A6A] uppercase tracking-widest hover:bg-white transition-colors"
          >
            <Share2 size={14} className="xl:w-4 xl:h-4" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Hyper-Personalized Insights Component ---

const HyperPersonalizedInsights = () => {
  const [isOpen, setIsOpen] = useState(false);
  const p = PERSONALIZATION_DATA.user_pattern;

  return (
    <div className="bg-gradient-to-br from-[#FAF9F7] to-white border-l-4 border-[#C0382B] rounded-[16px] shadow-sm mb-6 overflow-hidden border border-[#E5D4C3]/30 xl:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAF9F7] transition-colors xl:px-7 xl:py-5"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 text-[#C0382B] rounded-lg xl:p-3">
            <Target size={18} className="xl:w-6 xl:h-6" />
          </div>
          <div>
            <span className="text-[11px] xl:text-[14px] font-black text-[#C0382B] uppercase tracking-[0.1em] block">Hyper-Personalized Insights (Optional)</span>
            <span className="text-[9px] xl:text-[11px] text-[#6A6A6A] font-medium block">Patterns based on your typical {p.popular_currency} payments to {p.popular_country}.</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] xl:text-[11px] font-black text-[#F15A22] uppercase tracking-widest">{isOpen ? 'Hide' : 'Analyze'}</span>
          {isOpen ? <ChevronDown size={14} className="rotate-180 text-[#6A6A6A] xl:w-5 xl:h-5" /> : <ChevronDown size={14} className="text-[#6A6A6A] xl:w-5 xl:h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-2 animate-icici border-t border-[#FAF9F7] xl:px-7 xl:pb-7">
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 xl:grid-cols-4 xl:gap-x-10">
            <div>
              <p className="text-[8px] xl:text-[10px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 mb-1">Most Used CCY / Country</p>
              <p className="text-[11px] xl:text-[14px] font-black text-[#C0382B]">{p.popular_currency} / {p.popular_country}</p>
            </div>
            <div>
              <p className="text-[8px] xl:text-[10px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 mb-1">Avg. Transfer Size</p>
              <p className="text-[11px] xl:text-[14px] font-black text-[#C0382B]">{p.average_transfer_amount}</p>
            </div>
            <div>
              <p className="text-[8px] xl:text-[10px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 mb-1">Avg. Delivery Time</p>
              <p className="text-[11px] xl:text-[14px] font-black text-[#C0382B]">{p.average_transfer_time_hours} Hours</p>
            </div>
            <div>
              <p className="text-[8px] xl:text-[10px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 mb-1">Historical FX Pattern</p>
              <p className="text-[11px] xl:text-[14px] font-black text-green-600">{p.historical_fx_pattern}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-dashed border-[#E5D4C3] xl:mt-6 xl:pt-6">
             <p className="text-[8px] xl:text-[10px] font-black text-[#6A6A6A] uppercase tracking-[0.2em] mb-2 opacity-60">Suggestions to Improve Success Rate</p>
             <div className="flex wrap gap-2 xl:gap-3">
                {p.common_errors.map((err, idx) => (
                  <span key={idx} className="bg-orange-50 text-orange-700 text-[9px] xl:text-[11px] font-bold px-2 py-1 rounded-full border border-orange-100 flex items-center gap-1 xl:px-4 xl:py-1.5">
                    <AlertTriangle size={10} className="xl:w-3 xl:h-3" /> Review {err}
                  </span>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Screening Details Component ---

const ScreeningDetailsCard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const s = SCREENING_COMPLETION_DATA;

  return (
    <div className="mt-4 bg-[#F0FAF4] border border-green-100 rounded-[16px] overflow-hidden shadow-sm animate-icici xl:mt-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-green-100/30 xl:px-6 xl:py-4"
      >
        <div className="flex items-center gap-2">
          <SearchCheck size={16} className="text-green-600 xl:w-5 xl:h-5" />
          <span className="text-[10px] xl:text-[13px] font-black text-green-900 uppercase tracking-widest">🔍 Screening Completed</span>
        </div>
        {isOpen ? <ChevronDown size={14} className="rotate-180 text-green-600 xl:w-5 xl:h-5" /> : <ChevronDown size={14} className="text-green-600 xl:w-5 xl:h-5" />}
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-3 xl:p-6 xl:space-y-4">
          <ul className="space-y-2 xl:space-y-3">
            <li className="text-[9px] xl:text-[11px] font-bold text-green-800 uppercase flex items-start gap-2">
              <span className="text-green-400">•</span> AML & Sanctions scan done
            </li>
            <li className="text-[9px] xl:text-[11px] font-bold text-green-800 uppercase flex items-start gap-2">
              <span className="text-green-400">•</span> Beneficiary bank validated
            </li>
            <li className="text-[9px] xl:text-[11px] font-bold text-green-800 uppercase flex items-start gap-2">
              <span className="text-green-400">•</span> Risk corridor check passed
            </li>
            <li className="text-[9px] xl:text-[11px] font-bold text-green-800 uppercase flex items-start gap-2">
              <span className="text-green-400">•</span> Total duration: {s.duration}
            </li>
          </ul>
          <div className="pt-2 border-t border-green-100 xl:pt-3">
            <p className="text-[8px] xl:text-[10px] font-bold text-green-700">{s.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Exception Handling Module (Independent Section) ---

const ExceptionHandlingModule = ({ minimal = false }: { minimal?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const exceptions = EXCEPTION_HANDLING_DATA.recent_exceptions.filter(ex => !ex.id.endsWith('_ALT'));

  if (minimal) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3 mb-6 animate-icici xl:p-5 xl:mb-10">
        <AlertTriangle size={16} className="text-[#F15A22] xl:w-6 xl:h-6" />
        <p className="text-[10px] xl:text-[13px] font-bold text-[#C0382B] uppercase">
          ⚠️ You had 2 past input errors. We’ve improved suggestions for you.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-l-4 border-[#F15A22] rounded-[16px] shadow-sm mb-6 overflow-hidden border border-[#E5D4C3]/30 xl:shadow-md xl:mb-10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAF9F7] transition-colors xl:px-7 xl:py-5"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 text-[#F15A22] rounded-lg xl:p-3">
            <ShieldAlert size={18} className="xl:w-6 xl:h-6" />
          </div>
          <div>
            <span className="text-[11px] xl:text-[14px] font-black text-[#C0382B] uppercase tracking-[0.1em] block">Exception Handling</span>
            <span className="text-[9px] xl:text-[11px] text-[#6A6A6A] font-medium block">Based on your past 4 issues, we have suggestions to reduce errors.</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] xl:text-[11px] font-black text-[#F15A22] uppercase tracking-widest">{isOpen ? 'Hide' : 'View Details'}</span>
          {isOpen ? <ChevronDown size={14} className="rotate-180 text-[#6A6A6A] xl:w-5 xl:h-5" /> : <ChevronDown size={14} className="text-[#6A6A6A] xl:w-5 xl:h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-2 animate-icici border-t border-[#FAF9F7] xl:px-7 xl:pb-7">
          <div className="overflow-x-auto no-scrollbar -mx-5 px-5 xl:mx-0 xl:px-0">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b border-[#E5D4C3]/30 text-[8px] xl:text-[11px] font-black text-[#6A6A6A] uppercase tracking-widest text-left">
                  <th className="py-2 pr-4 xl:py-4">Field</th>
                  <th className="py-2 pr-4 xl:py-4">Issue</th>
                  <th className="py-2 pr-4 xl:py-4">Why It Occurred</th>
                  <th className="py-2 pr-4 xl:py-4">Suggestion</th>
                  <th className="py-2 text-center xl:py-4">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF9F7]">
                {exceptions.map((ex) => (
                  <tr key={ex.id} className="text-[9px] xl:text-[12px] font-medium text-[#6A6A6A]">
                    <td className="py-3 pr-4 font-bold text-[#C0382B] uppercase xl:py-5">{ex.field}</td>
                    <td className="py-3 pr-4 leading-relaxed font-bold xl:py-5">{ex.issue}</td>
                    <td className="py-3 pr-4 leading-relaxed opacity-70 xl:py-5">{ex.why_it_occurred}</td>
                    <td className="py-3 pr-4 leading-relaxed font-bold text-[#F15A22] xl:py-5">{ex.suggestion}</td>
                    <td className="py-3 text-center xl:py-5">
                      <span className={`px-2 py-0.5 rounded-full text-[7px] xl:text-[10px] font-black uppercase tracking-tighter ${
                        ex.severity === 'high' ? 'bg-red-100 text-red-600' : 
                        ex.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {ex.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// --- UI Field Components ---

const RailBadge = ({ rail }: { rail: string }) => {
  const isOrm = rail === 'LRS' || rail === 'Trade Advance' || rail === 'Trade Direct' || rail === PaymentRail.ORM;
  const styles = isOrm ? 'bg-[#C0382B] text-white' : 'bg-[#EF6623] text-white';
  return <span className={`text-[8px] xl:text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] uppercase tracking-wider ${styles}`}>{rail}</span>;
};

const SoftAlert = ({ fieldName }: { fieldName: string }) => {
  const exception = EXCEPTION_HANDLING_DATA.recent_exceptions.find(ex => ex.field === fieldName);
  if (!exception) return null;

  let customMessage = "Based on your past entries, this field may be incorrect.";
  if (fieldName === 'BIC Code' || fieldName === 'BIC/SWIFT Code') {
    customMessage = "You previously entered an incorrect BIC for a US beneficiary.";
  } else if (fieldName === 'HS Code') {
    customMessage = "Last time you missed this mandatory field.";
  }

  return (
    <div className="mt-1.5 p-2 bg-yellow-50 border-l-2 border-yellow-500 rounded-r shadow-sm animate-pulse xl:mt-3 xl:p-3">
      <div className="flex items-start gap-1.5">
        <AlertTriangle size={10} className="text-yellow-600 mt-0.5 xl:w-4 xl:h-4" />
        <div className="flex-1">
          <p className="text-[8px] xl:text-[11px] font-black text-yellow-800 leading-tight">
            {customMessage}
          </p>
          <p className="text-[7px] xl:text-[9px] font-bold text-yellow-700 mt-0.5 opacity-80">
            Suggestion: {exception.suggestion}
          </p>
        </div>
      </div>
    </div>
  );
};

const OrmField = ({ label, value, mono = false, color = '#6A6A6A', fullWidth = false, highlight = false, ocrFilled = false }: { label: string, value: any, mono?: boolean, color?: string, fullWidth?: boolean, highlight?: boolean, ocrFilled?: boolean }) => (
  <div className={`mb-3 flex flex-col ${fullWidth ? 'col-span-2' : ''} ${highlight ? 'bg-orange-50 p-1.5 rounded border-l-2 border-[#F15A22]' : ''} ${ocrFilled ? 'animate-pulse bg-blue-50 border-l-2 border-blue-400 p-1.5 rounded shadow-sm' : ''} xl:mb-5 xl:p-3`}>
    <div className="flex items-center justify-between mb-0.5 xl:mb-1.5">
      <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
      {ocrFilled && <Sparkles size={10} className="text-blue-500 xl:w-4 xl:h-4" />}
    </div>
    <p className={`text-[10px] xl:text-[14px] font-bold leading-tight ${mono ? 'font-mono tracking-tight' : ''}`} style={{ color: ocrFilled ? '#2563EB' : (highlight ? '#C0382B' : color) }}>{value || 'N/A'}</p>
    
    {/* Soft Alert Integration */}
    <SoftAlert fieldName={label} />
  </div>
);

const OrmSection = ({ 
  title, 
  icon: Icon, 
  visibleContent, 
  hiddenContent, 
  defaultExpanded = false 
}: { 
  title: string, 
  icon: any, 
  visibleContent: React.ReactNode, 
  hiddenContent?: React.ReactNode, 
  defaultExpanded?: boolean 
}) => {
  const [sectionOpen, setSectionOpen] = useState(defaultExpanded);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white border-l-4 border-[#EF6623] rounded-[4px] shadow-sm mb-4 overflow-hidden border border-[#E5D4C3]/30 xl:shadow-md xl:mb-6">
      <button 
        onClick={() => setSectionOpen(!sectionOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#FAF9F7] transition-colors xl:px-6 xl:py-5"
      >
        <div className="flex items-center gap-3">
          <div className="text-[#EF6623] p-1.5 bg-[#FAF9F7] rounded-full xl:p-2.5"><Icon size={16} className="xl:w-5 xl:h-5" /></div>
          <span className="text-[10px] xl:text-[14px] font-black text-[#C0382B] uppercase tracking-[0.05em]">{title}</span>
        </div>
        {sectionOpen ? <ChevronDown size={14} className="rotate-180 text-[#6A6A6A] xl:w-5 xl:h-5" /> : <ChevronDown size={14} className="text-[#6A6A6A] xl:w-5 xl:h-5" />}
      </button>

      {sectionOpen && (
        <div className="px-4 pb-4 pt-1 animate-icici border-t border-[#FAF9F7] xl:px-6 xl:pb-6">
          <div className="grid grid-cols-2 gap-x-4 pt-2 xl:gap-x-10 xl:pt-4">
            {visibleContent}
          </div>
          
          {hiddenContent && (
            <>
              <div className="border-t border-dashed border-[#E5D4C3] mt-1 pt-1 xl:mt-3 xl:pt-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMore(!showMore); }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[9px] xl:text-[11px] font-black text-[#EF6623] uppercase tracking-widest"
                >
                  {showMore ? (
                    <>Less Details <ChevronDown size={12} className="rotate-180 xl:w-4 xl:h-4" /></>
                  ) : (
                    <>More Details <ChevronDown size={12} xl:w-4 xl:h-4 /></>
                  )}
                </button>
              </div>

              {showMore && (
                <div className="grid grid-cols-2 gap-x-4 mt-1 pt-2 border-t border-[#FAF9F7] animate-icici xl:gap-x-10 xl:pt-4">
                  {hiddenContent}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const GpiComplianceSection = ({ rail, beneficiary, gpiDetails, setGpiDetails }: { 
  rail: PaymentRail, 
  beneficiary: Beneficiary | null, 
  gpiDetails?: GpiDetails, 
  setGpiDetails: (g: GpiDetails) => void 
}) => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'done'>(gpiDetails ? 'done' : 'idle');

  useEffect(() => {
    if (beneficiary && !gpiDetails && status === 'idle') {
      setStatus('checking');
      const timer = setTimeout(() => {
        const sanction = SANCTIONS_RESULTS.find(s => s.beneficiary === beneficiary?.name) || SANCTIONS_RESULTS[0];
        const routing = GPI_ROUTING_PATHS[0];
        
        const details: GpiDetails = {
          uetr: `a2b7c1d8-4421-49f9-91c0-${Math.random().toString(36).substr(2, 12)}`,
          gpi_service_level: 'URGENT',
          instruction_priority: 'HIGH',
          compliance_status: sanction.sanctions_status as any,
          sanctions_screening_ref: sanction.screening_ref,
          screening_timestamp: new Date().toISOString(),
          intermediary_bic: routing.intermediary_bic,
          routing_bic: routing.routing_bic,
          gpi_transfer_type: 'MT103',
          remitter_legal_address: "Apex Global Industries, India",
          beneficiary_legal_address: beneficiary?.address || "Global Financial Center, USA",
          nostro_path: routing.nostro_path
        };
        setGpiDetails(details);
        setStatus('done');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [beneficiary, gpiDetails, status, setGpiDetails]);

  if (rail !== PaymentRail.ORM) return null;

  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-[16px] p-5 mb-6 relative overflow-hidden backdrop-blur-sm shadow-sm border-l-4 border-l-blue-600 xl:p-8 xl:mb-10">
      <div className="flex items-center justify-between mb-4 xl:mb-6">
        <div className="flex items-center gap-2 xl:gap-4">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-md xl:p-3">
            <ShieldCheck size={14} className="xl:w-6 xl:h-6" />
          </div>
          <span className="text-[10px] xl:text-[14px] font-black text-blue-900 uppercase tracking-[0.15em]">GPI Pre-Authorization Compliance</span>
        </div>
        {status === 'checking' ? (
          <div className="flex items-center gap-2 text-[9px] xl:text-[12px] font-black text-blue-600">
            <Loader2 size={12} className="animate-spin xl:w-5 xl:h-5" /> SCREENING...
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-green-500 text-white px-2.5 py-1 rounded-full text-[8px] xl:text-[11px] font-black uppercase tracking-widest shadow-sm xl:px-5 xl:py-2">
            <CheckSquare size={10} strokeWidth={3} className="xl:w-4 xl:h-4" /> Sanctions Passed
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 xl:gap-8">
        <div className="col-span-2 bg-white/80 p-3 rounded-xl border border-blue-50 shadow-inner xl:p-5">
          <p className="text-[7px] xl:text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 opacity-70">Universal Payment Tracking (UETR)</p>
          <p className="text-[10px] xl:text-[15px] font-mono font-black text-blue-900 truncate tracking-tight">
            {status === 'done' ? gpiDetails?.uetr : 'GENERATING UNIQUE REFERENCE...'}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- New Add Beneficiary Screen ---

function AddBeneficiaryScreen({ onBack, onSave }: { onBack: () => void, onSave: (ben: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Individual',
    accountNumber: '',
    confirmAccountNumber: '',
    bankName: '',
    ifsc: '',
    bic: '',
    email: '',
    mobile: '',
    address1: '',
    address2: '',
    city: '',
    country: 'India',
    preferredMode: 'RTGS',
    nickname: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isIndia = formData.country === 'India';

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }
    if (isIndia) {
      if (!formData.ifsc || formData.ifsc.length !== 11) {
        newErrors.ifsc = 'Valid 11-char IFSC required';
      }
    } else {
      if (!formData.bic || (formData.bic.length !== 8 && formData.bic.length !== 11)) {
        newErrors.bic = 'Valid 8 or 11-char BIC required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const InputField = ({ label, value, onChange, placeholder, error, optional = false, mono = false }: any) => (
    <div className="mb-6 xl:mb-10">
      <div className="flex justify-between items-center mb-1.5 xl:mb-3">
        <label className="text-[9px] xl:text-[12px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60">
          {label} {optional && <span className="text-[8px] xl:text-[10px] lowercase font-medium opacity-50">(Optional)</span>}
        </label>
        {error && <span className="text-[8px] xl:text-[11px] font-bold text-red-500 uppercase">{error}</span>}
      </div>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border-b-2 ${error ? 'border-red-500' : 'border-[#E5D4C3]'} py-2 text-sm xl:text-lg font-bold text-[#C0382B] outline-none focus:border-[#EF6623] transition-colors bg-transparent ${mono ? 'font-mono tracking-tight' : ''}`}
      />
    </div>
  );

  return (
    <div className="p-6 animate-icici xl:p-10 xl:pt-16 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8 xl:mb-16">
        <button onClick={onBack} className="p-1"><ArrowRight className="rotate-180 text-[#EF6623] xl:w-8 xl:h-8" /></button>
        <h2 className="text-[20px] xl:text-[28px] font-black text-[#C0382B] uppercase tracking-tight">Add Beneficiary</h2>
      </div>

      <div className="space-y-8 xl:space-y-16">
        {/* Beneficiary Details */}
        <section>
          <p className="text-[10px] xl:text-[14px] font-black text-[#EF6623] uppercase tracking-[0.2em] mb-4 xl:mb-8 border-b border-[#E5D4C3]/30 pb-2 xl:pb-4">Beneficiary Details</p>
          <div className="grid md:grid-cols-2 md:gap-x-12">
            <InputField label="Beneficiary Name" value={formData.name} onChange={(val: string) => setFormData({...formData, name: val})} placeholder="Enter Full Name" error={errors.name} />
            <div className="mb-6 xl:mb-10">
              <label className="text-[9px] xl:text-[12px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 block mb-2 xl:mb-4">Beneficiary Type</label>
              <div className="flex gap-4">
                {['Individual', 'Business / Company'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setFormData({...formData, type})}
                    className={`flex-1 py-3 px-4 xl:py-4 rounded-xl text-[10px] xl:text-[12px] font-black uppercase tracking-widest border-2 transition-all ${formData.type === type ? 'bg-[#EF6623] text-white border-[#EF6623] shadow-md' : 'bg-white text-[#6A6A6A] border-[#E5D4C3]'}`}
                  >
                    {type.split(' / ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Banking Details */}
        <section>
          <p className="text-[10px] xl:text-[14px] font-black text-[#EF6623] uppercase tracking-[0.2em] mb-4 xl:mb-8 border-b border-[#E5D4C3]/30 pb-2 xl:pb-4">Banking Details</p>
          <div className="grid md:grid-cols-2 md:gap-x-12">
            <InputField label="Account Number" value={formData.accountNumber} onChange={(val: string) => setFormData({...formData, accountNumber: val})} placeholder="Enter Account Number" mono error={errors.accountNumber} />
            <InputField label="Confirm Account Number" value={formData.confirmAccountNumber} onChange={(val: string) => setFormData({...formData, confirmAccountNumber: val})} placeholder="Re-enter Account Number" mono error={errors.confirmAccountNumber} />
          </div>
          
          <div className="grid md:grid-cols-2 md:gap-x-12 items-end">
            <div className="mb-6 xl:mb-10">
              <label className="text-[9px] xl:text-[12px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 block mb-2 xl:mb-4">Country</label>
              <select 
                value={formData.country} 
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full border-b-2 border-[#E5D4C3] py-2 text-sm xl:text-lg font-bold text-[#C0382B] outline-none bg-transparent"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Singapore">Singapore</option>
                <option value="Germany">Germany</option>
              </select>
            </div>

            {isIndia ? (
              <InputField label="IFSC Code (India)" value={formData.ifsc} onChange={(val: string) => setFormData({...formData, ifsc: val.toUpperCase(), bankName: val.length === 11 ? 'ICICI BANK LTD (Auto-filled)' : formData.bankName})} placeholder="ICIC0001234" mono error={errors.ifsc} />
            ) : (
              <InputField label="SWIFT/BIC Code (Foreign)" value={formData.bic} onChange={(val: string) => setFormData({...formData, bic: val.toUpperCase(), bankName: (val.length === 8 || val.length === 11) ? 'CITIBANK N.A. NYC (Auto-filled)' : formData.bankName})} placeholder="CITIUS33" mono error={errors.bic} />
            )}
          </div>

          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 mb-6 xl:p-6 xl:mb-10">
             <p className="text-[8px] xl:text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 xl:mb-2">Bank Name (Auto-fill)</p>
             <p className="text-[10px] xl:text-[14px] font-black text-blue-900">{formData.bankName || 'Waiting for Code...'}</p>
          </div>
        </section>

        {/* Contact Details */}
        <section>
          <p className="text-[10px] xl:text-[14px] font-black text-[#EF6623] uppercase tracking-[0.2em] mb-4 xl:mb-8 border-b border-[#E5D4C3]/30 pb-2 xl:pb-4">Contact Details</p>
          <div className="grid md:grid-cols-2 md:gap-x-12">
            <InputField label="Beneficiary Email" value={formData.email} onChange={(val: string) => setFormData({...formData, email: val})} placeholder="example@mail.com" optional />
            <InputField label="Beneficiary Mobile" value={formData.mobile} onChange={(val: string) => setFormData({...formData, mobile: val})} placeholder="+91-XXXXX-XXXXX" optional />
          </div>
        </section>

        <button 
          onClick={handleSave}
          className="w-full bg-[#EF6623] text-white font-black py-5 xl:py-7 rounded-[16px] xl:rounded-[20px] uppercase text-sm xl:text-base tracking-[0.2em] shadow-xl hover:bg-[#C0382B] transition-colors active:scale-95 mb-10 xl:mb-20"
        >
          Save Beneficiary
        </button>
      </div>
    </div>
  );
}

// --- Fee & FX Prediction Component ---

const AdvanceFeesFxPredictions = ({ ormType }: { ormType?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const d = ADVANCE_FEES_FX_DATA;

  return (
    <div className="bg-gradient-to-br from-white to-[#FAF9F7] border border-[#E5D4C3] rounded-[16px] shadow-sm mb-6 overflow-hidden xl:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAF9F7] transition-colors xl:px-7 xl:py-5"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg xl:p-3">
            <TrendingUp size={18} className="xl:w-6 xl:h-6" />
          </div>
          <div>
            <span className="text-[11px] xl:text-[14px] font-black text-[#C0382B] uppercase tracking-[0.1em] block">Fee & FX Predictions</span>
            <span className="text-[9px] xl:text-[11px] text-[#6A6A6A] font-medium block">Intelligent cost estimation for your {ormType?.replace('_', ' ')} payment.</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] xl:text-[11px] font-black text-[#EF6623] uppercase tracking-widest">{isOpen ? 'Hide' : 'Calculate'}</span>
          {isOpen ? <ChevronDown size={14} className="rotate-180 text-[#6A6A6A] xl:w-5 xl:h-5" /> : <ChevronDown size={14} className="text-[#6A6A6A] xl:w-5 xl:h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-2 animate-icici border-t border-[#FAF9F7] xl:px-7 xl:pb-7">
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 xl:grid-cols-4 xl:gap-x-10">
            <div>
              <p className="text-[8px] xl:text-[10px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 mb-1">Estimated FX Rate</p>
              <p className="text-[11px] xl:text-[14px] font-black text-[#C0382B]">₹{d.fx_rate_prediction}</p>
            </div>
            <div>
              <p className="text-[8px] xl:text-[10px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 mb-1">FX Spread</p>
              <p className="text-[11px] xl:text-[14px] font-black text-green-600">{d.fx_spread}</p>
            </div>
            <div>
              <p className="text-[8px] xl:text-[10px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 mb-1">Bank Charges</p>
              <p className="text-[11px] xl:text-[14px] font-black text-[#6A6A6A]">{d.bank_charges}</p>
            </div>
            <div>
              <p className="text-[8px] xl:text-[10px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-60 mb-1">GST on Charges</p>
              <p className="text-[11px] xl:text-[14px] font-black text-[#6A6A6A]">{d.gst_on_charges}</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-dashed border-[#E5D4C3] xl:col-span-4 xl:pt-4">
              <div className="flex justify-between items-center bg-orange-50 p-2.5 rounded-xl xl:p-5">
                 <p className="text-[9px] xl:text-[12px] font-black text-[#6A6A6A] uppercase tracking-widest">Total Estimated Debit</p>
                 <p className="text-[12px] xl:text-[18px] font-black text-[#C0382B]">{d.expected_total_debit_inr}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-start gap-2 text-blue-700 xl:mt-6">
             <Info size={12} className="mt-0.5 flex-shrink-0 xl:w-4 xl:h-4" />
             <p className="text-[8px] xl:text-[11px] font-bold leading-relaxed">{d.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Profile Screen Component ---

function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  const p = PROFILE_DATA;
  const lim = PROFILE_LIMITS;
  const bens = DUMMY_BENEFICIARY_DATA.beneficiaries;

  const [activeModal, setActiveModal] = useState<'CONTACT' | 'BENE' | 'LIMITS' | 'SUPPORT' | null>(null);

  const ProfileItem = ({ label, value, icon: Icon, color = "#6A6A6A" }: any) => (
    <div className="flex items-center gap-4 py-4 border-b border-[#FAF9F7] xl:gap-6 xl:py-6">
       <div className="p-2.5 bg-[#FAF9F7] rounded-xl text-[#EF6623] xl:p-4">
          <Icon size={18} className="xl:w-6 xl:h-6" />
       </div>
       <div className="flex-1">
          <p className="text-[9px] xl:text-[11px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-50 mb-0.5 xl:mb-1.5">{label}</p>
          <p className="text-[11px] xl:text-[14px] font-black" style={{ color }}>{value}</p>
       </div>
    </div>
  );

  const Modal = ({ title, children, onClose }: any) => (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
       <div className="bg-white rounded-[32px] w-full max-w-sm xl:max-w-lg shadow-2xl overflow-hidden animate-icici">
          <div className="px-6 py-5 bg-[#EF6623] text-white flex justify-between items-center xl:px-8 xl:py-7">
             <h3 className="font-black uppercase tracking-widest text-sm xl:text-lg">{title}</h3>
             <button onClick={onClose}><X size={20} className="xl:w-6 xl:h-6" /></button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar xl:p-10">
             {children}
          </div>
       </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 xl:p-16 animate-icici pb-32 max-w-5xl mx-auto xl:pt-20">
      {/* Header */}
      <div className="flex items-center gap-6 mb-10 xl:gap-10 xl:mb-16">
         <div className="w-20 h-20 xl:w-32 xl:h-32 rounded-full overflow-hidden shadow-xl ring-4 ring-white xl:ring-8 bg-gradient-to-br from-[#EF6623] to-[#C0382B]">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOTOa45IZFuV7jSKulaweqX_wKfO2GR2HzSVB2ObFlBJGLVEDLkNB2qG18Jx8SatJRxf0TtTXmT5yaDyzTQ3r9i98&s&ec=121528441" alt="Profile" className="w-full h-full object-cover" />
         </div>
         <div>
            <h2 className="text-xl xl:text-3xl font-black text-[#C0382B] uppercase tracking-tight">{p.customer_name}</h2>
            <p className="text-[10px] xl:text-[14px] font-bold text-[#6A6A6A] uppercase tracking-widest opacity-60 mt-1 xl:mt-3">CIF: {p.cif_id} • {p.kyc_status}</p>
            <div className="mt-3 flex items-center gap-2 xl:mt-5 xl:gap-4">
               <span className="bg-green-50 text-green-600 text-[8px] xl:text-[11px] font-black px-2 py-1 xl:px-4 xl:py-2 rounded-full border border-green-100 uppercase tracking-widest">Active</span>
               <span className="text-[8px] xl:text-[11px] text-[#6A6A6A] font-bold uppercase tracking-tight opacity-40">Last Login: {p.last_login}</span>
            </div>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-10 xl:gap-8 xl:mb-16">
         <div className="bg-white border border-[#E5D4C3] rounded-2xl p-5 shadow-sm xl:p-10 xl:rounded-[32px] xl:shadow-md">
            <p className="text-[9px] xl:text-[12px] font-black text-[#6A6A6A] uppercase tracking-[0.1em] opacity-40 mb-2 xl:mb-4">Payments Done</p>
            <p className="text-2xl xl:text-5xl font-black text-[#C0382B]">{p.total_payments_done}</p>
         </div>
         <div className="bg-white border border-[#E5D4C3] rounded-2xl p-5 shadow-sm xl:p-10 xl:rounded-[32px] xl:shadow-md">
            <p className="text-[9px] xl:text-[12px] font-black text-[#6A6A6A] uppercase tracking-[0.1em] opacity-40 mb-2 xl:mb-4">Success Rate</p>
            <p className="text-2xl xl:text-5xl font-black text-green-600">{p.success_rate}</p>
         </div>
      </div>

      {/* Profile Details List */}
      <div className="bg-white border border-[#E5D4C3] rounded-[24px] p-6 shadow-sm mb-8 xl:p-12 xl:rounded-[40px] xl:shadow-md xl:mb-12">
         <p className="text-[10px] xl:text-[14px] font-black text-[#EF6623] uppercase tracking-[0.2em] mb-4 xl:mb-8 border-b border-[#FAF9F7] pb-3 xl:pb-6">Security & Accounts</p>
         <div className="grid xl:grid-cols-2 xl:gap-x-16">
            <ProfileItem label="Default Account" value={p.default_debit_account} icon={CreditCard} />
            <ProfileItem label="Primary Currency" value={p.preferred_currency} icon={Globe} />
            <ProfileItem label="Linked Mobile" value={p.mobile} icon={Smartphone} />
            <ProfileItem label="Linked Email" value={p.email} icon={FileText} />
         </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-3 xl:gap-6">
         <button onClick={() => setActiveModal('CONTACT')} className="w-full flex items-center justify-between p-5 bg-white border border-[#E5D4C3] rounded-2xl shadow-sm xl:p-8 xl:rounded-[24px] active:scale-95 transition-all xl:hover:border-[#EF6623]">
            <div className="flex items-center gap-4 xl:gap-6">
               <Settings className="text-[#6A6A6A] xl:w-7 xl:h-7" size={20} />
               <span className="text-[11px] xl:text-[15px] font-black text-[#C0382B] uppercase tracking-widest">Edit Contact Details</span>
            </div>
            <ChevronRight size={18} className="text-[#B0B0B0] xl:w-6 xl:h-6" />
         </button>

         <button onClick={() => setActiveModal('BENE')} className="w-full flex items-center justify-between p-5 bg-white border border-[#E5D4C3] rounded-2xl shadow-sm xl:p-8 xl:rounded-[24px] active:scale-95 transition-all xl:hover:border-[#EF6623]">
            <div className="flex items-center gap-4 xl:gap-6">
               <UserPlus className="text-[#6A6A6A] xl:w-7 xl:h-7" size={20} />
               <span className="text-[11px] xl:text-[15px] font-black text-[#C0382B] uppercase tracking-widest">Saved Beneficiaries</span>
            </div>
            <ChevronRight size={18} className="text-[#B0B0B0] xl:w-6 xl:h-6" />
         </button>

         <button onClick={() => setActiveModal('LIMITS')} className="w-full flex items-center justify-between p-5 bg-white border border-[#E5D4C3] rounded-2xl shadow-sm xl:p-8 xl:rounded-[24px] active:scale-95 transition-all xl:hover:border-[#EF6623]">
            <div className="flex items-center gap-4 xl:gap-6">
               <Shield className="text-[#6A6A6A] xl:w-7 xl:h-7" size={20} />
               <span className="text-[11px] xl:text-[15px] font-black text-[#C0382B] uppercase tracking-widest">Payment Limits</span>
            </div>
            <ChevronRight size={18} className="text-[#B0B0B0] xl:w-6 xl:h-6" />
         </button>

         <button onClick={() => setActiveModal('SUPPORT')} className="w-full flex items-center justify-between p-5 bg-white border border-[#E5D4C3] rounded-2xl shadow-sm xl:p-8 xl:rounded-[24px] active:scale-95 transition-all xl:hover:border-[#EF6623]">
            <div className="flex items-center gap-4 xl:gap-6">
               <HelpCircle className="text-[#6A6A6A] xl:w-7 xl:h-7" size={20} />
               <span className="text-[11px] xl:text-[15px] font-black text-[#C0382B] uppercase tracking-widest">Help & Support</span>
            </div>
            <ChevronRight size={18} className="text-[#B0B0B0] xl:w-6 xl:h-6" />
         </button>

         <button onClick={onLogout} className="md:col-span-2 w-full flex items-center justify-center p-5 bg-orange-50 border border-orange-100 rounded-2xl xl:p-8 xl:rounded-[24px] active:scale-95 transition-all mt-6 xl:mt-10">
            <LogOut className="text-[#C0382B] mr-3 xl:w-7 xl:h-7" size={20} />
            <span className="text-[11px] xl:text-[15px] font-black text-[#C0382B] uppercase tracking-widest">🔒 Logout</span>
         </button>
      </div>

      {/* Modals */}
      {activeModal === 'CONTACT' && (
         <Modal title="Edit Contact Details" onClose={() => setActiveModal(null)}>
            <div className="space-y-6 xl:space-y-10">
               <div>
                  <label className="text-[9px] xl:text-[12px] font-black text-[#6A6A6A] uppercase tracking-widest block mb-2 xl:mb-4 opacity-50">Mobile Number</label>
                  <input type="text" defaultValue={p.mobile} className="w-full border-b border-[#E5D4C3] py-2 xl:py-4 text-sm xl:text-lg font-black text-[#C0382B] outline-none" />
               </div>
               <div>
                  <label className="text-[9px] xl:text-[12px] font-black text-[#6A6A6A] uppercase tracking-widest block mb-2 xl:mb-4 opacity-50">Email Address</label>
                  <input type="text" defaultValue={p.email} className="w-full border-b border-[#E5D4C3] py-2 xl:py-4 text-sm xl:text-lg font-black text-[#C0382B] outline-none" />
               </div>
               <button onClick={() => setActiveModal(null)} className="w-full bg-[#EF6623] text-white py-4 xl:py-6 rounded-xl xl:rounded-[20px] font-black uppercase tracking-widest text-[10px] xl:text-[13px] shadow-lg">Save Updates</button>
            </div>
         </Modal>
      )}

      {activeModal === 'BENE' && (
         <Modal title="Saved Beneficiaries" onClose={() => setActiveModal(null)}>
            <div className="space-y-4 xl:space-y-6">
               {bens.map(b => (
                  <div key={b.id} className="p-4 xl:p-6 bg-[#FAF9F7] rounded-2xl xl:rounded-[24px] border border-[#E5D4C3]/50">
                     <p className="text-[11px] xl:text-[15px] font-black text-[#C0382B] uppercase">{b.name}</p>
                     <p className="text-[9px] xl:text-[12px] font-bold text-[#6A6A6A] mt-1 opacity-60 uppercase">{b.bank_name} • {b.account_number}</p>
                     <div className="mt-2 flex items-center gap-2 xl:mt-4">
                        <RailBadge rail={b.preferred_mode} />
                        <span className="text-[8px] xl:text-[10px] font-bold text-[#B0B0B0] uppercase">{b.country}</span>
                     </div>
                  </div>
               ))}
               <button onClick={() => setActiveModal(null)} className="w-full py-4 xl:py-6 text-[10px] xl:text-[13px] font-black text-[#EF6623] uppercase tracking-widest">Close List</button>
            </div>
         </Modal>
      )}

      {activeModal === 'LIMITS' && (
         <Modal title="Your Payment Limits" onClose={() => setActiveModal(null)}>
            <div className="space-y-6 xl:space-y-10">
               <div className="p-4 xl:p-8 bg-blue-50 rounded-2xl xl:rounded-[32px] border border-blue-100">
                  <p className="text-[10px] xl:text-[13px] font-black text-blue-900 uppercase tracking-widest mb-1 xl:mb-3">LRS Yearly Limit</p>
                  <p className="text-lg xl:text-3xl font-black text-blue-700">{lim.lrs_limit}</p>
                  <div className="mt-3 xl:mt-6 w-full h-2 xl:h-3 bg-blue-200 rounded-full overflow-hidden">
                     <div className="w-1/4 h-full bg-blue-600"></div>
                  </div>
                  <p className="text-[8px] xl:text-[11px] font-bold text-blue-600 mt-2 xl:mt-4 uppercase tracking-tighter">Remaining: USD 187,500</p>
               </div>
               <div className="space-y-4 xl:space-y-6">
                  <div className="flex justify-between items-center border-b border-[#FAF9F7] pb-3 xl:pb-5">
                     <span className="text-[10px] xl:text-[13px] font-black text-[#6A6A6A] uppercase">Trade Advance</span>
                     <span className="text-[10px] xl:text-[13px] font-black text-[#C0382B]">Corporate Level</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#FAF9F7] pb-3 xl:pb-5">
                     <span className="text-[10px] xl:text-[13px] font-black text-[#6A6A6A] uppercase">Trade Direct</span>
                     <span className="text-[10px] xl:text-[13px] font-black text-[#C0382B]">Corporate Level</span>
                  </div>
               </div>
               <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] text-center opacity-40 uppercase">Limits managed by your Relationship Manager</p>
            </div>
         </Modal>
      )}

      {activeModal === 'SUPPORT' && (
         <Modal title="Help & Support" onClose={() => setActiveModal(null)}>
            <div className="space-y-4 xl:space-y-8">
               <div className="space-y-2 xl:space-y-4">
                  <p className="text-[10px] xl:text-[14px] font-black text-[#C0382B] uppercase">What is UETR?</p>
                  <p className="text-[9px] xl:text-[12px] font-bold text-[#6A6A6A] leading-relaxed">Unique End-to-End Transaction Reference for real-time tracking of SWIFT payments.</p>
               </div>
               <div className="space-y-2 xl:space-y-4">
                  <p className="text-[10px] xl:text-[14px] font-black text-[#C0382B] uppercase">How long does RTGS take?</p>
                  <p className="text-[9px] xl:text-[12px] font-bold text-[#6A6A6A] leading-relaxed">RTGS settlement is near real-time between RBI windows.</p>
               </div>
               <div className="space-y-2 xl:space-y-4">
                  <p className="text-[10px] xl:text-[14px] font-black text-[#C0382B] uppercase">Need urgent assistance?</p>
                  <button className="flex items-center gap-2 text-[#EF6623] font-black text-[10px] xl:text-[13px] uppercase">
                     <Phone size={14} className="xl:w-5 xl:h-5" /> Call RM: 1800 102 3344
                  </button>
               </div>
            </div>
         </Modal>
      )}
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'HOME' | 'HUB' | 'SELECT_CUSTOMER' | 'PAYMENT_FORM' | 'CONFIRMATION' | 'SUCCESS' | 'HISTORY' | 'TRACK' | 'ADD_BENEFICIARY' | 'PROFILE'>('HOME');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [sessionBeneficiaries, setSessionBeneficiaries] = useState<any[]>(DUMMY_BENEFICIARY_DATA.beneficiaries);
  const [toast, setToast] = useState<string | null>(null);
  const [payAgainMode, setPayAgainMode] = useState(false);

  const [paymentData, setPaymentData] = useState<PaymentState>({
    beneficiary: null,
    amount: 0, 
    rail: PaymentRail.ORM,
    purpose: '',
    chargeType: 'SHA',
    advanced: {}
  });
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartHub = () => setCurrentScreen('HUB');

  const handleSelectOrmManual = (type: OrmType) => {
    setPaymentData(prev => ({ ...prev, ormType: type }));
    setCurrentScreen('SELECT_CUSTOMER');
  };

  const handleSelectCustomer = (profile: CustomerProfile) => {
    const lastBen = ORM_BENEFICIARIES.find(b => b.cif_id === profile.cif_id);
    const ormType = paymentData.ormType;
    
    let defaults = {};
    if (ormType === 'LRS') {
      defaults = {
        productCategory: 'LRS - Global Remit',
        purposeDesc: 'S0007 - Education Support',
        sourceOfFunds: 'Savings / Salary'
      };
    } else if (ormType === 'TRADE_DIRECT') {
      defaults = {
        productCategory: 'TRADE - Inward Settlement',
        purposeDesc: 'S0101 - Commercial Import',
        sourceOfFunds: 'Current Account'
      };
    } else {
      defaults = {
        productCategory: 'TRADE - Advance Payment',
        purposeDesc: 'S0102 - Trade Advance',
        sourceOfFunds: 'Corporate Funds'
      };
    }

    setPaymentData({
      ...paymentData,
      cif_id: profile.cif_id,
      customerProfile: profile,
      beneficiary: lastBen || null,
      amount: lastBen?.avg_transfer_amount || 15000,
      advanced: {
        uniqueRefNo: `ORM-MNL-${Date.now().toString().slice(-4)}`,
        isManual: true,
        lastTxnRef: "TRN-99221-X",
        remittanceIn: "USD",
        ...defaults
      }
    });
    setCurrentScreen('PAYMENT_FORM');
  };

  const handleOcrDrop = () => {
    setOcrStatus('scanning');
    setTimeout(() => {
      const cifId = 'CIF1002';
      const profile = CUSTOMER_MASTER.find(c => c.cif_id === cifId);
      const ben = ORM_BENEFICIARIES.find(b => b.cif_id === cifId);

      setPaymentData({
        beneficiary: ben || null,
        amount: 35000, 
        rail: PaymentRail.ORM,
        ormType: 'LRS',
        cif_id: cifId,
        customerProfile: profile,
        purpose: "S0007 - Family Support",
        chargeType: 'SHA',
        advanced: {
          ocrFilled: true,
          uniqueRefNo: `AI-OCR-LRS-${Date.now().toString().slice(-4)}`,
          productCategory: "LRS - AI Discovery Mode",
          panNo: "AAACZ7733K",
          sourceOfFunds: "Investment Gains",
          lrsUtilized: "$25,000 / $250,000",
          purposeDesc: "S0007 - Family Support",
          remittanceIn: "USD"
        }
      });
      setOcrStatus('done');
      setTimeout(() => setCurrentScreen('PAYMENT_FORM'), 800);
    }, 3000);
  };

  const handlePayAgainSelect = (txn: Transaction) => {
    const ormTypeFromRail = txn.rail === PaymentRail.ORM ? (txn.intelligence_tags.includes('trade_settlement') ? 'TRADE_DIRECT' : 'LRS') : 'LRS';
    const finalOrmType = ormTypeFromRail as OrmType;
    const ben = ORM_BENEFICIARIES.find(b => b.beneficiary_id === txn.beneficiary_id) || ORM_BENEFICIARIES[0];
    const profile = CUSTOMER_MASTER.find(c => c.cif_id === ben.cif_id) || CUSTOMER_MASTER[0];

    setPaymentData({
      beneficiary: ben,
      amount: txn.amount,
      rail: txn.rail,
      ormType: finalOrmType,
      purpose: "S0007 - Family Support",
      chargeType: 'SHA',
      cif_id: profile.cif_id,
      customerProfile: profile,
      advanced: {
        uniqueRefNo: `PAY-AGN-${Date.now().toString().slice(-4)}`,
        productCategory: finalOrmType === 'LRS' ? 'LRS - Global Remit' : 'TRADE - Settlement',
        remittanceIn: txn.currency,
        purposeDesc: finalOrmType === 'LRS' ? 'S0007 - Family Maintenance' : 'S0101 - Commercial Import'
      }
    });
    setPayAgainMode(false);
    setCurrentScreen('PAYMENT_FORM');
  };

  const handleSaveBeneficiary = (newBen: any) => {
    setSessionBeneficiaries([...sessionBeneficiaries, { ...newBen, id: `BEN${Date.now().toString().slice(-4)}` }]);
    setToast("Beneficiary added successfully.");
    setCurrentScreen('HOME');
    setTimeout(() => setToast(null), 3000);
  };

  const resetFlow = () => {
    setPayAgainMode(false);
    setCurrentScreen('HOME');
    setPaymentData({ beneficiary: null, amount: 0, rail: PaymentRail.ORM, purpose: '', chargeType: 'SHA', advanced: {} });
    setOcrStatus('idle');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    resetFlow();
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen onStart={handleStartHub} onTrack={(id) => { setSelectedTrackId(id); setCurrentScreen('TRACK'); }} onSelectORM={handleSelectOrmManual} onAction={(action) => {
          if (action === 'Make a Payment') setCurrentScreen('HUB');
          if (action === 'Pay Again') { setPayAgainMode(true); setCurrentScreen('HISTORY'); }
          if (action === 'Track Payment') setCurrentScreen('TRACK');
          if (action === 'Add Beneficiary') setCurrentScreen('ADD_BENEFICIARY');
        }} />;
      case 'HUB':
        return <HubScreen onBack={() => setCurrentScreen('HOME')} onSelectManual={handleSelectOrmManual} onTriggerOcr={() => fileInputRef.current?.click()} ocrStatus={ocrStatus} fileInputRef={fileInputRef} handleOcrDrop={handleOcrDrop} />;
      case 'SELECT_CUSTOMER':
        return <SelectCustomerScreen onBack={() => setCurrentScreen('HUB')} onSelect={handleSelectCustomer} />;
      case 'PAYMENT_FORM':
        return <PaymentFormScreen data={paymentData} setData={setPaymentData} onNext={() => setCurrentScreen('CONFIRMATION')} onBack={() => { setPayAgainMode(false); setCurrentScreen('HUB'); }} />;
      case 'CONFIRMATION':
        return <ConfirmationScreen data={paymentData} onBack={() => setCurrentScreen('PAYMENT_FORM')} onSuccess={() => setCurrentScreen('SUCCESS')} />;
      case 'SUCCESS':
        return <SuccessScreen onDone={resetFlow} onTrack={() => { setSelectedTrackId("TXN9001"); setCurrentScreen('TRACK'); }} data={paymentData} />;
      case 'HISTORY':
        return <HistoryScreen onBack={() => { setPayAgainMode(false); setCurrentScreen('HOME'); }} isPayAgain={payAgainMode} onSelectTransaction={handlePayAgainSelect} />;
      case 'TRACK':
        return <TrackScreen selectedId={selectedTrackId} onBack={() => setCurrentScreen('HOME')} onSelect={setSelectedTrackId} data={paymentData} />;
      case 'ADD_BENEFICIARY':
        return <AddBeneficiaryScreen onBack={() => setCurrentScreen('HOME')} onSave={handleSaveBeneficiary} />;
      case 'PROFILE':
        return <ProfileScreen onLogout={handleLogout} />;
      default:
        return <HomeScreen onStart={handleStartHub} onTrack={(id) => { setSelectedTrackId(id); setCurrentScreen('TRACK'); }} onSelectORM={handleSelectOrmManual} onAction={() => {}} />;
    }
  };

  return (
    <div className="xl:max-w-[1440px] xl:mx-auto xl:px-6 xl:pt-8 xl:pb-10 min-h-screen bg-[#FAF9F7] relative overflow-hidden shadow-2xl flex flex-col text-[#6A6A6A]">
      {/* ICICI Styled Header Bar */}
      <div className="flex justify-between items-center px-6 py-3.5 text-[13px] font-black text-white bg-[#EF6623] shadow-lg z-[60] xl:px-10 xl:py-5 xl:rounded-t-[32px]">
        <div className="flex items-center gap-3 xl:gap-5">
          <div className="bg-white px-2 py-1 xl:px-4 xl:py-2 rounded shadow-sm flex items-center justify-center min-w-[60px] xl:min-w-[100px] min-h-[24px]">
             <img 
               src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/ICICI_Bank_Logo.svg/256px-ICICI_Bank_Logo.svg.png" 
               alt="ICICI BANK" 
               className="h-4 xl:h-7 w-auto object-contain"
               onError={(e) => {
                 (e.currentTarget as HTMLImageElement).style.display = 'none';
                 const textNode = document.createElement('span');
                 textNode.innerText = 'ICICI BANK';
                 textNode.className = 'text-[#EF6623] font-black text-[10px] xl:text-[14px] whitespace-nowrap';
                 e.currentTarget.parentElement?.appendChild(textNode);
               }}
             />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] md:text-[16px] xl:text-[22px] leading-none tracking-tight uppercase">ICICI Bank</span>
            <span className="text-[9px] md:text-[10px] xl:text-[12px] font-medium opacity-80 uppercase tracking-widest mt-0.5 xl:mt-1">Payments Hub</span>
          </div>
        </div>
        <div className="flex items-center gap-4 xl:gap-8">
          <button className="relative active:scale-90 transition-transform">
            <Bell size={18} className="md:w-5 md:h-5 xl:w-7 xl:h-7" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-white xl:w-3 xl:h-3"></span>
          </button>
          <div onClick={() => setCurrentScreen('PROFILE')} className="w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30 active:scale-90 transition-transform cursor-pointer hover:bg-white/30 transition-colors">
            <User size={18} className="md:w-5 md:h-5 xl:w-7 xl:h-7" />
          </div>
        </div>
      </div>

      {toast && (
        <div className="absolute top-20 xl:top-32 left-1/2 -translate-x-1/2 z-[100] w-[80%] max-w-sm xl:max-w-md animate-icici">
          <div className="bg-green-600 text-white py-3 px-5 xl:py-5 xl:px-8 rounded-2xl xl:rounded-[24px] shadow-2xl flex items-center justify-between border border-white/20">
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="xl:w-6 xl:h-6" />
              <span className="text-[11px] xl:text-[14px] font-black uppercase tracking-widest">{toast}</span>
            </div>
            <button onClick={() => setToast(null)}><X size={14} className="xl:w-5 xl:h-5" /></button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 xl:pb-32">
        <div className="mx-auto w-full xl:pt-8">
          {renderScreen()}
        </div>
      </div>

      {/* Persistent Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full xl:max-w-[1440px] bg-white border-t border-[#E5D4C3] flex justify-around py-3 xl:py-5 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] xl:rounded-b-[32px]">
        {[
          { id: 'REMIT', label: 'Remit', icon: Building2, screens: ['HOME', 'HUB', 'SELECT_CUSTOMER', 'PAYMENT_FORM', 'CONFIRMATION', 'ADD_BENEFICIARY'], target: 'HOME' },
          { id: 'TRACK', label: 'Track', icon: MapPin, screens: ['TRACK'], target: 'TRACK' },
          { id: 'ACTIVITY', label: 'Activity', icon: FileText, screens: ['HISTORY'], target: 'HISTORY' },
          { id: 'PROFILE', label: 'Profile', icon: User, screens: ['PROFILE'], target: 'PROFILE' }
        ].map(tab => {
          const isActive = tab.screens.includes(currentScreen);
          return (
            <button 
              key={tab.id}
              className={`flex flex-col items-center gap-1 xl:gap-2 transition-all px-6 py-1 xl:px-12 xl:py-2 rounded-xl xl:rounded-2xl ${isActive ? 'text-[#EF6623] bg-orange-50 xl:bg-orange-100/50 scale-105' : 'text-[#B0B0B0] hover:text-[#EF6623]'}`} 
              onClick={() => {
                setPayAgainMode(false);
                if (tab.target === 'TRACK') setSelectedTrackId(null);
                setCurrentScreen(tab.target as any);
              }}
            >
              <tab.icon size={22} strokeWidth={isActive ? 3 : 2.5} className="xl:w-8 xl:h-8" />
              <span className="text-[10px] xl:text-[13px] font-bold uppercase tracking-tighter xl:tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// --- Specific Screens ---

function HomeScreen({ onStart, onTrack, onSelectORM, onAction }: { onStart: () => void, onTrack: (id: string) => void, onSelectORM: (type: OrmType) => void, onAction: (a: string) => void }) {
  const d = DASHBOARD_DATA.dashboard;
  const ins = DASHBOARD_INSIGHTS;

  return (
    <div className="animate-icici space-y-6 lg:space-y-10 xl:space-y-16 px-6 py-6 md:px-10 lg:px-20 max-w-[1440px] mx-auto xl:pt-10">
      
      {/* Insight Cards */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 xl:gap-8">
          {[
            { label: 'FX Savings', value: `₹${ins.fx_savings_inr.toLocaleString()}`, sub: `Saved ${ins.fx_savings_percent} vs market rate`, icon: Coins, color: 'text-green-600', bg: 'bg-green-50', border: 'border-l-green-600' },
            { label: 'Success Rate', value: ins.success_rate, sub: 'No failures in last 10 payments', icon: ShieldHalf, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-600' },
            { label: 'Avg. Delivery', value: ins.average_delivery_time, sub: 'Based on last 5 transfers', icon: Timer, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-l-[#EF6623]' }
          ].map((item, idx) => (
            <div key={idx} className={`flex-shrink-0 w-[240px] md:w-auto bg-white border border-[#E5D4C3] rounded-2xl p-5 xl:p-8 xl:rounded-[24px] shadow-sm xl:shadow-md border-l-4 ${item.border}`}>
               <div className="flex items-center gap-3 mb-3 xl:mb-5">
                  <div className={`p-2 ${item.bg} ${item.color} rounded-lg xl:p-4 xl:rounded-xl`}>
                     <item.icon size={18} className="xl:w-7 xl:h-7" />
                  </div>
                  <span className="text-[10px] xl:text-[14px] font-black text-[#6A6A6A] uppercase tracking-widest">{item.label}</span>
               </div>
               <p className="text-xl xl:text-4xl font-black text-[#C0382B]">{item.value}</p>
               <p className={`text-[9px] xl:text-[12px] font-bold ${item.color} uppercase mt-1 xl:mt-3`}>{item.sub}</p>
            </div>
          ))}
      </div>

      {/* Quick Action Tiles */}
      <div>
        <p className="text-[9px] xl:text-[13px] font-black text-[#C0382B] uppercase tracking-[0.2em] mb-4 xl:mb-8 opacity-60">Quick Access</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-8">
          {d.quick_actions.map((action) => {
            let Icon = CreditCard;
            if (action === "Pay Again") Icon = RefreshCw;
            if (action === "Track Payment") Icon = MapPin;
            if (action === "Add Beneficiary") Icon = UserPlus;

            return (
              <button 
                key={action}
                onClick={() => onAction(action)}
                className="bg-white border border-[#E5D4C3] rounded-2xl p-5 lg:p-8 xl:p-12 xl:rounded-[32px] flex flex-col items-center gap-3 xl:gap-6 shadow-sm xl:shadow-md active:bg-orange-50 active:border-[#EF6623] transition-all group hover:border-[#EF6623] hover:shadow-lg"
              >
                <div className="p-3 xl:p-6 bg-orange-50 text-[#EF6623] rounded-full group-active:bg-[#EF6623] group-active:text-white transition-colors">
                  <Icon size={24} strokeWidth={2.5} className="xl:w-10 xl:h-10" />
                </div>
                <span className="text-[10px] xl:text-[14px] font-black text-[#6A6A6A] uppercase tracking-widest text-center">{action}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ORM Payment Types Row */}
      <div className="xl:pt-4">
        <p className="text-[9px] xl:text-[13px] font-black text-[#C0382B] uppercase tracking-[0.2em] mb-3 xl:mb-8 opacity-60">Payment Modes</p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 md:flex-row md:justify-center md:gap-6 xl:gap-10">
          {[
            { id: 'LRS', label: 'LRS' },
            { id: 'TRADE_ADVANCE', label: 'Trade Advance' },
            { id: 'TRADE_DIRECT', label: 'Trade Direct' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => onSelectORM(type.id as OrmType)}
              className="flex-shrink-0 md:flex-1 bg-white border border-[#E5D4C3] rounded-xl px-6 py-3 md:py-4 xl:py-7 xl:rounded-[20px] xl:text-[15px] font-black text-[#EF6623] uppercase tracking-widest shadow-sm hover:border-[#EF6623] xl:hover:bg-orange-50/20 active:scale-95 transition-all max-w-xs xl:max-w-md xl:shadow-md"
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid for Tracking and Exceptions on Desktop */}
      <div className="grid xl:grid-cols-2 gap-8 xl:gap-12">
        {/* Track Payments Summary Widget */}
        <div className="bg-white border border-[#E5D4C3] rounded-2xl p-5 md:p-8 xl:p-12 xl:rounded-[32px] shadow-sm xl:shadow-md border-l-4 border-l-[#EF6623] flex justify-between items-center hover:shadow-lg transition-all group cursor-pointer" onClick={() => onAction('Track Payment')}>
          <div>
            <p className="text-[9px] xl:text-[14px] font-black text-[#C0382B] uppercase tracking-[0.1em] mb-1 xl:mb-3">Live Status Tracking</p>
            <div className="space-y-0.5 xl:space-y-2">
              <p className="text-[10px] xl:text-[13px] font-bold text-[#6A6A6A] uppercase">• 1 payment in-progress</p>
              <p className="text-[10px] xl:text-[13px] font-bold text-[#6A6A6A] uppercase">• 2 recently completed</p>
            </div>
          </div>
          <button className="bg-[#EF6623] text-white p-3 xl:p-5 rounded-lg xl:rounded-xl shadow-md active:scale-90 group-hover:scale-110 transition-all">
            <ArrowRight size={20} className="xl:w-8 xl:h-8" />
          </button>
        </div>

        {/* Exception Insights */}
        <div className="h-full">
          <ExceptionHandlingModule minimal={true} />
        </div>
      </div>

      {/* Currency Trends Widget */}
      <CurrencyTrendsWidget />

      {/* Recent Activity */}
      <div>
        <p className="text-[9px] xl:text-[13px] font-black text-[#C0382B] uppercase tracking-[0.2em] mb-4 xl:mb-8 opacity-60">Recent Activity</p>
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 xl:grid-cols-2 xl:gap-8 md:space-y-0">
          {d.recent_payments.map((p, i) => (
            <div key={i} className="bg-white border border-[#E5D4C3] rounded-2xl p-4 md:p-6 xl:p-10 xl:rounded-[32px] flex justify-between items-center shadow-sm xl:shadow-md hover:border-[#EF6623] transition-all">
              <div className="flex flex-col gap-1 xl:gap-3">
                <p className="text-[11px] xl:text-[16px] font-black text-[#C0382B] uppercase">{p.beneficiary}</p>
                <div className="flex items-center gap-2 xl:gap-4">
                  <RailBadge rail={p.orm_type} />
                  <span className={`text-[8px] xl:text-[11px] font-black uppercase tracking-widest ${p.status === 'Completed' ? 'text-green-600' : 'text-orange-600'}`}>{p.status}</span>
                </div>
              </div>
              <p className="text-[12px] xl:text-[20px] font-black text-[#EF6623]">{p.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Suggestions Panel */}
      <div className="max-w-[1440px]">
        <div className="bg-[#FAF9F7] border border-[#E5D4C3]/50 rounded-2xl p-5 md:p-8 xl:p-16 xl:rounded-[40px] space-y-4 xl:space-y-10">
          <p className="text-[9px] xl:text-[13px] font-black text-[#6A6A6A] uppercase tracking-[0.2em] opacity-40">AI-Smart Suggestions</p>
          <div className="grid md:grid-cols-3 gap-4 xl:gap-12">
            {d.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 md:bg-white md:p-4 md:rounded-xl xl:p-8 xl:rounded-[24px] md:shadow-sm xl:shadow-md hover:shadow-xl transition-all">
                <Zap size={14} className="text-[#EF6623] mt-0.5 xl:w-6 xl:h-6 xl:mt-1.5" />
                <p className="text-[10px] xl:text-[14px] font-bold text-[#6A6A6A] leading-relaxed uppercase">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function HubScreen({ onBack, onSelectManual, onTriggerOcr, ocrStatus, fileInputRef, handleOcrDrop }: any) {
  return (
    <div className="p-6 md:p-10 lg:p-20 xl:p-24 max-w-6xl mx-auto animate-icici">
      <div className="flex items-center gap-4 mb-8 xl:mb-16">
        <button onClick={onBack} className="p-1"><ArrowRight className="rotate-180 text-[#EF6623] xl:w-8 xl:h-8" /></button>
        <h2 className="text-[20px] xl:text-[32px] font-black text-[#C0382B] uppercase tracking-tight">Remit Hub</h2>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleOcrDrop} accept=".pdf,.jpg,.jpeg,.png" />

      {/* OCR Option */}
      <div className={`relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 rounded-[28px] p-9 md:p-12 xl:p-24 xl:rounded-[48px] text-white shadow-2xl overflow-hidden cursor-pointer transition-all active:scale-[0.97] mb-10 xl:mb-20 group ${ocrStatus === 'scanning' ? 'animate-pulse' : ''}`} onClick={onTriggerOcr}>
        {ocrStatus === 'scanning' && <div className="absolute top-0 left-0 w-full h-[5px] xl:h-[8px] bg-blue-400 animate-icici-scan"></div>}
        <div className="flex justify-between items-start mb-8 xl:mb-16">
          <div className="p-4 xl:p-8 bg-white/15 rounded-[18px] xl:rounded-[32px] backdrop-blur-md group-hover:rotate-12 transition-transform"><BrainCircuit size={32} className="xl:w-20 xl:h-20" /></div>
          <Sparkles size={24} className="text-blue-300 animate-pulse xl:w-10 xl:h-10" />
        </div>
        <h3 className="text-xl md:text-2xl xl:text-5xl font-black mb-2 xl:mb-6 uppercase tracking-tight">OCR Using AI</h3>
        <p className="text-[11px] md:text-sm xl:text-2xl opacity-80 leading-relaxed font-bold uppercase tracking-wider">Automated extraction from Invoice or LRS Form.</p>
        <div className="mt-8 xl:mt-16 flex items-center gap-2 xl:gap-5 text-[10px] xl:text-lg font-black uppercase tracking-widest bg-white/20 py-3 px-6 xl:py-6 xl:px-12 rounded-full backdrop-blur-md w-fit shadow-inner group-hover:bg-white/30 transition-colors">
          {ocrStatus === 'scanning' ? <><Loader2 size={16} className="animate-spin xl:w-8 xl:h-8" /> Extracting...</> : <><UploadCloud size={18} className="xl:w-8 xl:h-8" /> Start Extract</>}
        </div>
      </div>

      <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 xl:gap-8 md:space-y-0">
        <div className="col-span-3 flex items-center gap-4 mb-3 xl:mb-8">
          <div className="h-px flex-1 bg-[#E5D4C3]"></div>
          <span className="text-[9px] xl:text-[14px] font-black text-[#6A6A6A] opacity-50 uppercase tracking-[0.3em]">Manual Entry</span>
          <div className="h-px flex-1 bg-[#E5D4C3]"></div>
        </div>
        {[
          { id: 'LRS', label: 'LRS', desc: 'Personal, Maintenance, Gift', icon: User },
          { id: 'TRADE_DIRECT', label: 'Trade Direct', desc: 'Commercial Import (DIR)', icon: Package },
          { id: 'TRADE_ADVANCE', label: 'Trade Advance', desc: 'Import Advance (ADV)', icon: Truck }
        ].map(t => (
          <button key={t.id} onClick={() => onSelectManual(t.id as OrmType)} className="w-full bg-white border border-[#E5D4C3] rounded-[20px] xl:rounded-[32px] p-5 xl:p-10 text-left flex flex-col md:items-center md:text-center items-start gap-4 xl:gap-8 shadow-sm hover:border-[#EF6623] xl:shadow-md xl:hover:shadow-xl active:scale-[0.98] transition-all group">
            <div className="w-12 h-12 xl:w-20 xl:h-20 bg-[#FAF9F7] rounded-[12px] xl:rounded-[24px] flex items-center justify-center text-[#EF6623] border border-[#E5D4C3] group-hover:bg-[#EF6623] group-hover:text-white transition-colors"><t.icon size={24} className="xl:w-10 xl:h-10" /></div>
            <div><p className="font-black text-[#C0382B] text-sm xl:text-xl uppercase">{t.label}</p><p className="text-[10px] xl:text-[14px] text-[#6A6A6A] mt-1 xl:mt-3 opacity-70 leading-tight">{t.desc}</p></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectCustomerScreen({ onBack, onSelect }: any) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [cifInput, setCifInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFetch = () => {
    const rawMatch = NEW_CUSTOMER_LOOKUP[cifInput];
    if (rawMatch) {
      const profile: CustomerProfile = {
        cif_id: cifInput,
        customer_name: rawMatch.customer_name,
        primary_account_number: rawMatch.account_number,
        available_balance: 5000000,
        debit_account_number: rawMatch.account_number,
        debit_account_balance: 5000000,
        remitter_name: rawMatch.customer_name,
        contact_number: rawMatch.contact,
        email: rawMatch.email,
        contact_person: "Authorized Signatory",
        priority_processing: "Standard",
        address: rawMatch.address,
        pan_no: rawMatch.pan,
        ie_ref_no: `IEC-${cifInput.slice(-4)}`,
        deferral_status: "None",
        deferral_reason: "",
        deferral_due_date: ""
      };
      setIsPopupOpen(false);
      setCifInput('');
      setErrorMsg('');
      onSelect(profile);
    } else {
      setErrorMsg("Customer not found. Please re-check the ID.");
    }
  };

  return (
    <div className="p-6 md:p-10 xl:p-20 max-w-6xl mx-auto animate-icici relative">
      {isPopupOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[24px] p-8 w-full max-w-[320px] xl:max-w-lg shadow-2xl animate-icici xl:p-16">
            <div className="flex items-center gap-3 xl:gap-6 mb-6 xl:mb-12">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg xl:p-5">
                  <UserPlus size={20} className="xl:w-8 xl:h-8" />
               </div>
               <h3 className="font-black text-[#C0382B] uppercase text-sm xl:text-xl">Add Customer</h3>
            </div>
            
            <div className="space-y-4 xl:space-y-8">
              <div>
                <label className="text-[9px] xl:text-[13px] font-black text-[#6A6A6A] uppercase tracking-widest block mb-2 xl:mb-5 opacity-60">Enter Customer ID / CIF ID</label>
                <input 
                  type="text" 
                  value={cifInput}
                  onChange={(e) => setCifInput(e.target.value.toUpperCase())}
                  className="w-full border-b-2 border-[#E5D4C3] py-2 text-sm xl:text-xl font-bold text-[#C0382B] outline-none focus:border-[#EF6623] transition-colors"
                  placeholder="e.g. CIF90801"
                />
                {errorMsg && <p className="text-[9px] xl:text-[13px] text-red-500 font-bold mt-2 xl:mt-4 uppercase">{errorMsg}</p>}
              </div>

              <div className="flex flex-col gap-3 xl:gap-5 pt-4 xl:pt-8">
                <button 
                  onClick={handleFetch}
                  className="w-full bg-[#EF6623] text-white py-3 xl:py-5 rounded-xl xl:rounded-2xl font-black uppercase text-[10px] xl:text-[14px] tracking-widest shadow-lg active:scale-95 transition-transform"
                >
                  Fetch Customer
                </button>
                <button 
                  onClick={() => { setIsPopupOpen(false); setErrorMsg(''); setCifInput(''); }}
                  className="w-full bg-[#FAF9F7] text-[#6A6A6A] py-3 xl:py-5 rounded-xl xl:rounded-2xl font-black uppercase text-[10px] xl:text-[14px] tracking-widest active:scale-95 transition-transform"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8 xl:mb-16">
        <button onClick={onBack} className="p-1"><ArrowRight className="rotate-180 text-[#EF6623] xl:w-8 xl:h-8" /></button>
        <h2 className="text-[20px] xl:text-[32px] font-black text-[#C0382B] uppercase tracking-tight">Entity Profile</h2>
      </div>

      <p className="text-[9px] xl:text-[14px] font-black text-[#6A6A6A] uppercase tracking-[0.2em] mb-4 xl:mb-8 opacity-60">Entity Selection</p>
      
      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 xl:gap-8 md:space-y-0">
        {CUSTOMER_MASTER.map(c => (
          <div key={c.cif_id} onClick={() => onSelect(c)} className="bg-white border border-[#E5D4C3] rounded-[20px] xl:rounded-[32px] p-6 xl:p-12 shadow-sm xl:shadow-md active:scale-98 cursor-pointer hover:border-[#EF6623] transition-colors group h-fit xl:hover:shadow-xl">
            <div className="flex justify-between items-start">
               <div>
                 <p className="font-black text-[#C0382B] text-sm xl:text-2xl uppercase group-hover:text-[#EF6623] transition-colors">{c.customer_name}</p>
                 <p className="text-[10px] xl:text-[15px] text-[#6A6A6A] font-bold mt-1 xl:mt-4 opacity-70">CIF: {c.cif_id} • {c.primary_account_number}</p>
               </div>
               <ChevronRight size={16} className="text-[#EF6623] mt-1 xl:w-8 xl:h-8" />
            </div>
          </div>
        ))}

        <div className="md:col-span-2 pt-4 xl:pt-8">
          <button 
            onClick={() => setIsPopupOpen(true)}
            className="w-full bg-white border-2 border-dashed border-[#E5D4C3] rounded-[20px] xl:rounded-[32px] p-6 xl:p-16 text-center flex flex-col items-center gap-3 xl:gap-6 active:scale-98 hover:border-[#EF6623] hover:bg-orange-50/30 transition-all group"
          >
            <div className="p-3 xl:p-6 bg-[#FAF9F7] text-[#C0382B] rounded-full group-hover:bg-[#EF6623] group-hover:text-white transition-colors">
              <Plus size={24} className="xl:w-10 xl:h-10" />
            </div>
            <div>
              <p className="font-black text-[#C0382B] text-[11px] xl:text-[18px] uppercase tracking-widest">Add New Entity</p>
              <p className="text-[9px] xl:text-[13px] text-[#6A6A6A] font-bold opacity-60 uppercase mt-1 xl:mt-3">(Enter Customer ID / CIF ID)</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentFormScreen({ data, setData, onNext, onBack }: { data: PaymentState, setData: (d: any) => void, onNext: () => void, onBack: () => void }) {
  const isLrs = data.ormType === 'LRS';
  const isTradeDirect = data.ormType === 'TRADE_DIRECT';
  const isTradeAdvance = data.ormType === 'TRADE_ADVANCE';
  const ocr = data.advanced?.ocrFilled || false;
  const adv = data.advanced || {};
  const TT_RATE = 83.20;

  const renderLRSSections = () => (
    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-x-6 md:space-y-0 animate-icici pb-10 xl:pb-20">
      <div className="md:col-span-2">
        <GpiComplianceSection rail={PaymentRail.ORM} beneficiary={data.beneficiary} gpiDetails={data.gpiDetails} setGpiDetails={(g) => setData({...data, gpiDetails: g})} />
      </div>
      
      <div className="space-y-4 xl:space-y-8">
        <OrmSection title="Transaction Basics" icon={FileText} defaultExpanded={true}
          visibleContent={<>
            <OrmField label="Unique Ref No." value={adv.uniqueRefNo} mono highlight ocrFilled={ocr} />
            <OrmField label="Product Category" value={adv.productCategory} highlight ocrFilled={ocr} />
            <OrmField label="Event Type" value="OUTWARD" highlight />
            <OrmField label="Transaction Reference No." value="TRN-LRS-2026-X99" mono fullWidth highlight />
          </>}
          hiddenContent={<>
            <OrmField label="Channel" value="CIB PORTAL" />
            <OrmField label="Portal Reference No." value={adv.portalRef || "PN99122"} />
            <OrmField label="Instructed Amount" value={`USD ${data.amount.toLocaleString()}`} />
            <OrmField label="LRS Utilized Limit" value={adv.lrsUtilized || "$10,000 / $250,000"} fullWidth />
          </>}
        />

        <OrmSection title="Remitter / Applicant" icon={User}
          visibleContent={<>
            <OrmField label="Customer ID/CIF" value={data.cif_id} highlight />
            <OrmField label="Remitter Name" value={data.customerProfile?.customer_name} highlight />
            <OrmField label="PAN No." value={adv.panNo || data.customerProfile?.pan_no} mono highlight />
            <OrmField label="Account No. & Available Balance" value={`${data.customerProfile?.primary_account_number} (₹2.25 Cr)`} fullWidth highlight />
            <OrmField label="Source of Funds" value={adv.sourceOfFunds} fullWidth highlight />
          </>}
          hiddenContent={<>
            <OrmField label="Contact Number" value={data.customerProfile?.contact_number} />
            <OrmField label="Email" value={data.customerProfile?.email} />
            <OrmField label="Contact Person" value={data.customerProfile?.contact_person} />
            <OrmField label="Address" value={data.customerProfile?.address} fullWidth />
            <PriorityProcessing label="Priority Processing" value="YES" />
          </>}
        />
      </div>

      <div className="space-y-4 mt-4 md:mt-0 xl:space-y-8">
        <OrmSection title="Beneficiary" icon={Building2}
          visibleContent={<>
            <OrmField label="Beneficiary Name" value={adv.beneficiaryName || data.beneficiary?.name} highlight />
            <OrmField label="Beneficiary Account" value={adv.beneficiaryAccount || data.beneficiary?.account_number} mono highlight />
            <OrmField label="Address (ST/CT/PC)" value={`${data.beneficiary?.address || 'USA'}`} fullWidth highlight />
            <OrmField label="BIC/SWIFT Code" value={adv.bicCode || data.beneficiary?.ifsc_or_bic} mono fullWidth highlight />
          </>}
          hiddenContent={<>
            <OrmField label="Email" value={data.beneficiary?.email || "finance@nova.com"} />
            <OrmField label="Mobile No." value={data.beneficiary?.mobile || "+1-202-001"} />
            <LeiNo label="LEI No. (App/Ben)" value="335800B7 / 529900T8" fullWidth />
            <LeiExpiryDate label="LEI Expiry Date" value="2026-12-31" />
          </>}
        />

        <OrmSection title="FX & Charges" icon={Zap}
          visibleContent={<>
            <OrmField label="TT Selling Rate" value={TT_RATE.toFixed(2)} highlight />
            <OrmField label="Equivalent CCY/Amount" value={`USD ${data.amount.toLocaleString()}`} highlight />
            <OrmField label="Details of Charges" value={data.chargeType} fullWidth highlight />
          </>}
          hiddenContent={<>
            <OrmField label="Deal Details" value="SPOT / UTIL-X99" />
            <OrmField label="Deal Booking Amount" value="USD 50,000" />
            <OrmField label="Margin / Rate Type" value="0.05% / Market" />
          </>}
        />
      </div>

      <div className="md:col-span-2 md:grid md:grid-cols-3 md:gap-4 mt-4 md:mt-0 xl:gap-8">
        <OrmSection title="Routing" icon={Navigation}
          visibleContent={<>
            <OrmField label="Account With Institution (BIC/Bank/Add/CT)" value="CITIUS33 / Citibank / NYC" fullWidth highlight />
            <OrmField label="Intermediary (if any)" value="CHASUS33" fullWidth highlight />
          </>}
          hiddenContent={<>
            <OrmField label="Branch Sol ID" value="SOL1022" />
            <OrmField label="ORM Sub-Type" value="ORM01" />
            <OrmField label="Remittance Mode" value="TT / SWIFT" />
          </>}
        />

        <OrmSection title="Compliance & Documents" icon={ShieldAlert}
          visibleContent={<>
            <OrmField label="Form 15CA/CB (Applicable/Number)" value="YES / 15CA-2026-X771" fullWidth highlight />
          </> }
          hiddenContent={<>
            <OrmField label="Specific Documents & Expiry" value="Passport, Form A2" />
            <OrmField label="IE Ref No." value={data.customerProfile?.ie_ref_no} />
            <OrmField label="Deferral (Status/Reason/Due)" value="NONE / N/A" />
            <OrmField label="HS Code" value="N/A" />
            <OrmField label="Type of Goods/Import" value="N/A" />
          </>}
        />

        <OrmSection title="Instructions" icon={ListChecks}
          visibleContent={<>
            <OrmField label="Instruction Type/Code" value="STD-LRS-01" highlight />
            <OrmField label="Remarks" value="Family Maintenance" fullWidth highlight />
          </>}
          hiddenContent={<>
            <OrmField label="Transaction Info" value="Proceed with priority" fullWidth />
            <OrmField label="Original Docs Received" value="YES" />
          </>}
        />
      </div>
    </div>
  );

  const renderTradeDirectSections = () => (
    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-x-6 md:space-y-0 animate-icici pb-10 xl:pb-20">
      <div className="md:col-span-2">
        <GpiComplianceSection rail={PaymentRail.ORM} beneficiary={data.beneficiary} gpiDetails={data.gpiDetails} setGpiDetails={(g) => setData({...data, gpiDetails: g})} />
      </div>
      
      <div className="space-y-4 xl:space-y-8">
        <OrmSection title="Basic Details" icon={Lock} defaultExpanded={true}
          visibleContent={<>
            <OrmField label="Unique Ref No." value={adv.uniqueRefNo} mono highlight />
            <OrmField label="Product Category" value={adv.productCategory} highlight />
            <OrmField label="Event Type" value="OUTWARD" highlight />
            <OrmField label="Transaction Reference Number / Trade Core Reference No." value={adv.tradeCoreRef || "TCR-8822"} mono fullWidth highlight />
          </>}
          hiddenContent={<>
            <OrmField label="TF Location Sol ID" value="SOL1022" />
            <OrmField label="CTPC Sol ID" value="CPC99" />
            <OrmField label="Branch Sol ID" value="BR1010" />
            <OrmField label="Channel" value="CIB PORTAL" />
            <OrmField label="Portal Reference No." value="PN-DIR-8812" />
          </>}
        />

        <OrmSection title="Customer Name & Account Information" icon={User}
          visibleContent={<>
            <OrmField label="Customer ID / CIF ID" value={data.cif_id} highlight />
            <OrmField label="Account Number" value={data.customerProfile?.primary_account_number} mono highlight />
            <OrmField label="Remitter Name" value={data.customerProfile?.customer_name} highlight />
            <OrmField label="Debit Account No." value={data.customerProfile?.debit_account_number} mono highlight />
          </>}
          hiddenContent={<>
            <NewCustomer label="New Customer" value="NO" />
            <ReferScreenshot label="Refer attached screenshot" value="VERIFIED_001.JPG" />
          </>}
        />
      </div>

      <div className="space-y-4 mt-4 md:mt-0 xl:space-y-8">
        <OrmSection title="Contact Information" icon={Phone}
          visibleContent={<>
            <OrmField label="Contact Number" value={data.customerProfile?.contact_number} highlight />
            <OrmField label="E-mail" value={data.customerProfile?.email} highlight />
            <OrmField label="Contact Person" value={data.customerProfile?.contact_person} highlight />
          </>}
          hiddenContent={<>
            <PriorityProcessing label="Priority Processing" value="STANDARD" />
            <OrmField label="Address" value={data.customerProfile?.address} fullWidth />
            <NuovaPartyInfo label="PAN No." value={data.customerProfile?.pan_no} />
            <NuovaPartyInfo label="IE Ref No." value={data.customerProfile?.ie_ref_no} />
          </>}
        />

        <OrmSection title="Deferral Section" icon={AlertTriangle}
          visibleContent={<>
            <OrmField label="Deferral Status" value="NONE" highlight />
            <OrmField label="Deferral Reason" value="N/A" highlight />
          </>}
          hiddenContent={<>
            <DeferralDueDate label="Deferral Due Date" value="N/A" />
            <SpecificDocuments label="Specific Documents" value="N/A" />
            <ExpiryDate label="Expiry Date" value="N/A" />
            <ReferScreenshot label="Refer screenshot" value="N/A" />
          </>}
        />
      </div>

      <div className="md:col-span-2 md:grid md:grid-cols-2 md:gap-6 mt-4 md:mt-0 xl:gap-12">
        <OrmSection title="Beneficiary Information" icon={Building2}
          visibleContent={<>
            <OrmField label="Beneficiary Name" value={adv.beneficiaryName || data.beneficiary?.name} highlight />
            <OrmField label="Beneficiary Account / Nostro Account" value={adv.beneficiaryAccount || data.beneficiary?.account_number} mono highlight />
            <OrmField label="BIC Code" value={adv.bicCode || data.beneficiary?.ifsc_or_bic} mono highlight />
          </>}
          hiddenContent={<>
            <OrmField label="Address" value="102 Madison Ave, NYC" fullWidth />
            <State label="State" value="NY" />
            <Country label="Country" value="USA" />
            <PostalCode label="Postal Code" value="10001" />
            <Email label="Email" value="finance@nova.com" />
            <Mobile label="Mobile No" value="+1-202-001" />
            <BicSearch label="BIC Search (MDM lookup)" value="CITIUS33 (MATCH)" />
            <OrmField label="Other Party Information" value="N/A" fullWidth />
          </>}
        />

        <OrmSection title="Remittance Details" icon={RefreshCw}
          visibleContent={<>
            <OrmField label="ORM Sub-Type" value="ORM01" highlight />
            <OrmField label="Remittance Mode" value="TT / SWIFT" highlight />
            <OrmField label="Remittance In" value="USD" highlight />
            <OrmField label="Purpose Code & Description" value={adv.purposeDesc} fullWidth highlight />
            <OrmField label="Remittance CCY" value="USD" highlight />
            <OrmField label="Remittance Amount" value={data.amount.toLocaleString()} highlight />
          </>}
          hiddenContent={<>
            <EquivalentCcy label="Equivalent CCY" value="INR" />
            <EquivalentAmount label="Equivalent Amount" value={(data.amount * TT_RATE).toLocaleString()} />
            <PleaseSpecify label="Please Specify" value="Commercial Import" />
            <OrmField label="Details of Charges" value="SHA" />
            <InstructedAmountCcy label="Instructed Amount & CCY" value={`USD ${data.amount.toLocaleString()}`} />
            <SenderCharges label="Sender’s Charges" value="USD 15.00" />
            <OrmField label="Source of Funds" value="Corporate Account" />
          </>}
        />
      </div>

      <div className="md:col-span-2 md:grid md:grid-cols-3 md:gap-4 mt-4 md:mt-0 xl:gap-8">
        <OrmSection title="Deal & Regulatory / Invoice / Goods" icon={TrendingUp}
          visibleContent={<>
            <OrmField label="Deal Type" value="SPOT" highlight />
            <OrmField label="Deal ID" value="SPOT-9912" highlight />
            <OrmField label="Deal Utilization Amount" value={data.amount.toLocaleString()} highlight />
            <OrmField label="HS Code" value={adv.hsCode || "84713010"} highlight />
            <OrmField label="Type of Import" value="General Import" highlight />
            <OrmField label="Invoice No." value={adv.invoiceNo || "INV/2026/X1"} highlight />
            <OrmField label="Invoice Date" value={adv.invoiceDate || "2026-02-01"} highlight />
            <OrmField label="Invoice Amount" value={data.amount.toLocaleString()} highlight />
          </>}
          hiddenContent={<>
            <RateType label="Rate Type" value="Card Rate" />
            <Margin label="Margin" value="0.02%" />
            <RequestType label="Request Type" value="Regular" />
            <FromCcy label="From CCY" value="INR" />
            <ToCcy label="To CCY" value="USD" />
            <DealBookingAmount label="Deal Booking Amount" value="50000" />
            <TypeOfGoods label="Type of Goods" value="Electronics" />
            <TheirReference label="Their Reference" value="APEX-TRD-01" />
            <InvoiceCurrency label="Invoice Currency" value="USD" />
            <NuovaPartyInfo label="Utilisation CCY" value="USD" />
            <NuovaPartyInfo label="Utilisation Amount" value={data.amount.toLocaleString()} />
            <PercentAdvanceAmount label="% of Advance Amount" value="100%" />
            <CountryOrigin label="Country of Origin" value="USA" />
            <CommodityCode label="Commodity Code" value="COMM001" />
            <CommodityCodeDescription label="Commodity Code Description" value="Standard Industrial Processors" fullWidth />
          </>}
        />

        <OrmSection title="Shipment & BOE Details" icon={Anchor}
          visibleContent={<>
            <OrmField label="BL/AWB No." value={adv.blNo || "MAERSK-99122"} highlight />
            <OrmField label="BL/AWB Date" value={adv.blDate || "2026-01-20"} highlight />
            <OrmField label="Shipment Terms" value={adv.shipmentTerms || "FOB"} highlight />
            <OrmField label="Shipment Date" value={adv.shipmentDate || "2026-01-25"} highlight />
          </>}
          hiddenContent={<>
            <PortLoading label="Port of Loading" value="Los Angeles" />
            <CountryLoading label="Country of Loading" value="USA" />
            <PortDischarge label="Port of Discharge" value="JNPT, Mumbai" />
            <CountryDischarge label="Country of Discharge" value="INDIA" />
            <TransportProviderName label="Transport Provider Name" value="Maersk Line" />
            <Vessel label="Vessel Name" value="SEA-FORCE" />
            <PortTransShipment label="Port of Trans-shipment" value="Dubai" />
            <SameAsBeneficiary label="Same as Beneficiary" value="YES" />
            <ConsignorCountry label="Consignor Country" value="USA" />
            <ConsignorName label="Consignor Name" value="Nova Global" />
            <ProofOfImport label="Proof of Import" value="YES" />
            <BoeNumber label="BOE Number" value="BOE-9912" />
            <BoeDate label="BOE Date" value="2026-01-25" />
            <NuovaPartyInfo label="IE CODE" value="IEC99221" />
            <NuovaPartyInfo label="IE NAME" value="Apex Global" />
            <SaveBoe label="Save BOE" value="SUCCESS" />
          </>}
        />

        <OrmSection title="Instructions & Documents" icon={ShieldAlert}
          visibleContent={<>
            <OrmField label="Instruction Type" value="Direct Import" highlight />
            <OrmField label="Instruction Code" value="TRD-DIR-01" highlight />
            <OrmField label="Decision" value="AUTO-APPROVED" highlight />
          </>}
          hiddenContent={<>
            <OrmField label="Instructions" value="Standard trade payment" fullWidth />
            <DocumentsObtained label="Documents to be obtained" value="Form A1, Invoice, BL" />
            <OrmField label="Original Documents Received" value="YES" />
            <OrmField label="Remarks" value="Verified against MDM" />
            <BranchUserChecklist label="Branch User Checklist" value="SUCCESS" />
            <CpcScrChecklist label="CPC-SCR Checklist" value="SUCCESS" />
            <OrmField label="Raise Discrepancy" value="NO" />
            <CustomerSignVerified label="Customer Sign Verified" value="YES" />
            <SwiftSfmsRouted label="SWIFT/SFMS to be routed" value="MT103" />
            <TrackerStatus label="Tracker Status" value="ACTIVE" />
            <DecisionHistory label="Decision History" value="Maker: System" fullWidth />
          </>}
        />
      </div>
    </div>
  );

  const renderTradeAdvanceSections = () => (
    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-x-6 md:space-y-0 animate-icici pb-10 xl:pb-20">
      <div className="md:col-span-2">
        <GpiComplianceSection rail={PaymentRail.ORM} beneficiary={data.beneficiary} gpiDetails={data.gpiDetails} setGpiDetails={(g) => setData({...data, gpiDetails: g})} />
      </div>
      
      <div className="space-y-4 xl:space-y-8">
        <OrmSection title="Basic Details" icon={Lock} defaultExpanded={true}
          visibleContent={<>
            <OrmField label="Unique Ref No." value={adv.uniqueRefNo} mono highlight />
            <OrmField label="Product Category" value={adv.productCategory} highlight />
            <OrmField label="Event Type" value="OUTWARD" highlight />
            <OrmField label="Transaction Reference Number / Trade Core Reference No." value={adv.tradeCoreRef || "TCR-ADV-88"} mono fullWidth highlight />
          </>}
          hiddenContent={<>
            <OrmField label="TF Location Sol ID" value="SOL1022" />
            <OrmField label="CTPC Sol ID" value="CPC99" />
            <OrmField label="Branch Sol ID" value="BR1010" />
            <OrmField label="Channel" value="CIB PORTAL" />
            <OrmField label="Portal Reference No." value="PN-ADV-8822" />
          </>}
        />

        <OrmSection title="Customer Profile" icon={User}
          visibleContent={<>
            <OrmField label="Customer ID / CIF ID" value={data.cif_id} highlight />
            <OrmField label="Customer Name" value={data.customerProfile?.customer_name} highlight />
            <OrmField label="Account Number" value={data.customerProfile?.primary_account_number} mono highlight />
            <OrmField label="Remitter Name" value={data.customerProfile?.customer_name} highlight />
          </>}
          hiddenContent={<>
            <NewCustomer label="New Customer" value="NO" />
            <NuovaPartyInfo label="Refer attached screenshot (field)" value="VERIFIED_SCREEN_01.PNG" />
          </>}
        />
      </div>

      <div className="space-y-4 mt-4 md:mt-0 xl:space-y-8">
        <OrmSection title="Contact Details" icon={Phone}
          visibleContent={<>
            <OrmField label="Contact Number" value={data.customerProfile?.contact_number} highlight />
            <OrmField label="E-mail" value={data.customerProfile?.email} highlight />
            <OrmField label="Contact Person" value={data.customerProfile?.contact_person} highlight />
          </>}
          hiddenContent={<>
            <PriorityProcessing label="Priority Processing" value="YES" />
            <OrmField label="Address" value={data.customerProfile?.address} fullWidth />
            <NuovaPartyInfo label="PAN No." value={data.customerProfile?.pan_no} />
            <NuovaPartyInfo label="IE Ref No." value={data.customerProfile?.ie_ref_no} />
          </>}
        />

        <OrmSection title="Deferral & Customer Documents" icon={AlertTriangle}
          visibleContent={<>
            <OrmField label="Deferral Status" value="NONE" highlight />
            <OrmField label="Deferral Reason" value="N/A" highlight />
          </>}
          hiddenContent={<>
            <DeferralDueDate label="Deferral Due Date" value="N/A" />
            <SpecificDocuments label="Specific Documents" value="Trade Contract, A2" />
            <ExpiryDate label="Expiry Date" value="2026-12-31" />
          </>}
        />
      </div>

      <div className="md:col-span-2 md:grid md:grid-cols-2 md:gap-6 mt-4 md:mt-0 xl:gap-12">
        <OrmSection title="Remittance Details" icon={RefreshCw}
          visibleContent={<>
            <OrmField label="ORM Sub-Type" value="ORM-ADV" highlight />
            <OrmField label="Remittance Mode" value="TT / SWIFT" highlight />
            <OrmField label="Remittance In" value="USD" highlight />
            <OrmField label="Purpose Code & Description" value={adv.purposeDesc} fullWidth highlight />
            <OrmField label="Remittance CCY" value="USD" highlight />
            <OrmField label="Remittance Amount" value={data.amount.toLocaleString()} highlight />
          </>}
          hiddenContent={<>
            <EquivalentCcy label="Equivalent CCY" value="INR" />
            <EquivalentAmount label="Equivalent Amount" value={(data.amount * TT_RATE).toLocaleString()} />
            <PleaseSpecify label="Please Specify" value="Advanced Import Payment" />
            <OrmField label="Details of Charges" value="SHA" />
            <InstructedAmountCcy label="Instructed Amount & CCY" value={`USD ${data.amount.toLocaleString()}`} />
            <SenderCharges label="Sender’s Charges" value="USD 25.00" />
            <OrmField label="Source of Funds" value="Corporate Funds" />
          </>}
        />

        <OrmSection title="Deal Details" icon={Zap}
          visibleContent={<>
            <OrmField label="Deal Type" value="SPOT" highlight />
            <OrmField label="Deal ID" value="SPOT-ADV-99" highlight />
            <OrmField label="Deal Utilization Amount" value={data.amount.toLocaleString()} highlight />
          </>}
          hiddenContent={<>
            <RateType label="Rate Type" value="Market Rate" />
            <Margin label="Margin" value="0.015%" />
            <RequestType label="Request Type" value="Advance" />
            <FromCcy label="From CCY" value="INR" />
            <ToCcy label="To CCY" value="USD" />
            <DealBookingAmount label="Deal Booking Amount" value="100000" />
          </>}
        />
      </div>

      <div className="md:col-span-2 md:grid md:grid-cols-3 md:gap-4 mt-4 md:mt-0 xl:gap-8">
        <OrmSection title="Regulatory & Invoice" icon={TrendingUp}
          visibleContent={<>
            <OrmField label="HS Code" value={adv.hsCode || "84713020"} highlight />
            <OrmField label="Type of Import" value="Commercial" highlight />
            <OrmField label="Invoice No." value={adv.invoiceNo || "INV-ADV-001"} highlight />
            <OrmField label="Invoice Date" value={adv.invoiceDate || "2026-02-10"} highlight />
            <OrmField label="Invoice Amount" value={data.amount.toLocaleString()} highlight />
          </>}
          hiddenContent={<>
            <TypeOfGoods label="Type of Goods" value="Electronics" />
            <TheirReference label="Their Reference" value="ZEN-TRD-ADV" />
            <InvoiceCurrency label="Invoice Currency" value="USD" />
            <NuovaPartyInfo label="Utilisation CCY" value="USD" />
            <NuovaPartyInfo label="Utilisation Amount" value={data.amount.toLocaleString()} />
            <PercentAdvanceAmount label="% of Advance Amount" value="100%" />
            <CountryOrigin label="Country of Origin" value="CHINA" />
            <CommodityCode label="Commodity Code" value="COMM992" />
            <CommodityCodeDescription label="Commodity Code Description" value="Industrial Components" fullWidth />
          </>}
        />

        <OrmSection title="Shipment & Instructions" icon={Anchor}
          visibleContent={<>
            <OrmField label="Instruction Type" value="Advance Payment" highlight />
            <OrmField label="Instruction Code" value="ADV-X" highlight />
          </>}
          hiddenContent={<>
            <InstructionsFreeText label="Instructions (Free Text)" value="Urgent trade settlement" fullWidth />
            <ShipmentDetails label="Shipment Details" value="Air Freight scheduled Mar 2026" />
          </>}
        />

        <OrmSection title="Beneficiary & Documents" icon={ShieldAlert}
          visibleContent={<>
            <OrmField label="Beneficiary Name" value={adv.beneficiaryName || data.beneficiary?.name} highlight />
            <OrmField label="Beneficiary Account / Nostro Account" value={adv.beneficiaryAccount || data.beneficiary?.account_number} mono highlight />
            <OrmField label="BIC Code" value={adv.bicCode || data.beneficiary?.ifsc_or_bic} mono highlight />
            <OrmField label="Debit Account No." value={data.customerProfile?.primary_account_number} mono highlight />
            <OrmField label="Decision" value="APPROVED" highlight />
          </>}
          hiddenContent={<>
            <OrmField label="Address" value="Shanghai" fullWidth />
            <State label="State" value="Shanghai" />
            <Country label="Country" value="China" />
            <NuovaPartyInfo label="Postal Code" value="200120" />
            <Email label="E-mail" value="export@china-zenith.cn" />
            <MigratedMobileLabel label="Mobile No" value="+86-21-99881122" />
            <BicSearch label="BIC Search (MDM Lookup)" value="MATCHED-SAFE" />
            <DocumentsObtained label="Documents to be obtained" value="PI, Form A2" />
            <OrmField label="Original Documents Received" value="YES" />
            <CaseDocuments label="Case Documents" value="DOC_ADV_9912.PDF" />
            <Remarks label="Remarks" value="Verified for trade advance" />
            <BranchUserChecklist label="Branch User Checklist" value="SUCCESS" />
            <CpcScrChecklist label="CPC-SCR Checklist" value="SUCCESS" />
            <OrmField label="Raise Discrepancy" value="NO" />
            <CustomerSignVerified label="Customer Sign Verified" value="YES" />
            <SwiftSfmsRouted label="SWIFT/SFMS to be routed" value="MT103" />
            <TrackerStatus label="Tracker Status" value="INITIATED" />
            <DecisionHistory label="Decision History" value="Maker: System" fullWidth />
          </>}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 xl:p-16 max-w-6xl mx-auto animate-icici">
      <div className="flex items-center gap-4 mb-8 xl:mb-16">
        <button onClick={onBack} className="p-1"><ArrowRight className="rotate-180 text-[#EF6623] xl:w-8 xl:h-8" /></button>
        <h2 className="text-[18px] xl:text-[28px] font-bold text-[#C0382B] uppercase tracking-tight">{data.ormType?.replace('_', ' ')} Entry</h2>
      </div>

      <div className="max-w-2xl">
        <HyperPersonalizedInsights />
      </div>

      {isLrs && renderLRSSections()}
      {isTradeDirect && renderTradeDirectSections()}
      {isTradeAdvance && renderTradeAdvanceSections()}
      
      <div className="max-w-2xl">
        <AdvanceFeesFxPredictions ormType={data.ormType} />
      </div>

      <div className="bg-white border-l-4 border-[#EF6623] p-6 shadow-md mt-6 rounded-[8px] border border-[#E5D4C3]/30 max-w-xl xl:max-w-2xl xl:p-10 xl:mt-10">
        <label className="text-[10px] xl:text-[14px] font-bold text-[#6A6A6A] uppercase block mb-3 xl:mb-6">Amount ($)</label>
        <div className="flex items-baseline gap-2 xl:gap-4">
           <span className="font-black text-2xl xl:text-5xl text-[#EF6623]">$</span>
           <input type="number" className="w-full bg-transparent py-2 text-3xl xl:text-6xl font-black text-[#C0382B] outline-none" value={data.amount} onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>

      <button onClick={onNext} className="w-full max-w-xl xl:max-w-2xl bg-[#EF6623] text-white font-black py-5 xl:py-7 rounded-[12px] xl:rounded-[20px] mt-10 xl:mt-16 uppercase text-xs xl:text-lg tracking-[0.2em] shadow-xl hover:bg-[#C0382B] transition-colors active:scale-[0.98]">Confirm Instruction</button>
    </div>
  );
}

// Internal helpers
const BranchUserChecklist = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const CpcScrChecklist = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const MigratedMobileLabel = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const NuovaPartyInfo = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const ReferScreenshot = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const ProofOfImport = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const Email = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const Mobile = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const Vessel = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const PriorityProcessing = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const LeiNo = ({ label, value, fullWidth }: { label: string, value: string, fullWidth?: boolean }) => (
  <div className={`mb-3 flex flex-col ${fullWidth ? 'col-span-2' : ''} xl:mb-5`}>
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const LeiExpiryDate = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const NewCustomer = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const DeferralDueDate = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const SpecificDocuments = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const ExpiryDate = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const State = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const Country = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const PostalCode = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const BicSearch = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const EquivalentCcy = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const EquivalentAmount = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const PleaseSpecify = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const InstructedAmountCcy = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const SenderCharges = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const RateType = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const Margin = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const RequestType = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const FromCcy = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const ToCcy = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const DealBookingAmount = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const TypeOfGoods = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const TheirReference = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const InvoiceCurrency = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const PercentAdvanceAmount = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const CountryOrigin = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const CommodityCode = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const CommodityCodeDescription = ({ label, value, fullWidth }: { label: string, value: string, fullWidth?: boolean }) => (
  <div className={`mb-3 flex flex-col ${fullWidth ? 'col-span-2' : ''} xl:mb-5`}>
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const PortLoading = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const CountryLoading = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const PortDischarge = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const CountryDischarge = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const TransportProviderName = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const PortTransShipment = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const SameAsBeneficiary = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const ConsignorCountry = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const ConsignorName = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const BoeNumber = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const BoeDate = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const SaveBoe = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const DocumentsObtained = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const CustomerSignVerified = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const SwiftSfmsRouted = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const TrackerStatus = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const DecisionHistory = ({ label, value, fullWidth }: { label: string, value: string, fullWidth?: boolean }) => (
  <div className={`mb-3 flex flex-col ${fullWidth ? 'col-span-2' : ''} xl:mb-5`}>
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const InstructionsFreeText = ({ label, value, fullWidth }: { label: string, value: string, fullWidth?: boolean }) => (
  <div className={`mb-3 flex flex-col ${fullWidth ? 'col-span-2' : ''} xl:mb-5`}>
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const ShipmentDetails = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const CaseDocuments = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

const Remarks = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-3 flex flex-col xl:mb-5">
    <p className="text-[8px] xl:text-[11px] font-bold text-[#6A6A6A] uppercase tracking-wider opacity-70">{label}</p>
    <p className="text-[10px] xl:text-[14px] font-bold leading-tight text-[#6A6A6A]">{value}</p>
  </div>
);

function ConfirmationScreen({ data, onBack, onSuccess }: any) {
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [showNotifStatus, setShowNotifStatus] = useState(false);

  const handleAuthorize = () => { 
    setIsAuthorizing(true); 
    setTimeout(() => { 
      setIsAuthorizing(false); 
      setShowNotifStatus(true);
      setTimeout(() => {
        setShowNotifStatus(false);
        onSuccess(); 
      }, 2500);
    }, 1500); 
  };

  return (
    <div className="p-6 md:p-10 xl:p-20 max-w-4xl mx-auto flex flex-col min-h-full animate-icici relative">
      {showNotifStatus && (
        <div className="absolute inset-0 z-[100] bg-[#FAF9F7]/95 flex flex-col items-center justify-center p-6 xl:p-10 space-y-6 xl:space-y-12 animate-icici">
          <div className="bg-white p-8 xl:p-16 rounded-[32px] xl:rounded-[48px] shadow-2xl border border-[#E5D4C3] flex flex-col items-center w-full max-w-[300px] xl:max-w-lg">
            <div className="bg-blue-50 p-4 xl:p-10 rounded-full text-blue-600 mb-6 xl:mb-12 animate-pulse">
               <Bell size={32} className="xl:w-16 xl:h-16" />
            </div>
            <p className="text-[14px] xl:text-[22px] font-black text-[#C0382B] uppercase tracking-[0.15em] mb-2 xl:mb-5">Sending Alerts</p>
            <p className="text-[10px] xl:text-[14px] text-[#6A6A6A] font-bold uppercase tracking-widest text-center">Notifying Remitter via Push, SMS & WhatsApp...</p>
            
            <div className="mt-10 xl:mt-20 space-y-3 xl:space-y-5 w-full">
               <div className="flex items-center gap-3 xl:gap-5 bg-blue-50 py-2 xl:py-4 px-4 xl:px-8 rounded-full border border-blue-100">
                  <Smartphone size={14} className="text-blue-600 xl:w-6 xl:h-6" />
                  <span className="text-[8px] xl:text-[12px] font-black text-blue-900 uppercase">Push Sent</span>
                  <CheckCircle size={12} className="text-green-600 ml-auto xl:w-5 xl:h-5" />
               </div>
               <div className="flex items-center gap-3 xl:gap-5 bg-orange-50 py-2 xl:py-4 px-4 xl:px-8 rounded-full border border-orange-100">
                  <Smartphone size={14} className="text-[#EF6623] xl:w-6 xl:h-6" />
                  <span className="text-[8px] xl:text-[12px] font-black text-orange-900 uppercase">SMS Sent</span>
                  <CheckCircle size={12} className="text-green-600 ml-auto xl:w-5 xl:h-5" />
               </div>
               <div className="flex items-center gap-3 xl:gap-5 bg-green-50 py-2 xl:py-4 px-4 xl:px-8 rounded-full border border-green-100">
                  <MessageSquare size={14} className="text-green-600 xl:w-6 xl:h-6" />
                  <span className="text-[8px] xl:text-[12px] font-black text-green-900 uppercase">WhatsApp Sent</span>
                  <CheckCircle size={12} className="text-green-600 ml-auto xl:w-5 xl:h-5" />
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-10 xl:mb-20"><button onClick={onBack}><ArrowRight className="rotate-180 text-[#EF6623] xl:w-10 xl:h-10" /></button><h2 className="text-[20px] xl:text-[32px] font-black text-[#C0382B] uppercase tracking-tight">Confirm Payment</h2></div>
      
      <div className="text-center mb-6 xl:mb-12 bg-white rounded-[24px] xl:rounded-[48px] border border-[#E5D4C3] p-10 xl:p-20 shadow-sm xl:shadow-md border-t-[6px] xl:border-t-[10px] border-[#EF6623]">
        <p className="text-[10px] xl:text-[16px] font-bold text-[#6A6A6A] uppercase tracking-widest mb-2 xl:mb-5">Total Amount</p>
        <h1 className="text-[42px] xl:text-[80px] font-black text-[#C0382B] tracking-tighter">${data.amount.toLocaleString()}</h1>
        <div className="mt-4 xl:mt-8 flex items-center justify-center gap-2 xl:gap-4 text-[10px] xl:text-[15px] font-bold text-[#EF6623] bg-orange-50 xl:bg-orange-50/50 py-1.5 xl:py-3 px-3 xl:px-6 rounded-full w-fit mx-auto uppercase">
          <RefreshCw size={12} className="xl:w-5 xl:h-5" /> Rate Locked @ 83.20
        </div>
      </div>

      <div className="bg-white border border-[#E5D4C3] rounded-[20px] xl:rounded-[32px] p-7 xl:p-12 space-y-6 xl:space-y-10 shadow-sm xl:shadow-md">
        <div className="flex justify-between items-start text-sm xl:text-2xl border-b border-[#FAF9F7] pb-4 xl:pb-8">
          <span className="text-[#6A6A6A] font-black uppercase text-[10px] xl:text-[14px] tracking-widest">Recipient</span>
          <span className="text-[#C0382B] font-black text-right ml-4 uppercase text-xs xl:text-xl">{data.beneficiary?.name || data.advanced?.beneficiaryName}</span>
        </div>
        <div className="flex justify-between items-center text-sm xl:text-2xl">
          <span className="text-[#6A6A6A] font-black uppercase text-[10px] xl:text-[14px] tracking-widest">Type</span>
          <div className="flex items-center gap-1.5 xl:gap-3"><span className="text-[#EF6623] font-black uppercase text-[10px] xl:text-[14px]">{data.ormType}</span><ShieldCheck size={14} className="text-[#EF6623] xl:w-6 xl:h-6" /></div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-[20px] xl:rounded-[32px] p-5 xl:p-10 flex items-center gap-4 xl:gap-8 mt-8 xl:mt-16 shadow-sm xl:shadow-md">
        <div className="bg-blue-600 p-2.5 xl:p-5 rounded-xl xl:rounded-2xl text-white shadow-md">
          <Bell size={18} className="xl:w-8 xl:h-8" />
        </div>
        <div>
          <p className="text-[10px] xl:text-[15px] font-black text-blue-900 uppercase tracking-[0.1em]">Alerts Enabled</p>
          <p className="text-[9px] xl:text-[13px] text-blue-700 font-medium leading-relaxed mt-0.5 xl:mt-2">You will receive updates on your mobile, SMS, and WhatsApp once the payment is submitted.</p>
        </div>
      </div>

      <button onClick={handleAuthorize} disabled={isAuthorizing || showNotifStatus} className="w-full bg-[#EF6623] text-white rounded-[16px] xl:rounded-[24px] py-6 xl:py-10 font-black flex items-center justify-center gap-4 xl:gap-8 uppercase text-xs xl:text-xl tracking-[0.2em] shadow-xl mt-12 xl:mt-20 active:scale-95 transition-transform disabled:opacity-50">
        {isAuthorizing ? <Loader2 className="animate-spin xl:w-8 xl:h-8" /> : <><Fingerprint size={24} className="xl:w-10 xl:h-10" /> Biometric Authorize</>}
      </button>
    </div>
  );
}

function SuccessScreen({ onDone, onTrack, data }: any) {
  useEffect(() => {
    const ref = data.advanced?.uniqueRefNo || 'N/A';
    const type = data.ormType || 'N/A';
    const amount = data.amount || 0;
    const ccy = data.advanced?.remittanceIn || 'USD';

    console.log("--- OUTGOING ALERTS ---");
    console.log(`📱 Push: Your ORM request has been received and is being processed. Ref: ${ref}`);
    console.log(`💬 SMS: ICICI Bank: Your ORM transaction (Ref ${ref}) is submitted successfully. Track status in the app.`);
    console.log(`🟩 WhatsApp: ICICI Bank Update:\nYour ORM payment has been submitted.\n\nReference: ${ref}\nType: ${type}\nAmount: ${amount} ${ccy}\n\nYou can track progress anytime in Remit Track.`);
    console.log("------------------------");
  }, []);

  return (
    <div className="h-full flex flex-col items-center p-10 xl:p-20 text-center animate-icici pb-32 xl:pb-40">
      <div className="w-28 h-28 xl:w-44 xl:h-44 bg-white border-[6px] xl:border-[10px] border-green-600 rounded-full flex items-center justify-center mb-6 xl:mb-12 text-green-600 shadow-xl"><CheckCircle size={56} className="xl:w-24 xl:h-24" strokeWidth={3} /></div>
      <h2 className="text-[28px] xl:text-[48px] font-black text-[#C0382B] mb-2 xl:mb-5 uppercase tracking-tighter">Success</h2>
      <p className="text-[#6A6A6A] text-[10px] xl:text-[16px] font-bold uppercase mb-10 xl:mb-20 opacity-70 tracking-widest">🔗 UETR: a2b7c1d8-4421-49f9-91c0-112233445566</p>
      
      <div className="w-full max-w-sm xl:max-w-2xl mb-10 xl:mb-20">
        <PaymentAdviceCard data={data} />
      </div>

      <div className="w-full max-w-sm xl:max-w-2xl space-y-5 xl:space-y-10">
        <button className="w-full bg-[#EF6623] text-white font-black py-5 xl:py-8 rounded-[16px] xl:rounded-[24px] uppercase text-xs xl:text-lg tracking-widest shadow-xl flex items-center justify-center gap-2 xl:gap-4" onClick={onTrack}><MapPin size={16} className="xl:w-6 xl:h-6" /> Track SWIFT Path</button>
        <button className="w-full bg-white border border-[#E5D4C3] text-[#6A6A6A] font-black py-5 xl:py-8 rounded-[16px] xl:rounded-[24px] uppercase text-xs xl:text-lg tracking-widest shadow-sm hover:border-[#EF6623] transition-all" onClick={onDone}>New Remittance</button>
      </div>
    </div>
  );
}

function HistoryScreen({ onBack, isPayAgain = false, onSelectTransaction }: { onBack: () => void, isPayAgain?: boolean, onSelectTransaction?: (t: Transaction) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  
  const filteredTxns = MOCK_TRANSACTIONS.filter(t => t.beneficiary_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDownload = (option: string) => {
    setShowOptions(false);
    setToast("Report downloaded (dummy).");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="p-6 md:p-10 xl:p-16 animate-icici pb-32 xl:pb-40 max-w-7xl mx-auto xl:pt-20 relative">
      {toast && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[100] w-[80%] max-w-sm animate-icici">
           <div className="bg-[#EF6623] text-white py-3 px-6 rounded-2xl text-[11px] font-black uppercase text-center shadow-xl">
             {toast}
           </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 xl:mb-16">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1 text-[#EF6623]"><ChevronLeft size={24} className="xl:w-10 xl:h-10" /></button>
          <h2 className="text-[20px] xl:text-[32px] font-black text-[#C0382B] uppercase tracking-tight">
            {isPayAgain ? 'Select to Pay Again' : 'Activity Log'}
          </h2>
        </div>
        
        {!isPayAgain && (
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="bg-[#EF6623] text-white px-4 py-2 rounded-xl text-[10px] xl:text-[14px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md active:scale-95 transition-transform"
            >
              <Download size={16} className="xl:w-5 xl:h-5" /> Download Report
            </button>
            
            {showOptions && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#E5D4C3] rounded-2xl shadow-xl z-50 overflow-hidden animate-icici">
                {['Last 7 Days', 'Last 30 Days', 'This Month', 'Custom Range'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => handleDownload(opt)}
                    className="w-full text-left px-5 py-3 text-[10px] xl:text-[12px] font-bold text-[#6A6A6A] hover:bg-orange-50 hover:text-[#EF6623] transition-colors border-b border-[#FAF9F7] last:border-0"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative mb-6 xl:mb-12 max-w-3xl">
         <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B0B0] xl:w-6 xl:h-6 xl:left-6" />
         <input 
           type="text" 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           placeholder="Search past payments..."
           className="w-full bg-white border border-[#E5D4C3] rounded-2xl xl:rounded-[24px] py-4 xl:py-6 pl-12 xl:pl-16 pr-4 xl:pr-8 text-[11px] xl:text-[16px] font-bold text-[#6A6A6A] uppercase tracking-widest outline-none focus:border-[#EF6623] transition-colors shadow-sm xl:shadow-md"
         />
      </div>

      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 xl:grid-cols-2 xl:gap-8 md:space-y-0">
        {filteredTxns.map((txn, i) => (
          <div 
            key={i} 
            onClick={() => isPayAgain && onSelectTransaction?.(txn)}
            className={`bg-white border border-[#E5D4C3] rounded-[24px] p-5 xl:p-10 shadow-sm xl:shadow-md h-fit transition-all group ${isPayAgain ? 'cursor-pointer hover:border-[#EF6623] active:scale-98' : ''}`}
          >
            <div className="flex justify-between items-start mb-3 xl:mb-6">
              <div>
                <p className="font-black text-[#C0382B] text-sm xl:text-xl uppercase group-hover:text-[#EF6623] transition-colors">{txn.beneficiary_name}</p>
                <p className="text-[10px] xl:text-[14px] text-[#6A6A6A] font-bold mt-1 xl:mt-3 opacity-70">{new Date(txn.date_time).toLocaleDateString()} • {txn.txn_id}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-[#EF6623] text-sm md:text-base xl:text-2xl">${txn.amount.toLocaleString()}</p>
                <div className="mt-1 xl:mt-3"><RailBadge rail={txn.rail} /></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#FAF9F7] xl:pt-6">
              <div className="flex items-center gap-2 xl:gap-4">
                <div className={`w-2 h-2 xl:w-3 xl:h-3 rounded-full ${txn.status === 'SUCCESS' ? 'bg-green-50' : 'bg-orange-50'}`}></div>
                <span className="text-[9px] xl:text-[13px] font-black uppercase tracking-widest text-[#6A6A6A]">{txn.status}</span>
              </div>
              {isPayAgain && (
                <div className="flex items-center gap-1 text-[#EF6623] text-[9px] xl:text-[12px] font-black uppercase tracking-widest">
                  Pay Again <ArrowRight size={14} className="xl:w-4 xl:h-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- New Stage Ribbon Component ---
const StageRibbon = ({ tracker, noMargin = false }: { tracker: TrackingInfo, noMargin?: boolean }) => {
  const ormTypeKey = tracker.orm_type || 'LRS';
  const stages = GPI_MAP[ormTypeKey] || [];
  
  const inProgressIndex = tracker.timeline.findIndex(s => s.status === 'in_progress');
  const completedCount = tracker.timeline.filter(s => s.status === 'completed').length;
  
  let currentIndex = inProgressIndex !== -1 ? inProgressIndex : (completedCount < stages.length ? completedCount : stages.length - 1);

  // Requirement: Screening must never appear active on the card.
  if (stages[currentIndex] && stages[currentIndex].includes("Screening")) {
    currentIndex = Math.min(currentIndex + 1, stages.length - 1);
  }

  const prev = currentIndex > 0 ? stages[currentIndex - 1] : null;
  const curr = stages[currentIndex];
  const next = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;

  const style = ACTIVE_CARD_RIBBON_STYLE;

  return (
    <div className={`flex items-center gap-1.5 xl:gap-4 w-full ${noMargin ? '' : 'mt-4'} overflow-x-auto no-scrollbar pb-1`}>
      {prev && (
        <div className="flex items-center gap-1 xl:gap-2 px-2 py-1 xl:px-4 xl:py-2 bg-[#E8F5E9] rounded-lg xl:rounded-xl whitespace-nowrap">
          <CheckCircle size={10} color={style.previous.color} className="xl:w-4 xl:h-4" />
          <span className="text-[8px] xl:text-[11px] font-black uppercase tracking-tighter" style={{ color: style.previous.color }}>{prev}</span>
        </div>
      )}
      {prev && <ChevronRight size={10} className="text-gray-300 flex-shrink-0 xl:w-4 xl:h-4" />}
      
      <div className="flex items-center gap-1 xl:gap-2 px-2.5 py-1.5 xl:px-5 xl:py-3 bg-[#FFFDE7] rounded-lg xl:rounded-xl border border-yellow-200 shadow-sm">
        <Clock size={10} color={style.current.color} className="animate-pulse xl:w-4 xl:h-4" />
        <span className="text-[9px] xl:text-[13px] font-black uppercase tracking-tighter" style={{ color: style.current.color }}>{curr}</span>
      </div>
      
      {next && <ChevronRight size={10} className="text-gray-300 flex-shrink-0 xl:w-4 xl:h-4" />}
      {next && (
        <div className="flex items-center gap-1 xl:gap-2 px-2 py-1 xl:px-4 xl:py-2 bg-gray-100 rounded-lg xl:rounded-xl whitespace-nowrap" style={{ opacity: style.next.opacity }}>
          <MoreHorizontal size={10} color={style.next.color} className="xl:w-4 xl:h-4" />
          <span className="text-[8px] xl:text-[11px] font-black uppercase tracking-tighter" style={{ color: style.next.color }}>{next}</span>
        </div>
      )}
    </div>
  );
};

function TrackScreen({ selectedId, onBack, onSelect, data }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    orm: [] as string[],
    status: [] as string[],
    amount: null as string | null,
    currency: [] as string[],
    date: null as string | null
  });

  const m = TRACKING_FILTERS;

  const toggleFilter = (category: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => {
      if (category === 'amount' || category === 'date') {
        return { ...prev, [category]: prev[category] === value ? null : value };
      }
      const arr = prev[category] as string[];
      if (arr.includes(value)) {
        return { ...prev, [category]: arr.filter(v => v !== value) };
      }
      return { ...prev, [category]: [...arr, value] };
    });
  };

  const filteredTrackers = useMemo(() => {
    return MOCK_TRACKING.filter(t => t.rail === PaymentRail.ORM).filter(t => {
      const s = searchTerm.toLowerCase();
      const matchesSearch = 
        t.beneficiary.toLowerCase().includes(s) ||
        t.txn_id.toLowerCase().includes(s) ||
        t.amount.toString().includes(s) ||
        (t.uetr && t.uetr.toLowerCase().includes(s)) ||
        (t.orm_type && t.orm_type.toLowerCase().includes(s));

      const matchesOrm = activeFilters.orm.length === 0 || activeFilters.orm.includes(t.orm_type?.replace('_', ' ') || '');
      
      const overallStatusFormatted = t.overall_status === 'in_progress' ? 'In Progress' : 
                                      t.overall_status.charAt(0).toUpperCase() + t.overall_status.slice(1);
      const matchesStatus = activeFilters.status.length === 0 || activeFilters.status.includes(overallStatusFormatted);
      
      const matchesCurrency = activeFilters.currency.length === 0 || activeFilters.currency.includes(t.currency);
      
      let matchesAmount = true;
      if (activeFilters.amount) {
        const val = t.amount;
        if (activeFilters.amount === 'Below 1L') matchesAmount = val < 1200; 
        if (activeFilters.amount === '1L-10L') matchesAmount = val >= 1200 && val <= 12000;
        if (activeFilters.amount === 'Above 10L') matchesAmount = val > 12000;
      }

      let matchesDate = true;
      if (activeFilters.date) {
        const lastUpd = new Date(t.last_updated).getTime();
        const now = Date.now();
        const diffDays = (now - lastUpd) / (1000 * 60 * 60 * 24);
        if (activeFilters.date === 'Today') matchesDate = diffDays < 1;
        if (activeFilters.date === 'Last 7 days') matchesDate = diffDays <= 7;
        if (activeFilters.date === 'Last 30 days') matchesDate = diffDays <= 30;
      }

      return matchesSearch && matchesOrm && matchesStatus && matchesCurrency && matchesAmount && matchesDate;
    });
  }, [searchTerm, activeFilters]);

  if (selectedId) {
    const tracking = MOCK_TRACKING.find(t => t.txn_id === selectedId);
    const isOrm = tracking?.rail === PaymentRail.ORM;
    const ormTypeKey = tracking?.orm_type || 'LRS';
    const dynamicStages = isOrm ? GPI_MAP[ormTypeKey] : null;
    const timeEstimates = isOrm ? GPI_TIME_ESTIMATES[ormTypeKey] : null;
    const etaKey = ormTypeKey === 'LRS' ? 'LRS_USD_US' : (ormTypeKey === 'TRADE_ADVANCE' ? 'TRADE_ADVANCE_USD_EU' : 'TRADE_DIRECT_USD_SG');
    const counterpartyEta = COUNTERPARTY_ETA_DATA[etaKey] || 24;

    return (
      <div className="flex flex-col h-full animate-icici p-6 md:p-10 xl:p-16 max-w-7xl mx-auto pb-32 xl:pb-40 xl:pt-20">
        <div className="flex items-center gap-4 mb-8 xl:mb-16">
          <button onClick={() => { onSelect(null); setShowAdvice(false); }} className="text-[#EF6623]"><ChevronLeft size={24} className="xl:w-10 xl:h-10" /></button>
          <h2 className="text-[20px] xl:text-[32px] font-black text-[#C0382B] uppercase tracking-tight">SWIFT Tracking</h2>
        </div>

        <div className="bg-[#F8FBFF] border border-blue-100 rounded-xl xl:rounded-[24px] px-4 py-3 xl:px-10 xl:py-6 mb-6 xl:mb-12 flex items-center justify-between shadow-sm xl:shadow-md border-l-4 border-l-blue-500">
           <span className="text-[10px] xl:text-[16px] font-black text-blue-900 tracking-wider uppercase flex items-center gap-2 xl:gap-5">
              🔗 UETR: <span className="font-mono text-[#EF6623]">{tracking?.uetr || 'a2b7c1d8-4421-49f9-91c0-112233445566'}</span>
           </span>
           <button 
             onClick={() => setShowAdvice(!showAdvice)}
             className="bg-white border border-blue-200 px-3 py-1.5 xl:px-6 xl:py-3 rounded-lg xl:rounded-xl text-[8px] xl:text-[13px] font-black text-blue-600 uppercase tracking-widest shadow-sm hover:bg-blue-50 transition-colors"
           >
             {showAdvice ? "Close Advice" : "View Advice"}
           </button>
        </div>

        {showAdvice ? (
          <div className="mb-8 xl:mb-16 max-w-2xl mx-auto w-full">
            <PaymentAdviceCard data={data} t={tracking} />
          </div>
        ) : (
          <>
            <div className="max-w-3xl">
              <HyperPersonalizedInsights />
            </div>

            <div className="bg-white rounded-[24px] p-6 md:p-10 xl:p-20 shadow-sm xl:shadow-md border border-[#E5D4C3] mb-8 xl:mb-16 xl:rounded-[40px]">
               <div className="flex justify-between items-center mb-6 xl:mb-12 border-b border-[#FAF9F7] pb-4 xl:pb-10">
                  <div>
                    <p className="text-[9px] xl:text-[14px] font-black text-[#6A6A6A] uppercase tracking-widest">
                      {isOrm ? `${tracking?.orm_type?.replace('_', ' ')} Path` : 'Payment Trail'}
                    </p>
                    <p className="text-[11px] xl:text-[22px] font-black text-[#C0382B] mt-0.5 xl:mt-3 uppercase">{tracking?.beneficiary}</p>
                  </div>
                  <Globe size={24} className="text-[#EF6623] opacity-20 xl:w-12 xl:h-12" />
               </div>
               
               <div className="relative pl-10 xl:pl-20 space-y-12 xl:space-y-20 pb-6 xl:pb-12">
                 <div className="absolute left-[7px] xl:left-[11px] top-2 bottom-8 w-px bg-dashed border-l-2 xl:border-l-[3px] border-[#E5D4C3] border-dashed"></div>
                 
                 {(dynamicStages || tracking?.timeline || []).map((item: any, idx) => {
                   const stageLabel = dynamicStages ? dynamicStages[idx] : item.event;
                   const stageData = dynamicStages ? tracking?.timeline[idx] : item;
                   const sourceStatus = stageData?.status || (idx < 2 ? 'completed' : (idx === 2 ? 'in_progress' : 'pending'));
                   const timestamp = stageData?.timestamp;
                   const estimate = timeEstimates ? timeEstimates[stageLabel] : null;
                   const isScreening = stageLabel.includes("Screening");
                   const screeningIndex = dynamicStages?.findIndex(s => s.includes("Screening")) ?? -1;
                   const isScreeningCurrentInMock = screeningIndex !== -1 && (tracking?.timeline[screeningIndex]?.status === 'in_progress' || (screeningIndex === 2 && !tracking?.timeline[screeningIndex]));

                   let renderedStatus = sourceStatus;
                   if (isScreeningCurrentInMock) {
                      if (idx === screeningIndex) renderedStatus = 'completed';
                      else if (idx === screeningIndex + 1) renderedStatus = 'in_progress';
                   }

                   return (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[43px] xl:-left-[63px] top-0 w-6 h-6 xl:w-10 xl:h-10 rounded-full border-4 xl:border-[6px] bg-white flex items-center justify-center ${renderedStatus === 'completed' ? 'border-green-600' : (renderedStatus === 'in_progress' ? 'border-blue-600' : 'border-[#E5D4C3]')}`}>
                          {renderedStatus === 'completed' && <CheckCircle size={10} className="text-green-600 xl:w-6 xl:h-6" />}
                          {renderedStatus === 'in_progress' && <div className="w-2 h-2 xl:w-4 xl:h-4 bg-blue-600 rounded-full animate-ping"></div>}
                      </div>
                      <div>
                          <p className={`text-xs md:text-sm xl:text-2xl font-black uppercase tracking-tight ${renderedStatus === 'pending' ? 'text-gray-300' : (renderedStatus === 'in_progress' ? 'text-blue-600' : 'text-[#C0382B]')}`}>
                            {stageLabel}
                          </p>
                          {estimate && renderedStatus !== 'completed' && renderedStatus !== 'in_progress' && (
                            <p className="text-[8px] md:text-[9px] xl:text-[13px] font-bold text-gray-400 mt-0.5 xl:mt-2 uppercase tracking-tighter">Typically {estimate}</p>
                          )}
                          {timestamp && renderedStatus === 'completed' && (
                            <p className="text-[9px] md:text-[10px] xl:text-[15px] font-bold text-[#6A6A6A] mt-1 xl:mt-3 opacity-60 uppercase">
                              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                          {isScreening && <ScreeningDetailsCard />}
                      </div>
                    </div>
                   );
                 })}
               </div>

               <div className="mt-4 pt-6 xl:mt-10 xl:pt-12 border-t border-[#FAF9F7] flex items-start gap-3 xl:gap-8">
                  <div className="bg-orange-50 p-2 xl:p-5 rounded-lg xl:rounded-2xl text-[#EF6623]">
                    <Clock size={16} className="xl:w-8 xl:h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] xl:text-[15px] font-black text-[#C0382B] uppercase tracking-[0.05em] mb-1 xl:mb-3">Expected Receipt Time</p>
                    <p className="text-[9px] md:text-[10px] xl:text-[14px] text-[#6A6A6A] font-medium leading-relaxed">
                      Typically <span className="font-black text-[#EF6623]">{counterpartyEta} hours</span> based on your past transfers to <span className="font-black">US</span>.
                    </p>
                  </div>
               </div>
            </div>
          </>
        )}
      </div>
    );
  }

  const getStatusBg = (status: TrackingStatus) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-50/80';
      case 'completed': return 'bg-green-50/80';
      case 'stuck': return 'bg-orange-50/80';
      case 'failed': return 'bg-red-50/80';
      default: return 'bg-gray-50/80';
    }
  };

  return (
    <div className="p-6 md:p-10 xl:p-16 max-w-7xl mx-auto animate-icici pb-32 xl:pb-40 xl:pt-20">
      <div className="flex flex-col gap-6 xl:gap-12 mb-8 xl:mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-[20px] xl:text-[32px] font-black text-[#C0382B] uppercase tracking-tight">Active Trackers</h2>
          
          <div className="flex items-center gap-3 w-full md:max-w-2xl">
            <div className="relative flex-1">
               <Search size={16} className="absolute left-4 xl:left-6 top-1/2 -translate-y-1/2 text-[#B0B0B0] xl:w-6 xl:h-6" />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search payments..."
                 className="w-full bg-white border border-[#E5D4C3] rounded-2xl xl:rounded-[24px] py-3 xl:py-5 pl-12 xl:pl-16 pr-4 xl:pr-8 text-[10px] xl:text-[16px] font-bold text-[#6A6A6A] uppercase tracking-widest outline-none focus:border-[#EF6623] transition-colors shadow-sm xl:shadow-md"
               />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-3 xl:p-5 rounded-2xl xl:rounded-[24px] border transition-all flex items-center gap-2 text-[10px] xl:text-[14px] font-black uppercase tracking-widest ${isFilterOpen ? 'bg-[#EF6623] border-[#EF6623] text-white shadow-lg' : 'bg-white border-[#E5D4C3] text-[#6A6A6A] shadow-sm xl:shadow-md'}`}
            >
              <Filter size={16} className="xl:w-6 xl:h-6" /> <span className="hidden md:block">Filter ▾</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="bg-white border border-[#E5D4C3] rounded-[24px] xl:rounded-[40px] p-6 xl:p-12 shadow-xl animate-icici flex flex-col gap-8 xl:gap-12 xl:max-w-[1440px] xl:mx-auto">
             <div className="flex flex-wrap justify-start md:justify-center gap-x-12 gap-y-10 xl:gap-x-16 xl:flex-nowrap">
               <div className="space-y-3 xl:space-y-6 md:text-center flex flex-col md:items-center">
                 <p className="text-[9px] xl:text-[13px] font-black text-[#C0382B] uppercase tracking-widest">ORM Type</p>
                 <div className="flex flex-wrap gap-2 xl:gap-4 md:justify-center">
                   {m.orm_types.map(t => (
                     <button key={t} onClick={() => toggleFilter('orm', t)} className={`px-3 py-1.5 xl:px-5 xl:py-3 rounded-xl xl:rounded-2xl text-[8px] xl:text-[12px] font-black uppercase border transition-all ${activeFilters.orm.includes(t) ? 'bg-[#EF6623] border-[#EF6623] text-white' : 'bg-[#FAF9F7] border-[#E5D4C3] text-[#6A6A6A]'}`}>{t}</button>
                   ))}
                 </div>
               </div>
               <div className="space-y-3 xl:space-y-6 md:text-center flex flex-col md:items-center">
                 <p className="text-[9px] xl:text-[13px] font-black text-[#C0382B] uppercase tracking-widest">Status</p>
                 <div className="flex flex-wrap gap-2 xl:gap-4 md:justify-center">
                   {m.status.map(s => (
                     <button key={s} onClick={() => toggleFilter('status', s)} className={`px-3 py-1.5 xl:px-5 xl:py-3 rounded-xl xl:rounded-2xl text-[8px] xl:text-[12px] font-black uppercase border transition-all ${activeFilters.status.includes(s) ? 'bg-[#EF6623] border-[#EF6623] text-white' : 'bg-[#FAF9F7] border-[#E5D4C3] text-[#6A6A6A]'}`}>{s}</button>
                   ))}
                 </div>
               </div>
               <div className="space-y-3 xl:space-y-6 md:text-center flex flex-col md:items-center">
                 <p className="text-[9px] xl:text-[13px] font-black text-[#C0382B] uppercase tracking-widest">Date Range</p>
                 <div className="flex flex-wrap gap-2 xl:gap-4 md:justify-center">
                   {m.date_ranges.map(d => (
                     <button key={d} onClick={() => toggleFilter('date', d)} className={`px-3 py-1.5 xl:px-5 xl:py-3 rounded-xl xl:rounded-2xl text-[8px] xl:text-[12px] font-black uppercase border transition-all ${activeFilters.date === d ? 'bg-[#EF6623] border-[#EF6623] text-white' : 'bg-[#FAF9F7] border-[#E5D4C3] text-[#6A6A6A]'}`}>{d}</button>
                   ))}
                 </div>
               </div>
               <div className="space-y-3 xl:space-y-6 md:text-center flex flex-col md:items-center">
                 <p className="text-[9px] xl:text-[13px] font-black text-[#C0382B] uppercase tracking-widest">Amount Band</p>
                 <div className="flex flex-wrap gap-2 xl:gap-4 md:justify-center">
                   {m.amount_bands.map(b => (
                     <button key={b} onClick={() => toggleFilter('amount', b)} className={`px-3 py-1.5 xl:px-5 xl:py-3 rounded-xl xl:rounded-2xl text-[8px] xl:text-[12px] font-black uppercase border transition-all ${activeFilters.amount === b ? 'bg-[#EF6623] border-[#EF6623] text-white' : 'bg-[#FAF9F7] border-[#E5D4C3] text-[#6A6A6A]'}`}>{b}</button>
                   ))}
                 </div>
               </div>
               <div className="space-y-3 xl:space-y-6 md:text-center flex flex-col md:items-center">
                 <p className="text-[9px] xl:text-[13px] font-black text-[#C0382B] uppercase tracking-widest">Currency</p>
                 <div className="flex flex-wrap gap-2 xl:gap-4 md:justify-center">
                   {m.currencies.map(c => (
                     <button key={c} onClick={() => toggleFilter('currency', c)} className={`px-3 py-1.5 xl:px-5 xl:py-3 rounded-xl xl:rounded-2xl text-[8px] xl:text-[12px] font-black uppercase border transition-all ${activeFilters.currency.includes(c) ? 'bg-[#EF6623] border-[#EF6623] text-white' : 'bg-[#FAF9F7] border-[#E5D4C3] text-[#6A6A6A]'}`}>{c}</button>
                   ))}
                 </div>
               </div>
             </div>
             <div className="flex justify-between items-center pt-4 xl:pt-10 border-t border-[#FAF9F7] w-full">
                <button onClick={() => setActiveFilters({ orm: [], status: [], amount: null, currency: [], date: null })} className="text-[9px] xl:text-[13px] font-black text-[#C0382B] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity">Clear All Filters</button>
                <p className="text-[9px] xl:text-[13px] font-black text-[#6A6A6A] uppercase tracking-widest opacity-40">{filteredTrackers.length} matching payments</p>
             </div>
          </div>
        )}
      </div>

      {filteredTrackers.length === 0 ? (
        <div className="text-center py-20 xl:py-40 bg-white rounded-3xl xl:rounded-[48px] border border-dashed border-[#E5D4C3]">
           <p className="text-[10px] xl:text-[18px] font-black text-[#B0B0B0] uppercase tracking-widest">No matching trackers found</p>
        </div>
      ) : (
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 xl:grid-cols-2 xl:gap-10 md:space-y-0">
          {filteredTrackers.map((t, i) => (
            <div 
              key={i} 
              className="bg-white border border-[#E5D4C3] rounded-[20px] xl:rounded-[32px] shadow-sm xl:shadow-md active:scale-[0.98] transition-all h-fit cursor-pointer hover:border-[#EF6623] xl:hover:shadow-xl overflow-hidden flex flex-col group p-4 xl:p-8 pb-0 xl:pb-0" 
              onClick={() => onSelect(t.txn_id)}
            >
              <div className="flex justify-between items-start mb-2 xl:mb-6">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-black text-[#C0382B] text-sm xl:text-2xl uppercase group-hover:text-[#EF6623] transition-colors truncate">{t.beneficiary}</p>
                    <p className="text-[8px] xl:text-[13px] font-bold text-[#6A6A6A] mt-0.5 xl:mt-3 uppercase tracking-widest opacity-60 truncate">
                      {t.txn_id} • {t.orm_type?.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 xl:gap-3">
                    <div className="px-2 py-0.5 xl:px-5 xl:py-2 bg-orange-50 xl:bg-orange-50/50 rounded-lg xl:rounded-xl text-[9px] xl:text-[14px] font-black text-[#EF6623] uppercase tracking-widest shadow-inner border border-orange-100/50">
                      {t.currency} {t.amount.toLocaleString()}
                    </div>
                  </div>
              </div>
              
              <div className="flex items-center justify-between py-2 xl:py-5 border-t border-[#FAF9F7] mt-1 xl:mt-4">
                  <span className="text-[8px] xl:text-[11px] font-black text-[#6A6A6A] uppercase opacity-40 tracking-wider">Progress</span>
                  <span className="text-[8px] xl:text-[11px] font-black text-[#EF6623] uppercase flex items-center gap-1">Details <ChevronRight size={10} className="xl:w-4 xl:h-4" /></span>
              </div>

              {/* Compact Stage Ribbon at Bottom */}
              <div className={`-mx-4 xl:-mx-8 mt-0 px-4 xl:px-10 py-3 xl:py-8 border-t border-white/50 ${getStatusBg(t.overall_status)}`}>
                  <StageRibbon tracker={t} noMargin />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
