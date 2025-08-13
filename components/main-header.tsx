"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code2, Trophy, User, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { signOut } from "@/lib/actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserProfile {
  username: string
  rating: number
  total_questions_solved: number
}

export function MainHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("username, rating, total_questions_solved")
          .eq("id", user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const navigation = [
    { name: "Home", href: "/", icon: null },
    { name: "Learn", href: "/learn", icon: null },
    { name: "Compiler", href: "/compiler", icon: Code2 },
    { name: "Ranking", href: "/ranking", icon: Trophy },
  ]

  const getRatingColor = (rating: number) => {
    if (rating >= 2000) return "bg-purple-500"
    if (rating >= 1500) return "bg-blue-500"
    if (rating >= 1000) return "bg-green-500"
    if (rating >= 500) return "bg-yellow-500"
    return "bg-gray-500"
  }

  const getRatingTitle = (rating: number) => {
    if (rating >= 2000) return "Expert"
    if (rating >= 1500) return "Advanced"
    if (rating >= 1000) return "Intermediate"
    if (rating >= 500) return "Beginner"
    return "Newbie"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">CodeLearn</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* User Rating Badge */}
              {profile && (
                <Badge variant="secondary" className={`${getRatingColor(profile.rating)} text-white`}>
                  <Trophy className="h-3 w-3 mr-1" />
                  {profile.rating}
                </Badge>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">{profile?.username || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {getRatingTitle(profile?.rating || 0)} • {profile?.total_questions_solved || 0} solved
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">View Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/ranking">Leaderboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={signOut}>
                      <button type="submit" className="w-full text-left flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
