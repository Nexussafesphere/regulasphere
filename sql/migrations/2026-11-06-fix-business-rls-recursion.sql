CREATE OR REPLACE FUNCTION public.current_user_business_ids()
RETURNS SETOF UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
  SELECT businesses.id
  FROM public.businesses
  WHERE businesses.user_id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.current_user_business_ids() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_business_ids() TO authenticated;

DROP POLICY IF EXISTS "Admins can manage businesses" ON public.businesses;
CREATE POLICY "Admins can manage businesses" ON public.businesses
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Businesses can view own assignments" ON public.consultant_assignments;
CREATE POLICY "Businesses can view own assignments" ON public.consultant_assignments
  FOR SELECT TO authenticated
  USING (business_id IN (SELECT public.current_user_business_ids()));

DROP POLICY IF EXISTS "Businesses can create assignments" ON public.consultant_assignments;
CREATE POLICY "Businesses can create assignments" ON public.consultant_assignments
  FOR INSERT TO authenticated
  WITH CHECK (business_id IN (SELECT public.current_user_business_ids()));