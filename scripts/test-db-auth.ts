// This is a script to test database connection and authentication
// Run with: npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/test-db-auth.ts

import { PrismaClient } from "@prisma/client"
import { hashPassword, comparePasswords } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Testing database connection...")

    // Test database connection
    const userCount = await prisma.user.count()
    console.log(`Database connection successful. User count: ${userCount}`)

    // Create a test user
    const testEmail = "test@example.com"
    const testPassword = "password123"

    // Check if test user exists
    let user = await prisma.user.findUnique({
      where: { email: testEmail },
    })

    if (!user) {
      console.log(`Creating test user with email: ${testEmail}`)
      const hashedPassword = await hashPassword(testPassword)

      user = await prisma.user.create({
        data: {
          name: "Test User",
          email: testEmail,
          password: hashedPassword,
          role: "User",
        },
      })

      console.log(`Test user created with ID: ${user.id}`)
    } else {
      console.log(`Test user already exists with ID: ${user.id}`)
    }

    // Test password comparison
    const passwordMatch = await comparePasswords(testPassword, user.password)
    console.log(`Password comparison result: ${passwordMatch ? "Success" : "Failed"}`)

    // List all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    console.log("All users:")
    console.table(users)

    console.log("Tests completed successfully")
  } catch (error) {
    console.error("Error during tests:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
