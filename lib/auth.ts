import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { prisma } from "./db"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-change-in-production")

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function comparePasswords(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

// Update the createToken function to include more detailed error handling and logging
export async function createToken(userId: number) {
  try {
    console.log(`Creating token for user ID: ${userId}`)

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables")
      throw new Error("JWT_SECRET is not defined")
    }

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
      .sign(JWT_SECRET)

    console.log("Token created successfully")

    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    console.log("Cookie set successfully")

    return token
  } catch (error) {
    console.error("Error creating token:", error)
    throw error
  }
}

// Update the verifyToken function to include more detailed error handling and logging
export async function verifyToken() {
  try {
    const token = cookies().get("auth-token")?.value

    if (!token) {
      console.log("No auth token found in cookies")
      return null
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables")
      throw new Error("JWT_SECRET is not defined")
    }

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

    console.log("Verifying token...")
    const verified = await jwtVerify(token, JWT_SECRET)
    console.log("Token verified successfully")

    return verified.payload as { userId: number }
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Update the getCurrentUser function to include more detailed error handling and logging
export async function getCurrentUser() {
  try {
    const payload = await verifyToken()

    if (!payload) {
      console.log("No valid token payload")
      return null
    }

    console.log(`Fetching user with ID: ${payload.userId}`)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      console.log(`User with ID ${payload.userId} not found`)
    } else {
      console.log(`User found: ${user.name}`)
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function logout() {
  cookies().delete("auth-token")
}
