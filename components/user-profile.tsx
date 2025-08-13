"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Trophy, Target, Clock, Code2 } from "lucide-react"

interface UserProfile {
  id: string
  username: string
  full_name: string
  rating: number
  total_questions_solved: number
  created_at: string
}

interface RecentActivity {
  id: number
  solved_at: string
  questions: {
    title: string
    difficulty_level: string
    points: number
    courses: {
      title: string
      languages: {
        name: string
      }
    }
  }
}

interface UserProfileProps {
  profile: UserProfile | null
  recentActivity: RecentActivity[]
  userRank: number
}

export function UserProfile({ profile, recentActivity, userRank }: UserProfileProps) {
  if (!profile) {
    return <div>Loading...</div>
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

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const ratingInfo = getRatingInfo(profile.rating)
  const joinDate = new Date(profile.created_at).toLocaleDateString()

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{profile.username}</h1>
        <p className="text-xl text-muted-foreground">{profile.full_name}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Rating Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Rating & Rank</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{profile.rating}</div>
                <Badge className={`${ratingInfo.color} text-white`}>{ratingInfo.title}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {ratingInfo.next || "Max Level"}</span>
                  <span>{Math.round(ratingInfo.progress)}%</span>
                </div>
                <Progress value={ratingInfo.progress} />
              </div>

              <div className="text-center pt-2">
                <div className="text-2xl font-bold">#{userRank}</div>
                <div className="text-sm text-muted-foreground">Global Rank</div>
              </div>
            </CardContent>
          </Card>

          {/* General Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary">{profile.total_questions_solved}</div>
                  <div className="text-sm text-muted-foreground">Problems Solved</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member since</span>
                  </span>
                  <span>{joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity. Start solving problems to see your progress here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{activity.questions.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.questions.courses.title} • {activity.questions.courses.languages.name}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={`${getDifficultyColor(activity.questions.difficulty_level)} text-white`}
                        >
                          {activity.questions.difficulty_level}
                        </Badge>
                        <Badge variant="outline">
                          <Trophy className="h-3 w-3 mr-1" />
                          {activity.questions.points}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(activity.solved_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
