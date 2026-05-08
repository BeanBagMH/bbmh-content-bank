-- Fix for Ideas table constraint error
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'format') THEN
        ALTER TABLE public.ideas ALTER COLUMN format DROP NOT NULL;
    END IF;
END $$;

-- Ensure all tables exist and have correct schema
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed an audit user if it doesn't exist
INSERT INTO public.team_members (id, email, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'audit@bbmh.com', 'Audit Master', 'Admin')
ON CONFLICT (email) DO NOTHING;
