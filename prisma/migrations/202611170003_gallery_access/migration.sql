ALTER TABLE public."GalleryItem" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public."GalleryItem" FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON public."GalleryItem" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON public."GalleryItem" FROM authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'savelanded_app') THEN
    GRANT SELECT, INSERT, DELETE ON public."GalleryItem" TO savelanded_app;
    CREATE POLICY savelanded_server_access ON public."GalleryItem"
      TO savelanded_app USING (true) WITH CHECK (true);
  END IF;
END $$;
