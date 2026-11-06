-- ============================================
-- REGULASPHERE RLS POLICIES & FUNCTIONS
-- Nexus SafeSphere Technologies Limited
-- ============================================

-- ============================================
-- PART 1: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE penalty_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_data ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 2: USERS TABLE POLICIES
-- ============================================

-- Users can view their own data
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

DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND user_type = public.current_user_type()
    AND email = public.current_user_email()
  );

-- Users can insert their own record
DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Regulators can view all users (for oversight)
DROP POLICY IF EXISTS "Regulators can view all users" ON users;
CREATE POLICY "Regulators can view all users" ON users
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 3: BUSINESSES TABLE POLICIES
-- ============================================

-- Businesses can view their own profile
DROP POLICY IF EXISTS "Businesses can view own profile" ON businesses;
CREATE POLICY "Businesses can view own profile" ON businesses
  FOR SELECT USING (user_id = auth.uid());

-- Businesses can insert their own profile
DROP POLICY IF EXISTS "Businesses can insert own profile" ON businesses;
CREATE POLICY "Businesses can insert own profile" ON businesses
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Businesses can update their own profile
DROP POLICY IF EXISTS "Businesses can update own profile" ON businesses;
CREATE POLICY "Businesses can update own profile" ON businesses
  FOR UPDATE USING (user_id = auth.uid());

-- Businesses can delete their own profile
DROP POLICY IF EXISTS "Businesses can delete own profile" ON businesses;
CREATE POLICY "Businesses can delete own profile" ON businesses
  FOR DELETE USING (user_id = auth.uid());

-- Consultants can view assigned businesses
DROP POLICY IF EXISTS "Consultants can view assigned businesses" ON businesses;
CREATE POLICY "Consultants can view assigned businesses" ON businesses
  FOR SELECT USING (
    id IN (
      SELECT business_id FROM consultant_assignments 
      WHERE consultant_id IN (
        SELECT id FROM consultants WHERE user_id = auth.uid()
      )
    )
  );

-- Regulators can view all businesses (SupTech)
DROP POLICY IF EXISTS "Regulators can view all businesses" ON businesses;
CREATE POLICY "Regulators can view all businesses" ON businesses
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 4: CONSULTANTS TABLE POLICIES
-- ============================================

-- Consultants can view their own profile
DROP POLICY IF EXISTS "Consultants can view own profile" ON consultants;
CREATE POLICY "Consultants can view own profile" ON consultants
  FOR SELECT USING (user_id = auth.uid());

-- Consultants can insert their own profile
DROP POLICY IF EXISTS "Consultants can insert own profile" ON consultants;
CREATE POLICY "Consultants can insert own profile" ON consultants
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Consultants can update their own profile
DROP POLICY IF EXISTS "Consultants can update own profile" ON consultants;
CREATE POLICY "Consultants can update own profile" ON consultants
  FOR UPDATE USING (user_id = auth.uid());

-- Businesses can view consultant profiles (for marketplace)
DROP POLICY IF EXISTS "Businesses can view consultant profiles" ON consultants;
CREATE POLICY "Businesses can view consultant profiles" ON consultants
  FOR SELECT USING (
    auth.uid() IS NOT NULL
  );

-- Regulators can view all consultants
DROP POLICY IF EXISTS "Regulators can view all consultants" ON consultants;
CREATE POLICY "Regulators can view all consultants" ON consultants
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 5: OBLIGATIONS TABLE POLICIES
-- ============================================

-- Businesses can view their own obligations
DROP POLICY IF EXISTS "Businesses can view own obligations" ON obligations;
CREATE POLICY "Businesses can view own obligations" ON obligations
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Businesses can insert own obligations
DROP POLICY IF EXISTS "Businesses can insert own obligations" ON obligations;
CREATE POLICY "Businesses can insert own obligations" ON obligations
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Businesses can update own obligations
DROP POLICY IF EXISTS "Businesses can update own obligations" ON obligations;
CREATE POLICY "Businesses can update own obligations" ON obligations
  FOR UPDATE USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Businesses can delete own obligations
DROP POLICY IF EXISTS "Businesses can delete own obligations" ON obligations;
CREATE POLICY "Businesses can delete own obligations" ON obligations
  FOR DELETE USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Consultants can view assigned obligations
DROP POLICY IF EXISTS "Consultants can view assigned obligations" ON obligations;
CREATE POLICY "Consultants can view assigned obligations" ON obligations
  FOR SELECT USING (
    assigned_consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Consultants can update assigned obligations
DROP POLICY IF EXISTS "Consultants can update assigned obligations" ON obligations;
CREATE POLICY "Consultants can update assigned obligations" ON obligations
  FOR UPDATE USING (
    assigned_consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Regulators can view all obligations
DROP POLICY IF EXISTS "Regulators can view all obligations" ON obligations;
CREATE POLICY "Regulators can view all obligations" ON obligations
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 6: DOCUMENTS TABLE POLICIES
-- ============================================

-- Businesses can view their own documents
DROP POLICY IF EXISTS "Businesses can view own documents" ON documents;
CREATE POLICY "Businesses can view own documents" ON documents
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Businesses can insert own documents
DROP POLICY IF EXISTS "Businesses can insert own documents" ON documents;
CREATE POLICY "Businesses can insert own documents" ON documents
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Businesses can update own documents
DROP POLICY IF EXISTS "Businesses can update own documents" ON documents;
CREATE POLICY "Businesses can update own documents" ON documents
  FOR UPDATE USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Businesses can delete own documents
DROP POLICY IF EXISTS "Businesses can delete own documents" ON documents;
CREATE POLICY "Businesses can delete own documents" ON documents
  FOR DELETE USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Consultants can view assigned documents
DROP POLICY IF EXISTS "Consultants can view assigned documents" ON documents;
CREATE POLICY "Consultants can view assigned documents" ON documents
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM consultant_assignments 
      WHERE consultant_id IN (
        SELECT id FROM consultants WHERE user_id = auth.uid()
      )
    )
  );

-- Consultants can verify documents (update)
DROP POLICY IF EXISTS "Consultants can verify documents" ON documents;
CREATE POLICY "Consultants can verify documents" ON documents
  FOR UPDATE USING (
    business_id IN (
      SELECT business_id FROM consultant_assignments 
      WHERE consultant_id IN (
        SELECT id FROM consultants WHERE user_id = auth.uid()
      )
    )
  );

-- Regulators can view all documents
DROP POLICY IF EXISTS "Regulators can view all documents" ON documents;
CREATE POLICY "Regulators can view all documents" ON documents
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 7: CONSULTANT ASSIGNMENTS POLICIES
-- ============================================

-- Businesses can view their own assignments
DROP POLICY IF EXISTS "Businesses can view own assignments" ON consultant_assignments;
CREATE POLICY "Businesses can view own assignments" ON consultant_assignments
  FOR SELECT TO authenticated
  USING (business_id IN (SELECT public.current_user_business_ids()));

-- Businesses can create assignments
DROP POLICY IF EXISTS "Businesses can create assignments" ON consultant_assignments;
CREATE POLICY "Businesses can create assignments" ON consultant_assignments
  FOR INSERT TO authenticated
  WITH CHECK (business_id IN (SELECT public.current_user_business_ids()));

-- Consultants can view their own assignments
DROP POLICY IF EXISTS "Consultants can view own assignments" ON consultant_assignments;
CREATE POLICY "Consultants can view own assignments" ON consultant_assignments
  FOR SELECT USING (
    consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Consultants can update their assignments
DROP POLICY IF EXISTS "Consultants can update own assignments" ON consultant_assignments;
CREATE POLICY "Consultants can update own assignments" ON consultant_assignments
  FOR UPDATE USING (
    consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Regulators can view all assignments
DROP POLICY IF EXISTS "Regulators can view all assignments" ON consultant_assignments;
CREATE POLICY "Regulators can view all assignments" ON consultant_assignments
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 8: ALERTS TABLE POLICIES
-- ============================================

-- Everyone can view alerts
DROP POLICY IF EXISTS "Everyone can view alerts" ON alerts;
CREATE POLICY "Everyone can view alerts" ON alerts
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Regulators can manage alerts
DROP POLICY IF EXISTS "Regulators can manage alerts" ON alerts;
CREATE POLICY "Regulators can manage alerts" ON alerts
  FOR ALL USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 9: AGENT ACTIVITIES POLICIES
-- ============================================

-- Businesses can view their own agent activities
DROP POLICY IF EXISTS "Businesses can view own agent activities" ON agent_activities;
CREATE POLICY "Businesses can view own agent activities" ON agent_activities
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- System can insert agent activities
DROP POLICY IF EXISTS "System can insert agent activities" ON agent_activities;
CREATE POLICY "System can insert agent activities" ON agent_activities
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Regulators can view all agent activities
DROP POLICY IF EXISTS "Regulators can view all agent activities" ON agent_activities;
CREATE POLICY "Regulators can view all agent activities" ON agent_activities
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 10: CHAT LOGS POLICIES
-- ============================================

-- Businesses can view their own chat logs
DROP POLICY IF EXISTS "Businesses can view own chat logs" ON chat_logs;
CREATE POLICY "Businesses can view own chat logs" ON chat_logs
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Businesses can insert chat logs
DROP POLICY IF EXISTS "Businesses can insert chat logs" ON chat_logs;
CREATE POLICY "Businesses can insert chat logs" ON chat_logs
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Regulators can view all chat logs (anonymized)
DROP POLICY IF EXISTS "Regulators can view all chat logs" ON chat_logs;
CREATE POLICY "Regulators can view all chat logs" ON chat_logs
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 11: COMPLIANCE REPORTS POLICIES
-- ============================================

-- Businesses can view their own reports
DROP POLICY IF EXISTS "Businesses can view own reports" ON compliance_reports;
CREATE POLICY "Businesses can view own reports" ON compliance_reports
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Businesses can insert own reports
DROP POLICY IF EXISTS "Businesses can insert own reports" ON compliance_reports;
CREATE POLICY "Businesses can insert own reports" ON compliance_reports
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Consultants can view reports for assigned businesses
DROP POLICY IF EXISTS "Consultants can view assigned reports" ON compliance_reports;
CREATE POLICY "Consultants can view assigned reports" ON compliance_reports
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM consultant_assignments 
      WHERE consultant_id IN (
        SELECT id FROM consultants WHERE user_id = auth.uid()
      )
    )
  );

-- Regulators can view all reports
DROP POLICY IF EXISTS "Regulators can view all reports" ON compliance_reports;
CREATE POLICY "Regulators can view all reports" ON compliance_reports
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 12: REGULATORY KNOWLEDGE POLICIES
-- ============================================

-- Everyone authenticated can view regulatory knowledge
DROP POLICY IF EXISTS "Everyone can view regulatory knowledge" ON regulatory_obligations;
CREATE POLICY "Everyone can view regulatory knowledge" ON regulatory_obligations
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Everyone can view knowledge base" ON regulatory_knowledge;
CREATE POLICY "Everyone can view knowledge base" ON regulatory_knowledge
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Regulators can manage regulatory knowledge
DROP POLICY IF EXISTS "Regulators can manage knowledge" ON regulatory_obligations;
CREATE POLICY "Regulators can manage knowledge" ON regulatory_obligations
  FOR ALL USING (
    public.current_user_type() = 'Regulator'
  );

DROP POLICY IF EXISTS "Regulators can manage knowledge base" ON regulatory_knowledge;
CREATE POLICY "Regulators can manage knowledge base" ON regulatory_knowledge
  FOR ALL USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 13: SECTOR REQUIREMENTS POLICIES
-- ============================================

-- Everyone authenticated can view sector requirements
DROP POLICY IF EXISTS "Everyone can view sector requirements" ON sector_requirements;
CREATE POLICY "Everyone can view sector requirements" ON sector_requirements
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Regulators can manage sector requirements
DROP POLICY IF EXISTS "Regulators can manage sector requirements" ON sector_requirements;
CREATE POLICY "Regulators can manage sector requirements" ON sector_requirements
  FOR ALL USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 14: PENALTY STRUCTURES POLICIES
-- ============================================

-- Everyone authenticated can view penalty structures
DROP POLICY IF EXISTS "Everyone can view penalty structures" ON penalty_structures;
CREATE POLICY "Everyone can view penalty structures" ON penalty_structures
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Regulators can manage penalty structures
DROP POLICY IF EXISTS "Regulators can manage penalty structures" ON penalty_structures;
CREATE POLICY "Regulators can manage penalty structures" ON penalty_structures
  FOR ALL USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 15: AI TRAINING DATA POLICIES
-- ============================================

-- Only regulators can view training data
DROP POLICY IF EXISTS "Regulators can view training data" ON ai_training_data;
CREATE POLICY "Regulators can view training data" ON ai_training_data
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- Regulators can manage training data
DROP POLICY IF EXISTS "Regulators can manage training data" ON ai_training_data;
CREATE POLICY "Regulators can manage training data" ON ai_training_data
  FOR ALL USING (
    public.current_user_type() = 'Regulator'
  );

-- System (service role) can insert training data
DROP POLICY IF EXISTS "System can insert training data" ON ai_training_data;
CREATE POLICY "System can insert training data" ON ai_training_data
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- PART 16: REGULATORY UPDATES POLICIES
-- ============================================

-- Everyone authenticated can view regulatory updates
DROP POLICY IF EXISTS "Everyone can view regulatory updates" ON regulatory_updates;
CREATE POLICY "Everyone can view regulatory updates" ON regulatory_updates
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Regulators can manage regulatory updates
DROP POLICY IF EXISTS "Regulators can manage regulatory updates" ON regulatory_updates;
CREATE POLICY "Regulators can manage regulatory updates" ON regulatory_updates
  FOR ALL USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- PART 17: FUNCTIONS
-- ============================================

-- Calculate compliance score for a business
CREATE OR REPLACE FUNCTION calculate_compliance_score(p_business_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_count INTEGER;
  completed_count INTEGER;
  score INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count 
  FROM obligations 
  WHERE business_id = p_business_id;
  
  SELECT COUNT(*) INTO completed_count 
  FROM obligations 
  WHERE business_id = p_business_id 
  AND status = 'Completed';
  
  IF total_count = 0 THEN
    RETURN 0;
  END IF;
  
  score := (completed_count::DECIMAL / total_count::DECIMAL * 100)::INTEGER;
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Get compliance summary for a business
CREATE OR REPLACE FUNCTION get_compliance_summary(p_business_id UUID)
RETURNS TABLE (
  total_obligations BIGINT,
  completed BIGINT,
  in_progress BIGINT,
  pending BIGINT,
  overdue BIGINT,
  under_review BIGINT,
  compliance_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_obligations,
    COUNT(*) FILTER (WHERE status = 'Completed')::BIGINT AS completed,
    COUNT(*) FILTER (WHERE status = 'In Progress')::BIGINT AS in_progress,
    COUNT(*) FILTER (WHERE status = 'Pending')::BIGINT AS pending,
    COUNT(*) FILTER (WHERE status = 'Overdue')::BIGINT AS overdue,
    COUNT(*) FILTER (WHERE status = 'Under Review')::BIGINT AS under_review,
    calculate_compliance_score(p_business_id) AS compliance_score
  FROM obligations
  WHERE business_id = p_business_id;
END;
$$ LANGUAGE plpgsql;

-- Get upcoming deadlines for a business
CREATE OR REPLACE FUNCTION get_upcoming_deadlines(p_business_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  id UUID,
  title TEXT,
  regulator TEXT,
  deadline DATE,
  priority TEXT,
  status TEXT,
  category TEXT,
  penalty TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id, 
    o.title, 
    o.regulator, 
    o.deadline, 
    o.priority, 
    o.status,
    o.category,
    o.penalty
  FROM obligations o
  WHERE o.business_id = p_business_id
    AND o.deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days
    AND o.status NOT IN ('Completed', 'Overdue')
  ORDER BY o.deadline ASC;
END;
$$ LANGUAGE plpgsql;

-- Get overdue obligations for a business
CREATE OR REPLACE FUNCTION get_overdue_obligations(p_business_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  regulator TEXT,
  deadline DATE,
  priority TEXT,
  penalty TEXT,
  days_overdue INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id, 
    o.title, 
    o.regulator, 
    o.deadline, 
    o.priority,
    o.penalty,
    (CURRENT_DATE - o.deadline)::INTEGER AS days_overdue
  FROM obligations o
  WHERE o.business_id = p_business_id
    AND o.deadline < CURRENT_DATE
    AND o.status NOT IN ('Completed', 'Overdue')
  ORDER BY o.deadline ASC;
END;
$$ LANGUAGE plpgsql;

-- Get sector compliance statistics (for Regulator Dashboard)
CREATE OR REPLACE FUNCTION get_sector_compliance_stats()
RETURNS TABLE (
  sector TEXT,
  total_businesses BIGINT,
  compliant_businesses BIGINT,
  avg_compliance_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.sector,
    COUNT(DISTINCT b.id) AS total_businesses,
    COUNT(DISTINCT CASE WHEN calculate_compliance_score(b.id) >= 80 THEN b.id END) AS compliant_businesses,
    ROUND(AVG(calculate_compliance_score(b.id)), 2) AS avg_compliance_score
  FROM businesses b
  GROUP BY b.sector
  ORDER BY avg_compliance_score ASC;
END;
$$ LANGUAGE plpgsql;

-- Get common violations (for Regulator Dashboard)
CREATE OR REPLACE FUNCTION get_common_violations()
RETURNS TABLE (
  category TEXT,
  violation_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.category,
    COUNT(*) AS violation_count
  FROM obligations o
  WHERE o.status IN ('Overdue', 'Pending')
  GROUP BY o.category
  ORDER BY violation_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Get regulator compliance overview
CREATE OR REPLACE FUNCTION get_regulator_compliance_overview()
RETURNS TABLE (
  regulator TEXT,
  total_obligations BIGINT,
  completed BIGINT,
  overdue BIGINT,
  compliance_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.regulator,
    COUNT(*) AS total_obligations,
    COUNT(*) FILTER (WHERE o.status = 'Completed') AS completed,
    COUNT(*) FILTER (WHERE o.status = 'Overdue') AS overdue,
    ROUND((COUNT(*) FILTER (WHERE o.status = 'Completed')::DECIMAL / COUNT(*)::DECIMAL * 100), 2) AS compliance_rate
  FROM obligations o
  GROUP BY o.regulator
  ORDER BY compliance_rate ASC;
END;
$$ LANGUAGE plpgsql;

-- Get monthly compliance trend
CREATE OR REPLACE FUNCTION get_monthly_compliance_trend(p_months INTEGER DEFAULT 6)
RETURNS TABLE (
  month TEXT,
  avg_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(DATE_TRUNC('month', o.created_at), 'Mon YYYY') AS month,
    ROUND(AVG(calculate_compliance_score(o.business_id)), 2) AS avg_score
  FROM obligations o
  WHERE o.created_at >= NOW() - (p_months || ' months')::INTERVAL
  GROUP BY DATE_TRUNC('month', o.created_at)
  ORDER BY DATE_TRUNC('month', o.created_at) ASC;
END;
$$ LANGUAGE plpgsql;

-- Get documents pending verification for a consultant
CREATE OR REPLACE FUNCTION get_pending_documents_for_consultant(p_consultant_id UUID)
RETURNS TABLE (
  id UUID,
  document_name TEXT,
  document_type TEXT,
  business_name TEXT,
  upload_date TIMESTAMP,
  verification_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.document_name,
    d.document_type,
    b.business_name,
    d.upload_date,
    d.verification_status
  FROM documents d
  JOIN businesses b ON d.business_id = b.id
  WHERE d.verification_status IN ('Pending', 'Needs Review')
    AND d.business_id IN (
      SELECT business_id FROM consultant_assignments 
      WHERE consultant_id = p_consultant_id
    )
  ORDER BY d.upload_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Get business risk assessment
CREATE OR REPLACE FUNCTION get_business_risk_assessment(p_business_id UUID)
RETURNS TABLE (
  risk_level TEXT,
  risk_score INTEGER,
  critical_issues BIGINT,
  high_issues BIGINT,
  overdue_count BIGINT,
  ai_governance_gap BOOLEAN,
  data_protection_gap BOOLEAN
) AS $$
DECLARE
  v_risk_score INTEGER;
  v_risk_level TEXT;
  v_critical BIGINT;
  v_high BIGINT;
  v_overdue BIGINT;
  v_ai_gap BOOLEAN;
  v_data_gap BOOLEAN;
BEGIN
  -- Count critical issues
  SELECT COUNT(*) INTO v_critical
  FROM obligations
  WHERE business_id = p_business_id AND priority = 'Critical' AND status NOT IN ('Completed');
  
  -- Count high issues
  SELECT COUNT(*) INTO v_high
  FROM obligations
  WHERE business_id = p_business_id AND priority = 'High' AND status NOT IN ('Completed');
  
  -- Count overdue
  SELECT COUNT(*) INTO v_overdue
  FROM obligations
  WHERE business_id = p_business_id AND deadline < CURRENT_DATE AND status NOT IN ('Completed', 'Overdue');
  
  -- Check AI governance gap
  SELECT EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = p_business_id AND uses_ai = TRUE
  ) AND EXISTS (
    SELECT 1 FROM obligations 
    WHERE business_id = p_business_id AND category = 'AI Governance' AND status NOT IN ('Completed')
  ) INTO v_ai_gap;
  
  -- Check data protection gap
  SELECT EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = p_business_id AND data_processing = TRUE
  ) AND EXISTS (
    SELECT 1 FROM obligations 
    WHERE business_id = p_business_id AND category = 'Data Protection' AND status NOT IN ('Completed')
  ) INTO v_data_gap;
  
  -- Calculate risk score
  v_risk_score := (v_critical * 20) + (v_high * 10) + (v_overdue * 15);
  IF v_ai_gap THEN v_risk_score := v_risk_score + 25; END IF;
  IF v_data_gap THEN v_risk_score := v_risk_score + 20; END IF;
  
  -- Determine risk level
  IF v_risk_score >= 80 THEN v_risk_level := 'Critical';
  ELSIF v_risk_score >= 50 THEN v_risk_level := 'High';
  ELSIF v_risk_score >= 25 THEN v_risk_level := 'Medium';
  ELSE v_risk_level := 'Low';
  END IF;
  
  RETURN QUERY
  SELECT 
    v_risk_level,
    v_risk_score,
    v_critical,
    v_high,
    v_overdue,
    v_ai_gap,
    v_data_gap;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS businesses_updated_at ON businesses;
CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS consultants_updated_at ON consultants;
CREATE TRIGGER consultants_updated_at
  BEFORE UPDATE ON consultants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS obligations_updated_at ON obligations;
CREATE TRIGGER obligations_updated_at
  BEFORE UPDATE ON obligations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS regulatory_obligations_updated_at ON regulatory_obligations;
CREATE TRIGGER regulatory_obligations_updated_at
  BEFORE UPDATE ON regulatory_obligations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS regulatory_knowledge_updated_at ON regulatory_knowledge;
CREATE TRIGGER regulatory_knowledge_updated_at
  BEFORE UPDATE ON regulatory_knowledge
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-mark overdue obligations
CREATE OR REPLACE FUNCTION auto_mark_overdue()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deadline < CURRENT_DATE AND NEW.status NOT IN ('Completed', 'Overdue') THEN
    NEW.status := 'Overdue';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_mark_overdue_trigger ON obligations;
CREATE TRIGGER auto_mark_overdue_trigger
  BEFORE INSERT OR UPDATE ON obligations
  FOR EACH ROW EXECUTE FUNCTION auto_mark_overdue();

-- Log agent activity when obligation status changes
CREATE OR REPLACE FUNCTION log_obligation_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO agent_activities (business_id, activity_type, description, metadata)
    VALUES (
      NEW.business_id,
      'Recommendation',
      'Obligation status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object(
        'obligation_id', NEW.id,
        'title', NEW.title,
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_obligation_change ON obligations;
CREATE TRIGGER log_obligation_change
  AFTER UPDATE ON obligations
  FOR EACH ROW EXECUTE FUNCTION log_obligation_status_change();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant select on all tables to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant insert/update on specific tables
GRANT INSERT, UPDATE ON users TO authenticated;
GRANT INSERT, UPDATE ON businesses TO authenticated;
GRANT INSERT, UPDATE ON consultants TO authenticated;
GRANT INSERT, UPDATE ON obligations TO authenticated;
GRANT INSERT, UPDATE, DELETE ON documents TO authenticated;
GRANT INSERT, UPDATE ON consultant_assignments TO authenticated;
GRANT INSERT ON chat_logs TO authenticated;
GRANT INSERT, UPDATE ON compliance_reports TO authenticated;
GRANT SELECT, INSERT ON agent_activities TO authenticated;

-- Grant full access to service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- ============================================
-- COMPLETE
-- ============================================