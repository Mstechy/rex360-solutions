-- Run once in the Supabase SQL editor.
-- Stores anonymous activity only; never send form fields, email, phone, or payment data here.
CREATE TABLE IF NOT EXISTS public.site_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  visitor_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('page_view', 'click')),
  event_label text,
  page_path text NOT NULL
);

CREATE INDEX IF NOT EXISTS site_events_created_at_idx ON public.site_events (created_at DESC);
CREATE INDEX IF NOT EXISTS site_events_visitor_id_idx ON public.site_events (visitor_id);

ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can record anonymous analytics"
  ON public.site_events FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- The present dashboard uses the anon Supabase key. This policy exposes only
-- anonymous paths/click labels, never client or payment records.
CREATE POLICY "Dashboard can read anonymous analytics"
  ON public.site_events FOR SELECT TO anon, authenticated
  USING (true);
