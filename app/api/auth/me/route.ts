import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    console.log("Fetching current user...")
    const user = await getCurrentUser()

    if (!user) {
      console.log("No authenticated user found")
      return NextResponse.json({ user: null }, { status: 401 })
    }

    console.log(`Current user: ${user.name} (${user.email})`)
    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
