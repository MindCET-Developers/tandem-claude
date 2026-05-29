import { createBrowserClient } from '@supabase/ssr'

// Reuse a single browser client across the app. Creating a new one on every
// render/call spawns multiple GoTrueClient instances (console warnings) and
// wastes work; the browser client is safe to share.
let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}
