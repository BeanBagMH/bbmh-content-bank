-- Fix for Ideas table constraint error
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'Raw Idea';
ALTER TABLE public.ideas ALTER COLUMN format DROP NOT NULL;

-- Ensure team_members has the correct audit user
INSERT INTO public.team_members (id, email, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'audit@bbmh.com', 'Audit Master', 'Admin')
ON CONFLICT (email) DO UPDATE SET full_name = 'Audit Master';
