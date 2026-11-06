-- RegulaSphere existing-database migration
-- Apply after taking a database backup. This migration does not drop tables.

-- Supabase Auth owns credentials. Remove the obsolete plaintext credential column.
ALTER TABLE IF EXISTS public.users DROP COLUMN IF EXISTS password_hash;

-- Non-recursive role helpers for RLS policies.
CREATE OR REPLACE FUNCTION public.current_user_type()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_type FROM public.users WHERE id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.current_user_type() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_type() TO authenticated;

CREATE OR REPLACE FUNCTION public.current_user_email()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = auth
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.current_user_email() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_email() TO authenticated;

-- Prevent self-service role or identity changes.
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND user_type = public.current_user_type()
    AND email = public.current_user_email()
  );

DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Replace recursive regulator policies with the role helper.
DROP POLICY IF EXISTS "Regulators can view all users" ON public.users;
CREATE POLICY "Regulators can view all users" ON public.users
  FOR SELECT USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can view all businesses" ON public.businesses;
CREATE POLICY "Regulators can view all businesses" ON public.businesses
  FOR SELECT USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can view all consultants" ON public.consultants;
CREATE POLICY "Regulators can view all consultants" ON public.consultants
  FOR SELECT USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can view all obligations" ON public.obligations;
CREATE POLICY "Regulators can view all obligations" ON public.obligations
  FOR SELECT USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can view all documents" ON public.documents;
CREATE POLICY "Regulators can view all documents" ON public.documents
  FOR SELECT USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can view all assignments" ON public.consultant_assignments;
CREATE POLICY "Regulators can view all assignments" ON public.consultant_assignments
  FOR SELECT USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can manage alerts" ON public.alerts;
CREATE POLICY "Regulators can manage alerts" ON public.alerts
  FOR ALL USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can view all agent activities" ON public.agent_activities;
CREATE POLICY "Regulators can view all agent activities" ON public.agent_activities
  FOR SELECT USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can view all chat logs" ON public.chat_logs;
CREATE POLICY "Regulators can view all chat logs" ON public.chat_logs
  FOR SELECT USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can view all reports" ON public.compliance_reports;
CREATE POLICY "Regulators can view all reports" ON public.compliance_reports
  FOR SELECT USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can manage knowledge" ON public.regulatory_obligations;
CREATE POLICY "Regulators can manage knowledge" ON public.regulatory_obligations
  FOR ALL USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can manage knowledge base" ON public.regulatory_knowledge;
CREATE POLICY "Regulators can manage knowledge base" ON public.regulatory_knowledge
  FOR ALL USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can manage sector requirements" ON public.sector_requirements;
CREATE POLICY "Regulators can manage sector requirements" ON public.sector_requirements
  FOR ALL USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can manage penalty structures" ON public.penalty_structures;
CREATE POLICY "Regulators can manage penalty structures" ON public.penalty_structures
  FOR ALL USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can view training data" ON public.ai_training_data;
CREATE POLICY "Regulators can view training data" ON public.ai_training_data
  FOR SELECT USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can manage training data" ON public.ai_training_data;
CREATE POLICY "Regulators can manage training data" ON public.ai_training_data
  FOR ALL USING (public.current_user_type() = 'Regulator');

DROP POLICY IF EXISTS "Regulators can manage regulatory updates" ON public.regulatory_updates;
CREATE POLICY "Regulators can manage regulatory updates" ON public.regulatory_updates
  FOR ALL USING (public.current_user_type() = 'Regulator');

-- Harden the admin role helper against search_path hijacking.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = auth.jwt() ->> 'email'
      AND is_active = TRUE
  );
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Keep admin dashboard growth output compatible with its BIGINT contract.
CREATE OR REPLACE FUNCTION public.get_user_growth_trend(p_months INTEGER DEFAULT 6)
RETURNS TABLE (
  month TEXT,
  new_users BIGINT,
  total_users BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH monthly_counts AS (
    SELECT
      DATE_TRUNC('month', created_at) AS month_start,
      COUNT(*)::BIGINT AS new_users_count
    FROM public.users
    WHERE created_at >= NOW() - (p_months || ' months')::INTERVAL
    GROUP BY DATE_TRUNC('month', created_at)
  )
  SELECT
    TO_CHAR(month_start, 'Mon YYYY') AS month,
    new_users_count AS new_users,
    SUM(new_users_count) OVER (ORDER BY month_start)::BIGINT AS total_users
  FROM monthly_counts
  ORDER BY month_start ASC;
END;
$$;
