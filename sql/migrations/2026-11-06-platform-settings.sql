CREATE TABLE IF NOT EXISTS public.platform_settings (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.platform_settings (singleton, settings)
VALUES (
  TRUE,
  '{
    "platform_name": "RegulaSphere",
    "support_email": "nexusafesphere@outlook.com",
    "admin_email": "nexussafesphere@outlook.com",
    "auto_verify_businesses": false,
    "auto_verify_consultants": false,
    "email_notifications": true,
    "push_notifications": true,
    "maintenance_mode": false,
    "ai_enabled": true,
    "max_file_size": 10,
    "default_language": "English"
  }'::jsonb
)
ON CONFLICT (singleton) DO NOTHING;

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage platform_settings" ON public.platform_settings;
CREATE POLICY "Admins can manage platform_settings" ON public.platform_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT, INSERT, UPDATE ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;