import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    console.log("Testing authentication...")

    const user = await getCurrentUser()

    if (!user) {
      console.log("Authentication test: No user found")
      return NextResponse.json({
        authenticated: false,
        message: "Not authenticated",
        cookiesPresent: !!global.cookies?.get?.("auth-token"),
      })
    }

    console.log(`Authentication test: User found - ${user.name} (${user.email})`)
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Authentication test error:", error)
    return NextResponse.json(
      {
        authenticated: false,
        error: "Error testing authentication",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
