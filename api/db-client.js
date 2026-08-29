import { createClient } from '@supabase/supabase-js';
import { triggerRestore } from './db-wake.js';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing Supabase URL. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.'
  );
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY.');
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    global: {
      fetch: async (url, options) => {
        const res = await fetch(url, options);

        if (!res.ok && res.status >= 500) {
          triggerRestore();
        }

        return res;
      },
    },
  }
);

export default supabase;
