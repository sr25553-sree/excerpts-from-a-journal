-- Migration: Add location and entry_date columns to entries table
-- Run this in your Supabase project's SQL Editor

ALTER TABLE entries ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE entries ADD COLUMN IF NOT EXISTS entry_date date DEFAULT current_date;
