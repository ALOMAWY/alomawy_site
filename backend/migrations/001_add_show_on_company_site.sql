-- Migration: per-project "show on company website" visibility flag
--
-- Run this ONCE in your Supabase project:
--   Supabase Dashboard -> SQL Editor -> paste this file -> Run
--
-- Adds a boolean column that controls whether a project appears on the
-- company website (separate from the personal site). Defaults to true so
-- existing projects remain visible until you toggle them off.

alter table public.projects
  add column if not exists show_on_company_site boolean not null default true;
