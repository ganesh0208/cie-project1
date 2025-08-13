"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserProfile {
  id: string
  username: string
  full_name: string
  rating: number
  total_questions_solved: number
  created_at: string
}

interface LeaderboardProps {
  topUsers: UserProfile[]
  currentUser: any
}

export function Leaderboard({ topUsers, currentUser }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRatingTitle = (rating: number) => {
    if (rating >= 2000) return { title: "Expert", color: "bg-purple-500" }
    if (rating >= 1500) return { title: "Advanced", color: "bg-blue-500" }
    if (rating >= 1000) return { title: "Intermediate", color: "bg-green-500" }
    if (rating >= 500) return { title: "Beginner", color: "bg-yellow-500" }
    return { title: "Newbie", color: "bg-gray-500" }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Global Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4 mt-6">
            {topUsers.map((user, index) => {
              const rank = index + 1
              const ratingInfo = getRatingTitle(user.rating)
              const isCurrentUser = currentUser?.id === user.id

              return (
                <div
                  key={user.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                    isCurrentUser ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8">{getRankIcon(rank)}</div>

                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10">
                      {getInitials(user.full_name || user.username)}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{user.username}</h3>
                      {isCurrentUser && <Badge variant="secondary">You</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.full_name}</p>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${ratingInfo.color} text-white`}>{user.rating} pts</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{user.total_questions_solved} solved</p>
                  </div>
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4 mt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Monthly rankings coming soon!</p>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4 mt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Weekly rankings coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
