-- Configure session_preload_libraries
-- This is the primary fix for the 'function_search_path_mutable' warning.
-- IMPORTANT: This command cannot run inside a transaction block.
-- It also requires a database restart to take full effect.
-- Supabase platform typically handles this, or a manual restart via the dashboard may be needed.

ALTER SYSTEM SET session_preload_libraries = 'supautils';

SELECT 'Configuration for session_preload_libraries set. Database restart may be required for full effect. If this command failed due to being in a transaction, run it directly in your Supabase SQL Editor outside of any explicit BEGIN/COMMIT block.';
