import { MainHeader } from "@/components/main-header"
import { Leaderboard } from "@/components/leaderboard"
import { UserStats } from "@/components/user-stats"
import { createClient } from "@/lib/supabase/server"

export default async function RankingPage() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch top users for leaderboard
  const { data: topUsers } = await supabase
    .from("user_profiles")
    .select("*")
    .order("rating", { ascending: false })
    .limit(50)

  // Fetch current user's stats if logged in
  let userStats = null
  let userRank = null
  if (user) {
    const { data: stats } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    userStats = stats

    // Get user's rank
    const { count } = await supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true })
      .gt("rating", stats?.rating || 0)

    userRank = (count || 0) + 1
  }

  // Fetch language-specific stats
  const { data: languageStats } = await supabase.rpc("get_language_stats")

  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Leaderboard & Rankings</h1>
          <p className="text-xl text-muted-foreground">
            See how you stack up against other learners and track your coding journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="lg:col-span-1">
            <UserStats userStats={userStats} userRank={userRank} />
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <Leaderboard topUsers={topUsers || []} currentUser={user} />
          </div>
        </div>
      </main>
    </div>
  )
}
