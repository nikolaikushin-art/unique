-- Public website access for Unique Detailing (uniquedetailing.ru)
-- Safe additive policies — does not alter CRM staff policies.

CREATE OR REPLACE FUNCTION public.submit_website_lead(
  p_full_name text,
  p_phone text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_car_brand text DEFAULT NULL,
  p_car_model text DEFAULT NULL,
  p_notes text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF p_full_name IS NULL OR length(trim(p_full_name)) = 0 THEN
    RAISE EXCEPTION 'full_name is required';
  END IF;
  INSERT INTO public.leads (full_name, phone, email, source, status, car_brand, car_model, notes)
  VALUES (
    trim(p_full_name),
    NULLIF(trim(p_phone), ''),
    NULLIF(trim(p_email), ''),
    'website',
    'new',
    NULLIF(trim(p_car_brand), ''),
    NULLIF(trim(p_car_model), ''),
    NULLIF(trim(p_notes), '')
  )
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_website_lead(text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_website_lead(text, text, text, text, text, text) TO anon, authenticated;

DROP POLICY IF EXISTS "public can insert website leads" ON public.leads;
CREATE POLICY "public can insert website leads"
  ON public.leads
  FOR INSERT
  TO public
  WITH CHECK (source = 'website');

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon can read active services" ON public.services;
CREATE POLICY "anon can read active services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon can read active packages" ON public.service_packages;
CREATE POLICY "anon can read active packages"
  ON public.service_packages
  FOR SELECT
  TO anon, authenticated
  USING (COALESCE(is_active, true) = true);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon can read active staff" ON public.staff;
CREATE POLICY "anon can read active staff"
  ON public.staff
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon can read public studio settings" ON public.studio_settings;
CREATE POLICY "anon can read public studio settings"
  ON public.studio_settings
  FOR SELECT
  TO anon, authenticated
  USING (key = ANY (ARRAY['storage_config', 'public_site', 'company_profile']));
