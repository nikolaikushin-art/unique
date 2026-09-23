import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for Unique Detailing (project flqgrcmevbjavafppqmh).
 *
 * Frontend uses the anon / publishable key only. Set on the host:
 *   VITE_SUPABASE_URL=https://flqgrcmevbjavafppqmh.supabase.co
 *   VITE_SUPABASE_ANON_KEY=<publishable or anon key>
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

export type Lead = {
  name?: string;
  phone?: string;
  email?: string;
  car?: string;
  service?: string;
  comment?: string;
};

export type SubmitResult = { ok: true; id?: string } | { ok: false; error: string };

export type PublicService = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  base_price: number | null;
  duration_minutes: number | null;
};

export type PublicStaff = {
  id: string;
  full_name: string;
  role: string | null;
  experience_years: number | null;
  profile_photo_r2_key: string | null;
};

function splitCar(car?: string): { brand: string | null; model: string | null } {
  if (!car?.trim()) return { brand: null, model: null };
  const parts = car.trim().split(/\s+/);
  if (parts.length === 1) return { brand: parts[0], model: null };
  return { brand: parts[0], model: parts.slice(1).join(" ") };
}

/**
 * Inserts a website contact-form lead via SECURITY DEFINER RPC
 * `submit_website_lead` (maps to public.leads with source='website').
 */
export async function submitLead(lead: Lead): Promise<SubmitResult> {
  if (!supabase) return { ok: false, error: "supabase_not_configured" };

  const { brand, model } = splitCar(lead.car);
  const notes = [
    lead.service ? `Услуга: ${lead.service}` : null,
    lead.comment ? `Комментарий: ${lead.comment}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const { data, error } = await supabase.rpc("submit_website_lead", {
    p_full_name: lead.name?.trim() || "Без имени",
    p_phone: lead.phone?.trim() || null,
    p_email: lead.email?.trim() || null,
    p_car_brand: brand,
    p_car_model: model,
    p_notes: notes || null,
  });

  if (error) return { ok: false, error: error.message };

  // Best-effort studio notification — never fails the form UX.
  try {
    const notify = await supabase.functions.invoke("send-notification", {
      body: {
        type: "website_lead",
        to: "info@uniquedetailing.ru",
        lead: {
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          car: lead.car,
          service: lead.service,
          comment: lead.comment,
          id: data,
        },
      },
    });
    void notify;
  } catch {
    /* ignore email/notify failures */
  }

  return {
    ok: true,
    id: typeof data === "string" ? data : data != null ? String(data) : undefined,
  };
}

export async function fetchPublicServices(): Promise<PublicService[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("services")
    .select("id,name,description,category,base_price,duration_minutes")
    .eq("is_active", true)
    .order("name");
  if (error || !data) return [];
  return data as PublicService[];
}

export async function fetchPublicStaff(): Promise<PublicStaff[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("staff")
    .select("id,full_name,role,experience_years,profile_photo_r2_key")
    .eq("is_active", true)
    .order("full_name");
  if (error || !data) return [];
  return data as PublicStaff[];
}
