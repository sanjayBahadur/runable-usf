-- Add is_false_completion flag to issues
ALTER TABLE public.issues
ADD COLUMN is_false_completion BOOLEAN DEFAULT FALSE;
