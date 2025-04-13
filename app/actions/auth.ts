"use server"

import { prisma } from "@/lib/db"
import { hashPassword, comparePasswords, createToken, logout as logoutUtil } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Update the register function to include more detailed error handling and logging
export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log(`Registration attempt for email: ${email}`)

  try {
    const validatedData = registerSchema.parse({ name, email, password })

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      console.log(`User already exists for email: ${email}`)
      return { success: false, message: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "User", // Default role
      },
    })

    console.log(`User created with ID: ${user.id}`)

    // Create token and set cookie
    console.log(`Creating token for user ID: ${user.id}`)
    await createToken(user.id)

    console.log(`Registration successful for email: ${email}`)
    return { success: true, message: "Registration successful" }
  } catch (error) {
    console.error("Registration error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Registration failed. Please try again." }
  }
}

// Update the login function to include more detailed error handling and logging
export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log(`Login attempt for email: ${email}`)

  try {
    const validatedData = loginSchema.parse({ email, password })

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      console.log(`User not found for email: ${email}`)
      return { success: false, message: "Invalid email or password" }
    }

    // Verify password
    const isPasswordValid = await comparePasswords(validatedData.password, user.password)

    if (!isPasswordValid) {
      console.log(`Invalid password for email: ${email}`)
      return { success: false, message: "Invalid email or password" }
    }

    // Create token and set cookie
    console.log(`Creating token for user ID: ${user.id}`)
    await createToken(user.id)

    console.log(`Login successful for email: ${email}`)
    return { success: true, message: "Login successful" }
  } catch (error) {
    console.error("Login error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Login failed. Please try again." }
  }
}

export async function logout() {
  await logoutUtil()
  redirect("/login")
}
