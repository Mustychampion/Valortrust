CREATE TABLE IF NOT EXISTS "public"."site_settings" (
    "key" text NOT NULL,
    "value" jsonb NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("key")
);

ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON "public"."site_settings"
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated update access" ON "public"."site_settings"
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

INSERT INTO "public"."site_settings" ("key", "value") VALUES
    ('theme_color', '"blue"'),
    ('enable_snow', 'false'),
    ('maintenance_mode', 'false'),
    ('welcome_message', '"Welcome to my portfolio!"')
ON CONFLICT ("key") DO NOTHING;
