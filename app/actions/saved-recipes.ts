"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getSavedRecipes() {
  const user = await getCurrentUser()

  if (!user) {
    return { recipes: [], pagination: { total: 0, pages: 0, page: 1, limit: 10 } }
  }

  const savedRecipes = await prisma.savedRecipe.findMany({
    where: { userId: user.id },
    include: {
      recipe: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          ratings: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Calculate average rating for each recipe
  const recipesWithRating = savedRecipes.map((savedRecipe) => {
    const recipe = savedRecipe.recipe
    const ratings = recipe.ratings.map((r) => r.rating)
    const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

    return {
      ...recipe,
      averageRating: Number.parseFloat(averageRating.toFixed(1)),
      ratingCount: ratings.length,
    }
  })

  return {
    recipes: recipesWithRating,
    pagination: {
      total: recipesWithRating.length,
      pages: 1,
      page: 1,
      limit: recipesWithRating.length,
    },
  }
}

export async function saveRecipe(recipeId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to save recipes" }
  }

  try {
    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    })

    if (!recipe) {
      return { success: false, message: "Recipe not found" }
    }

    // Check if already saved
    const existingSave = await prisma.savedRecipe.findUnique({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId,
        },
      },
    })

    if (existingSave) {
      return { success: false, message: "Recipe already saved" }
    }

    // Save the recipe
    await prisma.savedRecipe.create({
      data: {
        userId: user.id,
        recipeId,
      },
    })

    revalidatePath(`/recipes/${recipeId}`)
    revalidatePath("/dashboard/saved")
    return { success: true, message: "Recipe saved successfully" }
  } catch (error) {
    console.error("Error saving recipe:", error)
    return { success: false, message: "Failed to save recipe. Please try again." }
  }
}

export async function unsaveRecipe(recipeId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to unsave recipes" }
  }

  try {
    // Check if saved
    const existingSave = await prisma.savedRecipe.findUnique({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId,
        },
      },
    })

    if (!existingSave) {
      return { success: false, message: "Recipe not saved" }
    }

    // Unsave the recipe
    await prisma.savedRecipe.delete({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId,
        },
      },
    })

    revalidatePath(`/recipes/${recipeId}`)
    revalidatePath("/dashboard/saved")
    return { success: true, message: "Recipe removed from saved" }
  } catch (error) {
    console.error("Error unsaving recipe:", error)
    return { success: false, message: "Failed to unsave recipe. Please try again." }
  }
}

export async function isRecipeSaved(recipeId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  const savedRecipe = await prisma.savedRecipe.findUnique({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId,
      },
    },
  })

  return !!savedRecipe
}
