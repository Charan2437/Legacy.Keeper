import { Suspense } from "react"
import { InsuranceHeader } from "@/components/insurance/insurance-header"
import { InsuranceTabs } from "@/components/insurance/insurance-tabs"
import { InsuranceTable } from "@/components/insurance/insurance-table"
import { getInsuranceCount } from "@/app/actions/insurance"
import { cookies } from "next/headers"
import { getCurrentRoleFromSession } from "@/app/actions/user-roles"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function InsurancePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient()
  let currentRole = null
  let userId = null
  let session = null
  try {
    currentRole = await getCurrentRoleFromSession(cookieStore)
    const sessionResult = await supabase.auth.getSession()
    session = sessionResult.data.session
    if (session) {
      userId = session.user.id
    }
  } catch {}

  // --- GUARD: Only allow access if user is not nominee, or nominee with 'Family' access ---
  if (
    currentRole?.name === "nominee" &&
    (!currentRole.accessCategories || !currentRole.accessCategories.includes("Family"))
  ) {
    redirect("/dashboard")
  }
  // -----------------------------------------------------------------------------

  // If nominee, get related user's id by email
  if (currentRole?.name === "nominee" && currentRole.relatedUser?.email) {
    const { data: relatedUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", currentRole.relatedUser.email)
      .single()
    if (relatedUser?.id) userId = relatedUser.id
  }

  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const insuranceType = typeof searchParams.type === "string" ? searchParams.type : "All"
  const searchQuery = typeof searchParams.search === "string" ? searchParams.search : ""

  const { count } = await getInsuranceCount()

  return (
    <div className="flex flex-col gap-6">
      <InsuranceHeader count={count} />
      <InsuranceTabs activeTab={insuranceType} />
      <Suspense fallback={<div>Loading...</div>}>
        <InsuranceTable currentPage={page} insuranceType={insuranceType} searchQuery={searchQuery} userId={userId} />
      </Suspense>
    </div>
  )
}
