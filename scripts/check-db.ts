// This script checks database connectivity and displays basic information
// Run with: npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/check-db.ts

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Checking database connection...")

    // Test database connection by counting users
    const userCount = await prisma.user.count()
    console.log(`✅ Database connection successful. Found ${userCount} users.`)

    // Count recipes
    const recipeCount = await prisma.recipe.count()
    console.log(`✅ Found ${recipeCount} recipes.`)

    // Count ingredients
    const ingredientCount = await prisma.ingredient.count()
    console.log(`✅ Found ${ingredientCount} ingredients.`)

    // Count categories
    const categoryCount = await prisma.category.count()
    console.log(`✅ Found ${categoryCount} categories.`)

    // Count suppliers
    const supplierCount = await prisma.supplier.count()
    console.log(`✅ Found ${supplierCount} suppliers.`)

    // Count ratings
    const ratingCount = await prisma.rating.count()
    console.log(`✅ Found ${ratingCount} ratings.`)

    // Count saved recipes
    const savedRecipeCount = await prisma.savedRecipe.count()
    console.log(`✅ Found ${savedRecipeCount} saved recipes.`)

    // Count notifications
    const notificationCount = await prisma.notification.count()
    console.log(`✅ Found ${notificationCount} notifications.`)

    console.log("\n✅ Database check completed successfully!")
  } catch (error) {
    console.error("❌ Error connecting to database:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
