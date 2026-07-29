CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  quantity integer NOT NULL CHECK (quantity > 0),
  guests jsonb NOT NULL,
  total_usd integer NOT NULL,
  contact_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','expired','failed')),
  stripe_session_id text UNIQUE,
  stripe_payment_intent text,
  paid_at timestamptz,
  email_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX bookings_status_idx ON public.bookings (status);
CREATE INDEX bookings_stripe_session_idx ON public.bookings (stripe_session_id);

GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: bookings are only ever read/written by the
-- server (server fn for create, webhook for update). service_role bypasses RLS.

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();