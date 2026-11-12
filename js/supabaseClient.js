// ============================================================
// Kolachi Restaurant – Supabase Client
// Project: wzrgdrqiaijtiucvpotc
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'https://wzrgdrqiaijtiucvpotc.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_8oMZV4dwLjqwtMOQaxbQgw_f7-LY2WS';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
