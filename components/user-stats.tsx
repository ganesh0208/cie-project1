"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Calendar, TrendingUp, User, Award } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: string
  username: string
  full_name: string
  rating: number
  total_questions_solved: number
  created_at: string
}

interface UserStatsProps {
  userStats: UserProfile | null
  userRank: number | null
}

export function UserStats({ userStats, userRank }: UserStatsProps) {
  if (!userStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Join the Competition!</h3>
          <p className="text-muted-foreground mb-4">Sign in to track your progress and compete with other learners.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const getRatingInfo = (rating: number) => {
    if (rating >= 2000) return { title: "Expert", color: "bg-purple-500", next: null, progress: 100 }
    if (rating >= 1500)
      return { title: "Advanced", color: "bg-blue-500", next: "Expert", progress: ((rating - 1500) / 500) * 100 }
    if (rating >= 1000)
      return { title: "Intermediate", color: "bg-green-500", next: "Advanced", progress: ((rating - 1000) / 500) * 100 }
    if (rating >= 500)
      return { title: "Beginner", color: "bg-yellow-500", next: "Intermediate", progress: ((rating - 500) / 500) * 100 }
    return { title: "Newbie", color: "bg-gray-500", next: "Beginner", progress: (rating / 500) * 100 }
  }

  const ratingInfo = getRatingInfo(userStats.rating)
  const joinDate = new Date(userStats.created_at).toLocaleDateString()

  return (
    <div className="space-y-6">
      {/* User Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Your Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{userStats.username}</h2>
            <p className="text-muted-foreground">{userStats.full_name}</p>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Badge className={`${ratingInfo.color} text-white text-lg px-3 py-1`}>
              <Trophy className="h-4 w-4 mr-1" />
              {userStats.rating}
            </Badge>
            <div className="text-center">
              <div className="text-2xl font-bold">#{userRank}</div>
              <div className="text-xs text-muted-foreground">Global Rank</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level: {ratingInfo.title}</span>
              {ratingInfo.next && <span>Next: {ratingInfo.next}</span>}
            </div>
            <Progress value={ratingInfo.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userStats.total_questions_solved}</div>
              <div className="text-sm text-muted-foreground">Problems Solved</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userStats.rating}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Member since</span>
              </span>
              <span>{joinDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>Current Title</span>
              </span>
              <Badge variant="outline">{ratingInfo.title}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/learn">Continue Learning</Link>
          </Button>
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/compiler">Practice Coding</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
