"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Update the signIn function to handle redirects properly
export async function signIn(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Return success instead of redirecting directly
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Update the signUp function to handle potential null formData
export async function signUp(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const username = formData.get("username")
  const fullName = formData.get("fullName")

  // Validate required fields
  if (!email || !password || !username) {
    return { error: "Email, password, and username are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase.from("user_profiles").insert({
        id: data.user.id,
        username: username.toString(),
        full_name: fullName?.toString() || "",
        rating: 0,
        total_questions_solved: 0,
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
        // Don't return error here as the user was created successfully
      }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function executeCode(code: string, language: string, input?: string) {
  "use server"

  // This is a simplified code execution simulation
  // In a real implementation, you would use a secure code execution service
  // like Judge0, HackerEarth API, or a containerized solution

  try {
    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple pattern matching for demo purposes
    let output = ""

    if (language === "python") {
      if (code.includes("print")) {
        // Extract content between quotes in print statements
        const printMatch = code.match(/print\s*$$\s*["']([^"']+)["']\s*$$/)
        if (printMatch) {
          output = printMatch[1]
        } else {
          output = "Code executed"
        }
      }
    } else if (language === "java") {
      if (code.includes("System.out.println")) {
        const printMatch = code.match(/System\.out\.println\s*$$\s*["']([^"']+)["']\s*$$/)
        if (printMatch) {
          output = printMatch[1]
        } else {
          output = "Code executed"
        }
      }
    } else if (language === "javascript") {
      if (code.includes("console.log")) {
        const printMatch = code.match(/console\.log\s*$$\s*["']([^"']+)["']\s*$$/)
        if (printMatch) {
          output = printMatch[1]
        } else {
          output = "Code executed"
        }
      }
    }

    return { success: true, output }
  } catch (error) {
    return { success: false, output: "Error executing code: " + error }
  }
}
