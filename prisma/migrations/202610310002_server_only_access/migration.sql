-- Customer and admin records are accessed through the server, not Supabase's browser API.
-- Provision the savelanded_app login separately; never put its password in migrations.
DO $$
DECLARE
  app_table TEXT;
  browser_role TEXT;
BEGIN
  FOREACH app_table IN ARRAY ARRAY['Admin','ShippingStatus','Shipment','Milestone','Enquiry','Knowledge','AuditLog','RateLimit','EmailJob'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', app_table);
    EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC', app_table);
    FOREACH browser_role IN ARRAY ARRAY['anon','authenticated'] LOOP
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = browser_role) THEN
        EXECUTE format('REVOKE ALL ON public.%I FROM %I', app_table, browser_role);
      END IF;
    END LOOP;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'savelanded_app') THEN
      IF app_table IN ('Milestone','AuditLog') THEN
        EXECUTE format('GRANT SELECT, INSERT ON public.%I TO savelanded_app', app_table);
      ELSE
        EXECUTE format('GRANT SELECT, INSERT, UPDATE ON public.%I TO savelanded_app', app_table);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=app_table AND policyname='savelanded_server_access') THEN
        EXECUTE format('CREATE POLICY savelanded_server_access ON public.%I TO savelanded_app USING (true) WITH CHECK (true)', app_table);
      END IF;
    END IF;
  END LOOP;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'savelanded_app') THEN
    GRANT USAGE ON SCHEMA public TO savelanded_app;
  END IF;
END $$;
ALTER TABLE "_savelanded_migrations" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "_savelanded_migrations" FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON "_savelanded_migrations" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON "_savelanded_migrations" FROM authenticated;
  END IF;
END $$;
