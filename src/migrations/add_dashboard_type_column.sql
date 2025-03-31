
-- This migration adds a dashboard_type column to the user_dashboard table
-- to distinguish between different dashboard types (main, communication, etc.)

-- Check if dashboard_type column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_dashboard' 
    AND column_name = 'dashboard_type'
  ) THEN
    ALTER TABLE public.user_dashboard 
    ADD COLUMN dashboard_type VARCHAR(50) NOT NULL DEFAULT 'dashboard';
    
    -- Add a comment for documentation
    COMMENT ON COLUMN public.user_dashboard.dashboard_type IS 'Type of dashboard (dashboard, communication, etc.)';
    
    -- Add a constraint to limit possible values
    ALTER TABLE public.user_dashboard 
    ADD CONSTRAINT valid_dashboard_types 
    CHECK (dashboard_type IN ('dashboard', 'communication'));
    
    -- Update primary key to include dashboard_type
    ALTER TABLE public.user_dashboard 
    DROP CONSTRAINT IF EXISTS user_dashboard_pkey;
    
    ALTER TABLE public.user_dashboard 
    ADD CONSTRAINT user_dashboard_pkey 
    PRIMARY KEY (user_id, dashboard_type);
  END IF;
END
$$;
