// lib/server/get-forge-role.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ForgeRole } from '@/lib/forge-permissions'

/**
 * Looks up the caller's role on a given forge from forge_contributors.
 * Returns null if the user has no relationship to the forge at all
 * (not the owner, not a contributor, not a viewer) — callers should
 * treat null as "not found" / "not authorized", not as a default role.
 */
export async function getForgeRole(
  supabase: SupabaseClient,
  forgeId: string,
  userId: string
): Promise<ForgeRole | null> {
  const { data, error } = await supabase
    .from('forge_contributors')
    .select('role')
    .eq('forge_id', forgeId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return data.role as ForgeRole
}
