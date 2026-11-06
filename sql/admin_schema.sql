-- ============================================
-- REGULASPHERE ADMIN SCHEMA
-- Nexus SafeSphere Technologies Limited
-- ============================================

-- ============================================
-- DROP TABLES (For clean re-install if needed)
-- ============================================
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
DROP TABLE IF EXISTS verification_requests CASCADE;
DROP TABLE IF EXISTS admin_activities CASCADE;
DROP TABLE IF EXISTS system_alerts CASCADE;
DROP TABLE IF EXISTS ai_training_reviews CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions JSONB DEFAULT '[
    "view_dashboard",
    "manage_users",
    "manage_businesses",
    "manage_consultants",
    "review_documents",
    "manage_obligations",
    "moderate_marketplace",
    "view_reports",
    "manage_alerts",
    "manage_ai",
    "view_audit_logs",
    "manage_settings"
  ]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE platform_settings (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_name TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VERIFICATION REQUESTS TABLE
-- ============================================
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('business', 'consultant', 'document')),
  entity_id UUID NOT NULL,
  entity_name TEXT,
  submitted_by UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_review')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  review_notes TEXT
);

-- ============================================
-- ADMIN ACTIVITIES TABLE
-- ============================================
CREATE TABLE admin_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_email TEXT,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SYSTEM ALERTS TABLE
-- ============================================
CREATE TABLE system_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'info' CHECK (alert_type IN ('info', 'warning', 'critical', 'success')),
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'business', 'consultant', 'regulator', 'admin')),
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI TRAINING REVIEWS TABLE
-- ============================================
CREATE TABLE ai_training_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  training_data_id UUID REFERENCES ai_training_data(id) ON DELETE CASCADE,
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'needs_improvement')),
  review_notes TEXT,
  accuracy_score DECIMAL(5,2) CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
  reviewed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES
-- ============================================
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
CREATE INDEX idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX idx_admin_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX idx_admin_audit_logs_entity_type ON admin_audit_logs(entity_type);
CREATE INDEX idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);
CREATE INDEX idx_verification_requests_entity_type ON verification_requests(entity_type);
CREATE INDEX idx_verification_requests_priority ON verification_requests(priority);
CREATE INDEX idx_verification_requests_submitted_at ON verification_requests(submitted_at DESC);
CREATE INDEX idx_admin_activities_created_at ON admin_activities(created_at DESC);
CREATE INDEX idx_admin_activities_admin_id ON admin_activities(admin_id);
CREATE INDEX idx_admin_activities_type ON admin_activities(activity_type);
CREATE INDEX idx_system_alerts_active ON system_alerts(is_active);
CREATE INDEX idx_system_alerts_target ON system_alerts(target_audience);
CREATE INDEX idx_system_alerts_dates ON system_alerts(start_date, end_date);
CREATE INDEX idx_ai_training_reviews_status ON ai_training_reviews(review_status);
CREATE INDEX idx_ai_training_reviews_training_id ON ai_training_reviews(training_data_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR ADMIN TABLES
-- ============================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.jwt() ->> 'email' 
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS "Admins can manage businesses" ON businesses;
CREATE POLICY "Admins can manage businesses" ON businesses
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can manage platform_settings" ON platform_settings;
CREATE POLICY "Admins can manage platform_settings" ON platform_settings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Admin Users Policies
DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
CREATE POLICY "Admins can view admin_users" ON admin_users
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert admin_users" ON admin_users;
CREATE POLICY "Admins can insert admin_users" ON admin_users
  FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update admin_users" ON admin_users;
CREATE POLICY "Admins can update admin_users" ON admin_users
  FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete admin_users" ON admin_users;
CREATE POLICY "Admins can delete admin_users" ON admin_users
  FOR DELETE USING (is_admin());

-- Audit Logs Policies
DROP POLICY IF EXISTS "Admins can view audit_logs" ON admin_audit_logs;
CREATE POLICY "Admins can view audit_logs" ON admin_audit_logs
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert audit_logs" ON admin_audit_logs;
CREATE POLICY "Admins can insert audit_logs" ON admin_audit_logs
  FOR INSERT WITH CHECK (is_admin());

-- Verification Requests Policies
DROP POLICY IF EXISTS "Admins can view verification_requests" ON verification_requests;
CREATE POLICY "Admins can view verification_requests" ON verification_requests
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert verification_requests" ON verification_requests;
CREATE POLICY "Admins can insert verification_requests" ON verification_requests
  FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update verification_requests" ON verification_requests;
CREATE POLICY "Admins can update verification_requests" ON verification_requests
  FOR UPDATE USING (is_admin());

-- Admin Activities Policies
DROP POLICY IF EXISTS "Admins can view admin_activities" ON admin_activities;
CREATE POLICY "Admins can view admin_activities" ON admin_activities
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert admin_activities" ON admin_activities;
CREATE POLICY "Admins can insert admin_activities" ON admin_activities
  FOR INSERT WITH CHECK (is_admin());

-- System Alerts Policies
DROP POLICY IF EXISTS "Everyone can view active alerts" ON system_alerts;
CREATE POLICY "Everyone can view active alerts" ON system_alerts
  FOR SELECT USING (
    is_active = TRUE 
    AND (start_date IS NULL OR start_date <= NOW()) 
    AND (end_date IS NULL OR end_date >= NOW())
    AND (target_audience = 'all' OR target_audience = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage system_alerts" ON system_alerts;
CREATE POLICY "Admins can manage system_alerts" ON system_alerts
  FOR ALL USING (is_admin());

-- AI Training Reviews Policies
DROP POLICY IF EXISTS "Admins can view training_reviews" ON ai_training_reviews;
CREATE POLICY "Admins can view training_reviews" ON ai_training_reviews
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert training_reviews" ON ai_training_reviews;
CREATE POLICY "Admins can insert training_reviews" ON ai_training_reviews
  FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update training_reviews" ON ai_training_reviews;
CREATE POLICY "Admins can update training_reviews" ON ai_training_reviews
  FOR UPDATE USING (is_admin());

-- ============================================
-- ADMIN FUNCTIONS
-- ============================================

-- Get admin dashboard overview statistics
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_businesses BIGINT,
  total_consultants BIGINT,
  total_regulators BIGINT,
  total_obligations BIGINT,
  pending_verifications BIGINT,
  active_documents BIGINT,
  total_reports BIGINT,
  active_alerts BIGINT,
  avg_compliance_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM businesses) AS total_businesses,
    (SELECT COUNT(*) FROM consultants) AS total_consultants,
    (SELECT COUNT(*) FROM users WHERE user_type = 'Regulator') AS total_regulators,
    (SELECT COUNT(*) FROM obligations) AS total_obligations,
    (SELECT COUNT(*) FROM verification_requests WHERE status = 'pending') AS pending_verifications,
    (SELECT COUNT(*) FROM documents WHERE verification_status = 'Pending') AS active_documents,
    (SELECT COUNT(*) FROM compliance_reports) AS total_reports,
    (SELECT COUNT(*) FROM alerts WHERE severity IN ('Critical', 'High')) AS active_alerts,
    (SELECT AVG(calculate_compliance_score(id)) FROM businesses) AS avg_compliance_score;
END;
$$ LANGUAGE plpgsql;

-- Get recent admin activities
CREATE OR REPLACE FUNCTION get_recent_admin_activities(p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  admin_email TEXT,
  activity_type TEXT,
  description TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    aa.id,
    aa.admin_email,
    aa.activity_type,
    aa.description,
    aa.created_at
  FROM admin_activities aa
  ORDER BY aa.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get pending verification requests
CREATE OR REPLACE FUNCTION get_pending_verifications()
RETURNS TABLE (
  id UUID,
  entity_type TEXT,
  entity_name TEXT,
  submitted_at TIMESTAMPTZ,
  priority TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vr.id,
    vr.entity_type,
    vr.entity_name,
    vr.submitted_at,
    vr.priority,
    vr.status
  FROM verification_requests vr
  WHERE vr.status IN ('pending', 'needs_review')
  ORDER BY 
    CASE vr.priority 
      WHEN 'urgent' THEN 1 
      WHEN 'high' THEN 2 
      WHEN 'normal' THEN 3 
      WHEN 'low' THEN 4 
    END,
    vr.submitted_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Get user growth trend
CREATE OR REPLACE FUNCTION get_user_growth_trend(p_months INTEGER DEFAULT 6)
RETURNS TABLE (
  month TEXT,
  new_users BIGINT,
  total_users BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH monthly_counts AS (
    SELECT 
      DATE_TRUNC('month', created_at) AS month_start,
      COUNT(*) AS new_users_count
    FROM users
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
$$ LANGUAGE plpgsql;

-- Get document verification stats
CREATE OR REPLACE FUNCTION get_document_verification_stats()
RETURNS TABLE (
  status TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.verification_status,
    COUNT(*) AS count
  FROM documents d
  GROUP BY d.verification_status
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at for admin tables
DROP TRIGGER IF EXISTS admin_users_updated_at ON admin_users;
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS system_alerts_updated_at ON system_alerts;
CREATE TRIGGER system_alerts_updated_at
  BEFORE UPDATE ON system_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Log admin activities automatically
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_activities (admin_id, admin_email, activity_type, description, metadata)
  VALUES (
    NEW.reviewed_by,
    (SELECT email FROM admin_users WHERE id = NEW.reviewed_by),
    'Verification Review',
    'Reviewed ' || NEW.entity_type || ': ' || NEW.entity_name,
    jsonb_build_object(
      'verification_request_id', NEW.id,
      'entity_type', NEW.entity_type,
      'entity_id', NEW.entity_id,
      'old_status', OLD.status,
      'new_status', NEW.status
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_verification_review ON verification_requests;
CREATE TRIGGER log_verification_review
  AFTER UPDATE OF status ON verification_requests
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION log_admin_activity();

-- ============================================
-- SEED ADMIN USER
-- ============================================
INSERT INTO admin_users (email, full_name, role)
VALUES 
  ('nexussafesphere@outlook.com', 'Nexus SafeSphere Admin', 'super_admin'),
  ('nexusafesphere@outlook.com', 'Nexus SafeSphere Support', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO authenticated, service_role;
GRANT SELECT ON admin_users TO authenticated;
GRANT SELECT, INSERT ON admin_audit_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON verification_requests TO authenticated;
GRANT SELECT, INSERT ON admin_activities TO authenticated;
GRANT SELECT ON system_alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ai_training_reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE ON platform_settings TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- ============================================
-- ADMIN SCHEMA COMPLETE
-- ============================================