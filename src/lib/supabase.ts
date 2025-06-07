import { createClient } from "@supabase/supabase-js";

// This function will be used in your server-side code (e.g., server functions)
export const createSupabaseServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for now

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase URL or key. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file."
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
  });
};

// Client-side client (if you need it for browser interactions)
// import { createBrowserClient } from '@supabase/ssr';
//
// // Ensure your Vite config makes these env vars available to the client if needed,
// // typically by prefixing with VITE_PUBLIC_
// export const supabaseBrowserClient = createBrowserClient(
//   import.meta.env.VITE_PUBLIC_SUPABASE_URL!,
//   import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!
// );
