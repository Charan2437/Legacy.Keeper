import { getFamilyMembers } from "@/app/actions/family-vaults"
import { FamilyVaultsClient } from "@/components/family-vaults/family-vaults-client"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getCurrentRoleFromSession } from "@/app/actions/user-roles"

export default async function FamilyVaultsPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Get current role from session (if available)
  let currentRole = null
  try {
    currentRole = await getCurrentRoleFromSession(cookieStore)
  } catch {}

  // --- GUARD: Only allow access if user is not nominee, or nominee with 'Family' access ---
  if (
    currentRole?.name === "nominee" &&
    (!currentRole.accessCategories || !currentRole.accessCategories.includes("Family"))
  ) {
    redirect("/dashboard")
  }
  // -----------------------------------------------------------------------------

  const { success, data: members, error } = await getFamilyMembers()

  if (!success) {
    console.error("Error fetching family members:", error)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">Family Vaults</h1>
          <p className="text-muted-foreground">View Family Vault here!!</p>
        </div>

        <FamilyVaultsClient initialMembers={members || []} />
      </div>
    </div>
  )
}
