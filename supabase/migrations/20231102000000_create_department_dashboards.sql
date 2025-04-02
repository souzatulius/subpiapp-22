
-- Create a table to store department-specific dashboard configurations
CREATE TABLE IF NOT EXISTS public.department_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department VARCHAR NOT NULL,
  view_type VARCHAR NOT NULL DEFAULT 'dashboard',
  cards_config TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create index on department and view_type for faster lookups
CREATE INDEX IF NOT EXISTS idx_department_dashboards_department ON public.department_dashboards(department);
CREATE INDEX IF NOT EXISTS idx_department_dashboards_view_type ON public.department_dashboards(view_type);

-- Add RLS policies
ALTER TABLE public.department_dashboards ENABLE ROW LEVEL SECURITY;

-- Everyone can view dashboard configurations
CREATE POLICY "Anyone can view dashboard configurations"
ON public.department_dashboards
FOR SELECT
USING (true);

-- Only authenticated users can insert/update/delete dashboard configurations
CREATE POLICY "Authenticated users can manage dashboard configurations"
ON public.department_dashboards
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
