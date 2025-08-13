"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Play, CheckCircle, XCircle, Trophy, ArrowRight, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Question {
  id: number
  title: string
  problem_statement: string
  sample_input: string
  expected_output: string
  difficulty_level: string
  points: number
  course_id: number
  courses: {
    id: number
    title: string
    languages: {
      name: string
    }
  }
}

interface UserProgress {
  is_solved: boolean
  solution_code: string
  attempts: number
}

interface CompilerInterfaceProps {
  question?: Question
  userProgress?: UserProgress | null
  nextQuestion?: { id: number; order_index: number } | null
  courseId?: string
  language?: string
}

export function CompilerInterface({
  question,
  userProgress,
  nextQuestion,
  courseId,
  language,
}: CompilerInterfaceProps) {
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [attempts, setAttempts] = useState(0)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (question) {
      setSelectedLanguage(question.courses.languages.name.toLowerCase())
      if (userProgress?.solution_code) {
        setCode(userProgress.solution_code)
      } else {
        // Set default code template based on language
        setCode(getDefaultCode(question.courses.languages.name.toLowerCase()))
      }
      setAttempts(userProgress?.attempts || 0)
      setIsCorrect(userProgress?.is_solved || false)
    }
  }, [question, userProgress])

  const getDefaultCode = (lang: string) => {
    const templates: Record<string, string> = {
      python: `# Python Solution Template
def solution():
    """
    Write your solution here
    """
    # Example: Hello World
    return "Hello, World!"

# Test your solution
result = solution()
print(result)`,
      java: `public class Solution {
    /**
     * Write your solution here
     */
    public static String solution() {
        // Example: Hello World
        return "Hello, World!";
    }
    
    public static void main(String[] args) {
        String result = solution();
        System.out.println(result);
    }
}`,
      javascript: `// JavaScript Solution Template
function solution() {
    /**
     * Write your solution here
     */
    // Example: Hello World
    return "Hello, World!";
}

// Test your solution
const result = solution();
console.log(result);`,
      "c++": `#include <iostream>
#include <string>
using namespace std;

/**
 * Write your solution here
 */
string solution() {
    // Example: Hello World
    return "Hello, World!";
}

int main() {
    string result = solution();
    cout << result << endl;
    return 0;
}`,
      c: `#include <stdio.h>
#include <string.h>

/**
 * Write your solution here
 */
void solution() {
    // Example: Hello World
    printf("Hello, World!\\n");
}

int main() {
    solution();
    return 0;
}`,
    }
    return templates[lang] || templates.python
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      let simulatedOutput = ""
      let executionError = false

      if (question) {
        const codeContent = code.toLowerCase()
        const questionTitle = question.title.toLowerCase()

        // Hello World variations
        if (questionTitle.includes("hello world") || questionTitle.includes("hello, world")) {
          if (codeContent.includes("hello, world!") || codeContent.includes("hello world")) {
            simulatedOutput = question.expected_output
          } else {
            simulatedOutput = "Your output doesn't match the expected result"
            executionError = true
          }
        }
        // Addition problems
        else if (questionTitle.includes("add") || questionTitle.includes("sum")) {
          const numbers = question.sample_input.match(/\d+/g)
          if (numbers && numbers.length >= 2) {
            const sum = numbers.reduce((acc, num) => acc + Number.parseInt(num), 0)
            if (codeContent.includes("+") || codeContent.includes("sum") || codeContent.includes("add")) {
              simulatedOutput = sum.toString()
            } else {
              simulatedOutput = "Please implement the addition logic"
              executionError = true
            }
          }
        }
        // Maximum/minimum problems
        else if (questionTitle.includes("maximum") || questionTitle.includes("max")) {
          if (codeContent.includes("max") || codeContent.includes("sort") || codeContent.includes(">")) {
            simulatedOutput = question.expected_output
          } else {
            simulatedOutput = "Please implement the maximum finding logic"
            executionError = true
          }
        }
        // Array/list problems
        else if (questionTitle.includes("array") || questionTitle.includes("list")) {
          if (codeContent.includes("[") || codeContent.includes("array") || codeContent.includes("list")) {
            simulatedOutput = question.expected_output
          } else {
            simulatedOutput = "Please work with arrays/lists in your solution"
            executionError = true
          }
        }
        // Loop problems
        else if (questionTitle.includes("loop") || questionTitle.includes("iterate")) {
          if (codeContent.includes("for") || codeContent.includes("while") || codeContent.includes("range")) {
            simulatedOutput = question.expected_output
          } else {
            simulatedOutput = "Please use loops in your solution"
            executionError = true
          }
        }
        // String problems
        else if (questionTitle.includes("string") || questionTitle.includes("text")) {
          if (codeContent.includes("string") || codeContent.includes("str") || codeContent.includes("text")) {
            simulatedOutput = question.expected_output
          } else {
            simulatedOutput = "Please work with strings in your solution"
            executionError = true
          }
        }
        // Default case - check for basic programming constructs
        else {
          const hasBasicLogic =
            codeContent.includes("if") ||
            codeContent.includes("for") ||
            codeContent.includes("while") ||
            codeContent.includes("def") ||
            codeContent.includes("function") ||
            codeContent.includes("return")

          if (hasBasicLogic && code.trim().length > 50) {
            simulatedOutput = question.expected_output
          } else {
            simulatedOutput = "Please implement a complete solution"
            executionError = true
          }
        }
      } else {
        if (code.trim().length === 0) {
          simulatedOutput = "Please write some code first"
          executionError = true
        } else if (selectedLanguage === "python" && !code.toLowerCase().includes("print")) {
          simulatedOutput = "Add print() statements to see output"
        } else if (selectedLanguage === "java" && !code.toLowerCase().includes("system.out")) {
          simulatedOutput = "Add System.out.println() to see output"
        } else {
          simulatedOutput = "Code executed successfully!\nOutput: Hello from " + selectedLanguage
        }
      }

      setOutput(simulatedOutput)

      if (question && !executionError) {
        const outputMatches = simulatedOutput.trim() === question.expected_output.trim()
        setIsCorrect(outputMatches)
        await updateProgress(outputMatches)
      } else {
        setIsCorrect(false)
        if (question) {
          await updateProgress(false)
        }
      }
    } catch (error) {
      setOutput("Runtime Error: " + error)
      setIsCorrect(false)
    } finally {
      setIsRunning(false)
    }
  }

  const updateProgress = async (solved: boolean) => {
    if (!question) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    // Update or insert user progress
    const { error } = await supabase.from("user_progress").upsert({
      user_id: user.id,
      question_id: question.id,
      is_solved: solved,
      solution_code: code,
      attempts: newAttempts,
      solved_at: solved ? new Date().toISOString() : null,
    })

    if (error) {
      console.error("Error updating progress:", error)
    }

    // If solved, update user profile rating
    if (solved && !userProgress?.is_solved) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("rating, total_questions_solved")
        .eq("id", user.id)
        .single()

      if (profile) {
        await supabase
          .from("user_profiles")
          .update({
            rating: profile.rating + question.points,
            total_questions_solved: profile.total_questions_solved + 1,
          })
          .eq("id", user.id)
      }
    }
  }

  const goToNextQuestion = () => {
    if (nextQuestion && courseId && language) {
      router.push(`/compiler?question=${nextQuestion.id}&course=${courseId}&lang=${language}`)
    }
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

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      {question && (
        <div className="border-b p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/learn/${language}/${courseId}/practice`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Practice
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold">{question.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {question.courses.title} • Attempts: {attempts}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={`${getDifficultyColor(question.difficulty_level)} text-white`}>
                {question.difficulty_level}
              </Badge>
              <Badge variant="outline">
                <Trophy className="h-3 w-3 mr-1" />
                {question.points} points
              </Badge>
              {isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Problem Statement */}
        {question ? (
          <div className="w-1/2 border-r overflow-y-auto">
            <Card className="h-full rounded-none border-0">
              <CardHeader>
                <CardTitle>Problem Statement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{question.problem_statement}</p>
                </div>

                {question.sample_input && (
                  <div>
                    <h3 className="font-semibold mb-2">Sample Input</h3>
                    <div className="bg-muted p-3 rounded-lg font-mono text-sm">{question.sample_input}</div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Expected Output</h3>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">{question.expected_output}</div>
                </div>

                {isCorrect && nextQuestion && (
                  <div className="pt-4">
                    <Button onClick={goToNextQuestion} className="w-full">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Next Challenge
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="w-1/2 border-r p-6">
            <h2 className="text-2xl font-bold mb-4">Code Compiler</h2>
            <p className="text-muted-foreground">
              Write and execute code in multiple programming languages. Select a question from the practice section to
              get started with challenges.
            </p>
          </div>
        )}

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className="border-b p-4 flex items-center justify-between">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="c++">C++</SelectItem>
                <SelectItem value="c">C</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={runCode} disabled={isRunning}>
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Code
                </>
              )}
            </Button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 p-4">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
              className="h-full font-mono text-sm resize-none"
            />
          </div>

          <Separator />

          {/* Output Panel */}
          <div className="h-48 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Output</h3>
              {output && question && (
                <div className="flex items-center space-x-2">
                  {isCorrect ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Correct!
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Try Again
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="bg-muted p-3 rounded-lg h-32 overflow-y-auto font-mono text-sm">
              {output || "Run your code to see the output..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
