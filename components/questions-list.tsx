"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code2, Trophy, CheckCircle, Circle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Question {
  id: number
  title: string
  problem_statement: string
  sample_input: string
  expected_output: string
  difficulty_level: string
  points: number
  order_index: number
}

interface QuestionsListProps {
  questions: Question[]
  courseId: string
  language: string
}

export function QuestionsList({ questions, courseId, language }: QuestionsListProps) {
  const [solvedQuestions, setSolvedQuestions] = useState<Set<number>>(new Set())
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserProgress = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        const { data: progress } = await supabase
          .from("user_progress")
          .select("question_id")
          .eq("user_id", user.id)
          .eq("is_solved", true)

        if (progress) {
          setSolvedQuestions(new Set(progress.map((p) => p.question_id)))
        }
      }
    }

    fetchUserProgress()
  }, [supabase])

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

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No challenges available</h3>
        <p className="text-muted-foreground">Practice challenges are being prepared. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const isSolved = solvedQuestions.has(question.id)

        return (
          <Card key={question.id} className="hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2">
                    {isSolved ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{question.title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {question.problem_statement.substring(0, 150)}...
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={`${getDifficultyColor(question.difficulty_level)} text-white`}>
                    {question.difficulty_level}
                  </Badge>
                  <Badge variant="outline">
                    <Trophy className="h-3 w-3 mr-1" />
                    {question.points}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <div>Sample Input: {question.sample_input || "None"}</div>
                  <div>Expected Output: {question.expected_output}</div>
                </div>
                <Button asChild>
                  <Link href={`/compiler?question=${question.id}&course=${courseId}&lang=${language}`}>
                    <Code2 className="h-4 w-4 mr-2" />
                    Solve Challenge
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
