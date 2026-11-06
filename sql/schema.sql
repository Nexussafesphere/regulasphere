-- ============================================
-- REGULASPHERE PRODUCTION DATABASE SCHEMA
-- Nexus SafeSphere Technologies Limited
-- ============================================

-- ============================================
-- ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- DROP TABLES (For clean re-install if needed)
-- ============================================
DROP TABLE IF EXISTS compliance_reports CASCADE;
DROP TABLE IF EXISTS chat_logs CASCADE;
DROP TABLE IF EXISTS agent_activities CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS consultant_assignments CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS obligations CASCADE;
DROP TABLE IF EXISTS consultants CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS regulatory_obligations CASCADE;
DROP TABLE IF EXISTS regulatory_updates CASCADE;
DROP TABLE IF EXISTS sector_requirements CASCADE;
DROP TABLE IF EXISTS penalty_structures CASCADE;
DROP TABLE IF EXISTS regulatory_knowledge CASCADE;
DROP TABLE IF EXISTS ai_training_data CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('Business', 'Consultant', 'Regulator')),
  full_name TEXT NOT NULL,
  phone TEXT,
  preferred_language TEXT DEFAULT 'English' CHECK (preferred_language IN ('English', 'Yoruba', 'Hausa', 'Igbo', 'Pidgin')),
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- BUSINESSES TABLE
-- ============================================
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  rc_number TEXT UNIQUE,
  tin TEXT UNIQUE,
  sector TEXT NOT NULL CHECK (sector IN ('Fintech', 'Healthcare', 'Manufacturing', 'Agriculture', 'Trading', 'Technology', 'Construction', 'Education', 'Other')),
  employee_count INTEGER DEFAULT 0,
  annual_revenue TEXT CHECK (annual_revenue IN ('Under 25M', '25M-100M', '100M-500M', 'Over 500M')),
  data_processing BOOLEAN DEFAULT FALSE,
  data_subjects_count INTEGER DEFAULT 0,
  has_sensitive_data BOOLEAN DEFAULT FALSE,
  has_cross_border_transfer BOOLEAN DEFAULT FALSE,
  has_data_protection_officer BOOLEAN DEFAULT FALSE,
  dpco_engaged BOOLEAN DEFAULT FALSE,
  dpco_name TEXT,
  has_foreign_operations BOOLEAN DEFAULT FALSE,
  is_fintech BOOLEAN DEFAULT FALSE,
  uses_ai BOOLEAN DEFAULT FALSE,
  ai_systems_description TEXT,
  address TEXT,
  state TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CONSULTANTS TABLE
-- ============================================
CREATE TABLE consultants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  specialization TEXT[],
  years_experience INTEGER DEFAULT 0,
  certifications TEXT[],
  dpco_license_number TEXT UNIQUE,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  bio TEXT,
  profile_image_url TEXT,
  availability BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- OBLIGATIONS TABLE
-- ============================================
CREATE TABLE obligations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  regulator TEXT NOT NULL CHECK (regulator IN ('NDPC', 'NITDA', 'CAC', 'FIRS', 'CBN', 'SEC', 'PENCOM', 'ITF', 'NSITF', 'NAFDAC')),
  description TEXT,
  legal_basis TEXT,
  deadline DATE,
  penalty TEXT,
  category TEXT CHECK (category IN ('Tax', 'Data Protection', 'Pension', 'Licensing', 'Employment', 'CAC', 'AI Governance')),
  priority TEXT CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Overdue', 'Under Review')),
  remediation_steps TEXT[],
  ai_notes TEXT,
  assigned_consultant_id UUID REFERENCES consultants(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  obligation_id UUID REFERENCES obligations(id) ON DELETE SET NULL,
  document_name TEXT NOT NULL,
  document_type TEXT,
  file_url TEXT,
  file_size INTEGER,
  file_mime_type TEXT,
  upload_date TIMESTAMP DEFAULT NOW(),
  verification_status TEXT DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Verified', 'Rejected', 'Needs Review')),
  verified_by UUID REFERENCES consultants(id) ON DELETE SET NULL,
  verification_date TIMESTAMP,
  verification_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CONSULTANT ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE consultant_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES consultants(id) ON DELETE CASCADE,
  obligation_id UUID REFERENCES obligations(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Cancelled')),
  assigned_date TIMESTAMP DEFAULT NOW(),
  completed_date TIMESTAMP,
  notes TEXT
);

-- ============================================
-- ALERTS TABLE
-- ============================================
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  regulator TEXT,
  summary TEXT,
  action_required TEXT,
  deadline DATE,
  affected_sectors TEXT[],
  severity TEXT CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  is_ai_generated BOOLEAN DEFAULT FALSE,
  source_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- AGENT ACTIVITIES TABLE
-- ============================================
CREATE TABLE agent_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  activity_type TEXT CHECK (activity_type IN ('Analysis', 'Alert', 'Recommendation', 'Risk Assessment', 'Document Check', 'Scan')),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CHAT LOGS TABLE
-- ============================================
CREATE TABLE chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_message TEXT,
  ai_response TEXT,
  language_used TEXT DEFAULT 'English',
  context_used TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- COMPLIANCE REPORTS TABLE
-- ============================================
CREATE TABLE compliance_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  report_date DATE DEFAULT CURRENT_DATE,
  overall_score INTEGER,
  summary TEXT,
  recommendations TEXT[],
  verified_by_consultant BOOLEAN DEFAULT FALSE,
  consultant_id UUID REFERENCES consultants(id) ON DELETE SET NULL,
  report_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- REGULATORY KNOWLEDGE BASE TABLE
-- ============================================
CREATE TABLE regulatory_obligations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regulator TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  legal_basis TEXT NOT NULL,
  deadline_type TEXT NOT NULL,
  deadline_value TEXT,
  penalty TEXT NOT NULL,
  penalty_type TEXT,
  penalty_amount TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  remediation_steps TEXT[],
  applicable_sectors TEXT[],
  minimum_employees INTEGER DEFAULT 0,
  trigger_conditions JSONB,
  source_url TEXT,
  source_document TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- REGULATORY UPDATES TABLE (For Monitoring)
-- ============================================
CREATE TABLE regulatory_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regulator TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  action_required TEXT,
  effective_date DATE,
  deadline_date DATE,
  affected_sectors TEXT[],
  severity TEXT,
  source_url TEXT,
  is_ai_detected BOOLEAN DEFAULT FALSE,
  detected_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SECTOR REQUIREMENTS TABLE
-- ============================================
CREATE TABLE sector_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector TEXT NOT NULL,
  regulator TEXT NOT NULL,
  requirement TEXT NOT NULL,
  legal_basis TEXT,
  deadline TEXT,
  penalty TEXT,
  priority TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PENALTY STRUCTURES TABLE
-- ============================================
CREATE TABLE penalty_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regulator TEXT NOT NULL,
  violation TEXT NOT NULL,
  fine_type TEXT NOT NULL,
  fine_amount TEXT,
  fine_percentage TEXT,
  daily_amount TEXT,
  legal_basis TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- REGULATORY KNOWLEDGE TABLE (Remediation Checklists)
-- ============================================
CREATE TABLE regulatory_knowledge (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regulator TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  legal_basis TEXT,
  category TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- AI TRAINING DATA TABLE
-- ============================================
CREATE TABLE ai_training_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt TEXT NOT NULL,
  completion TEXT NOT NULL,
  category TEXT,
  language TEXT DEFAULT 'English',
  quality_score INTEGER DEFAULT 5,
  is_validated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_sector ON businesses(sector);
CREATE INDEX idx_businesses_state ON businesses(state);
CREATE INDEX idx_obligations_business_id ON obligations(business_id);
CREATE INDEX idx_obligations_regulator ON obligations(regulator);
CREATE INDEX idx_obligations_deadline ON obligations(deadline);
CREATE INDEX idx_obligations_status ON obligations(status);
CREATE INDEX idx_obligations_category ON obligations(category);
CREATE INDEX idx_documents_business_id ON documents(business_id);
CREATE INDEX idx_documents_verification ON documents(verification_status);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_assignments_business_id ON consultant_assignments(business_id);
CREATE INDEX idx_assignments_consultant_id ON consultant_assignments(consultant_id);
CREATE INDEX idx_chat_logs_business_id ON chat_logs(business_id);
CREATE INDEX idx_alerts_regulator ON alerts(regulator);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_deadline ON alerts(deadline);
CREATE INDEX idx_regulatory_obligations_regulator ON regulatory_obligations(regulator);
CREATE INDEX idx_regulatory_obligations_category ON regulatory_obligations(category);
CREATE INDEX idx_regulatory_updates_regulator ON regulatory_updates(regulator);
CREATE INDEX idx_sector_requirements_sector ON sector_requirements(sector);
CREATE INDEX idx_penalty_structures_regulator ON penalty_structures(regulator);
CREATE INDEX idx_regulatory_knowledge_regulator ON regulatory_knowledge(regulator);
CREATE INDEX idx_ai_training_data_category ON ai_training_data(category);
CREATE INDEX idx_ai_training_data_language ON ai_training_data(language);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
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

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data without changing role or identity
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND user_type = public.current_user_type()
    AND email = public.current_user_email()
  );

-- Businesses can view own profile
CREATE POLICY "Businesses can view own profile" ON businesses
  FOR SELECT USING (user_id = auth.uid());

-- Businesses can insert own profile
CREATE POLICY "Businesses can insert own profile" ON businesses
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Businesses can update own profile
CREATE POLICY "Businesses can update own profile" ON businesses
  FOR UPDATE USING (user_id = auth.uid());

-- Businesses can view own obligations
CREATE POLICY "Businesses can view own obligations" ON obligations
  FOR SELECT USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Businesses can update own obligations
CREATE POLICY "Businesses can update own obligations" ON obligations
  FOR UPDATE USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Businesses can view own documents
CREATE POLICY "Businesses can view own documents" ON documents
  FOR SELECT USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Businesses can insert own documents
CREATE POLICY "Businesses can insert own documents" ON documents
  FOR INSERT WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Businesses can view own chat logs
CREATE POLICY "Businesses can view own chat logs" ON chat_logs
  FOR SELECT USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Businesses can insert chat logs
CREATE POLICY "Businesses can insert chat logs" ON chat_logs
  FOR INSERT WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Businesses can view own reports
CREATE POLICY "Businesses can view own reports" ON compliance_reports
  FOR SELECT USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Consultants can view their own profile
CREATE POLICY "Consultants can view own profile" ON consultants
  FOR SELECT USING (user_id = auth.uid());

-- Consultants can update their own profile
CREATE POLICY "Consultants can update own profile" ON consultants
  FOR UPDATE USING (user_id = auth.uid());

-- Consultants can view assigned businesses
CREATE POLICY "Consultants can view assigned businesses" ON businesses
  FOR SELECT USING (
    id IN (
      SELECT business_id FROM consultant_assignments 
      WHERE consultant_id IN (
        SELECT id FROM consultants WHERE user_id = auth.uid()
      )
    )
  );

-- Consultants can view assigned obligations
CREATE POLICY "Consultants can view assigned obligations" ON obligations
  FOR SELECT USING (
    assigned_consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Consultants can update assigned obligations
CREATE POLICY "Consultants can update assigned obligations" ON obligations
  FOR UPDATE USING (
    assigned_consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Consultants can verify documents
CREATE POLICY "Consultants can verify documents" ON documents
  FOR UPDATE USING (
    business_id IN (
      SELECT business_id FROM consultant_assignments 
      WHERE consultant_id IN (
        SELECT id FROM consultants WHERE user_id = auth.uid()
      )
    )
  );

-- Consultants can view their assignments
CREATE POLICY "Consultants can view own assignments" ON consultant_assignments
  FOR SELECT USING (
    consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Regulators can view all businesses (SupTech)
CREATE POLICY "Regulators can view all businesses" ON businesses
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- Regulators can view all obligations
CREATE POLICY "Regulators can view all obligations" ON obligations
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- Regulators can view all documents
CREATE POLICY "Regulators can view all documents" ON documents
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- Regulators can view all reports
CREATE POLICY "Regulators can view all reports" ON compliance_reports
  FOR SELECT USING (
    public.current_user_type() = 'Regulator'
  );

-- Regulators can manage alerts
CREATE POLICY "Regulators can manage alerts" ON alerts
  FOR ALL USING (
    public.current_user_type() = 'Regulator'
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER consultants_updated_at
  BEFORE UPDATE ON consultants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER obligations_updated_at
  BEFORE UPDATE ON obligations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER regulatory_obligations_updated_at
  BEFORE UPDATE ON regulatory_obligations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER regulatory_knowledge_updated_at
  BEFORE UPDATE ON regulatory_knowledge
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- COMPLIANCE FUNCTIONS
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

-- Get upcoming deadlines
CREATE OR REPLACE FUNCTION get_upcoming_deadlines(p_business_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  id UUID,
  title TEXT,
  regulator TEXT,
  deadline DATE,
  priority TEXT,
  status TEXT,
  category TEXT
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
    o.category
  FROM obligations o
  WHERE o.business_id = p_business_id
    AND o.deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days
    AND o.status NOT IN ('Completed', 'Overdue')
  ORDER BY o.deadline ASC;
END;
$$ LANGUAGE plpgsql;

-- Get overdue obligations
CREATE OR REPLACE FUNCTION get_overdue_obligations(p_business_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  regulator TEXT,
  deadline DATE,
  priority TEXT,
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
    o.penalty
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

-- ============================================
-- SCHEMA COMPLETE
-- ============================================