// Typed API client for GigSaathi backend
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

// ── Types ────────────────────────────────────────────────────────────

export interface UserProfile {
  user_id: string;
  name: string;
  state: string;
  occupation_type: string;
  age: number;
  opted_44ADA: boolean;
  pan_number?: string;
  financial_year: string;
}

export interface IncomeSummary {
  user_id: string;
  financial_year: string;
  total_gross_income: number;
  total_tds_deducted: number;
  net_income: number;
  platform_breakdown: Record<string, { gross: number; tds: number; count: number }>;
  monthly_breakdown: Record<string, number>;
  record_count: number;
}

export interface TaxResult {
  user_id: string;
  gross_income: number;
  deduction_44ada: number;
  net_taxable_income: number;
  tax_before_cess: number;
  cess: number;
  total_tax: number;
  tds_credit: number;
  net_payable: number;
  slab_breakdown?: Array<{ range: string; rate: string; tax: number }>;
}

export interface ItrSummary {
  user_id: string;
  form_type: string;
  assessment_year: string;
  personal_info: { name: string; pan_number?: string; state?: string };
  income_computation: {
    gross_receipts: number;
    deduction_44ada: number;
    net_taxable: number;
  };
  tax_computation: {
    total_tax: number;
    tds_credit: number;
    advance_tax_paid: number;
    net_payable: number;
  };
  platform_income?: Record<string, number>;
}

export interface Deadline {
  installment: string;
  due_date: string;
  cumulative_percent: number;
  amount_due: number;
  status: "paid" | "due" | "upcoming" | "overdue";
  days_remaining?: number;
  alert_level?: "urgent" | "warning" | "ok";
}

export interface DeadlinesResult {
  user_id: string;
  total_tax: number;
  installments: Deadline[];
  next_deadline?: Deadline;
}

export interface UploadHistory {
  filename: string;
  platform: string;
  record_count: number;
  total_amount: number;
  total_tds: number;
  duplicates_flagged: number;
  uploaded_at: string | null;
}

export interface ChatResponse {
  response: string;
  tools_called: string[];
  timestamp: string;
}

// ── API Calls ─────────────────────────────────────────────────────────

export const api = {
  // Users
  createUser: (body: Omit<UserProfile, "financial_year">) =>
    request<{ message: string; user: UserProfile }>("/users", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getUser: (userId: string) =>
    request<UserProfile>(`/users/${userId}`),

  // Income
  getIncome: (userId: string, fy = "2025-26") =>
    request<IncomeSummary>(`/income/${userId}?financial_year=${fy}`),

  getUploadHistory: (userId: string) =>
    request<{ user_id: string; uploads: UploadHistory[]; total_files: number }>(
      `/upload/history/${userId}`
    ),

  // Tax
  getTax: (userId: string) =>
    request<TaxResult>(`/tax/${userId}`),

  getItr: (userId: string) =>
    request<ItrSummary>(`/tax/${userId}/itr`),

  getDeductions: (userId: string) =>
    request<{ deductions: unknown[]; note?: string }>(`/tax/${userId}/deductions`),

  // Deadlines
  getDeadlines: (userId: string) =>
    request<DeadlinesResult>(`/deadlines/${userId}`),

  // Chat
  chat: (userId: string, message: string) =>
    request<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, message }),
    }),

  // Upload (multipart)
  uploadPdfs: async (userId: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await fetch(`${BASE}/upload/${userId}`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail ?? "Upload failed");
    }
    return res.json();
  },

  // Health check
  health: () => fetch(`${BASE.replace("/api/v1", "")}/health`).then((r) => r.json()),
};
