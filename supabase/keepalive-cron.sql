-- ============================================================
-- Keep Render free-tier API alive using Supabase pg_cron + pg_net
-- ============================================================
--
-- PREREQUISITES (one-time setup in Supabase Dashboard):
--   1. Go to: Dashboard → Database → Extensions
--   2. Enable: pg_net
--   3. Enable: pg_cron
--
-- Then run this file in: Dashboard → SQL Editor
-- ============================================================

-- Schedule a ping every 14 minutes to prevent Render from sleeping
select cron.schedule(
  'ping-render-api',
  '*/14 * * * *',
  $$ select net.http_get(url := 'https://stixshop-api.onrender.com/api/ping') as request_id; $$
);

-- ============================================================
-- Useful management commands (run individually as needed)
-- ============================================================

-- List all scheduled cron jobs:
-- select * from cron.job;

-- Check recent cron job execution history:
-- select * from cron.job_run_details order by start_time desc limit 20;

-- Remove the cron job if needed:
-- select cron.unschedule('ping-render-api');
