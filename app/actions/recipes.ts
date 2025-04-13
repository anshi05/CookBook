"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const recipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cuisine: z.string().optional(),
  prepTime: z.coerce.number().min(1, "Prep time must be at least 1 minute"),
  cookTime: z.coerce.number().min(1, "Cook time must be at least 1 minute"),
  instructions: z.string().min(10, "Instructions must be at least 10 characters"),
})

export async function getRecipes(
  options: {
    page?: number
    limit?: number
    search?: string
    category?: string
    cuisine?: string
    userId?: number
  } = {},
) {
  const { page = 1, limit = 10, search = "", category = "", cuisine = "", userId } = options

  const skip = (page - 1) * limit

  const where: any = {}

  if (search) {
    where.OR = [{ title: { contains: search } }, { description: { contains: search } }]
  }

  if (cuisine) {
    where.cuisine = cuisine
  }

  if (userId) {
    where.userId = userId
  }

  const recipes = await prisma.recipe.findMany({
    where,
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
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  })

  const totalRecipes = await prisma.recipe.count({ where })

  // Calculate average rating for each recipe
  const recipesWithRating = recipes.map((recipe) => {
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
      total: totalRecipes,
      pages: Math.ceil(totalRecipes / limit),
      page,
      limit,
    },
  }
}

export async function getRecipeById(id: number) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      recipeIngredients: {
        include: {
          ingredient: true,
        },
      },
      ratings: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!recipe) {
    return null
  }

  // Calculate average rating
  const ratings = recipe.ratings.map((r) => r.rating)
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

  return {
    ...recipe,
    averageRating: Number.parseFloat(averageRating.toFixed(1)),
    ratingCount: ratings.length,
  }
}

export async function createRecipe(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to create a recipe" }
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const cuisine = formData.get("cuisine") as string
    const prepTime = Number.parseInt(formData.get("prepTime") as string)
    const cookTime = Number.parseInt(formData.get("cookTime") as string)
    const instructions = formData.get("instructions") as string

    const validatedData = recipeSchema.parse({
      title,
      description,
      cuisine,
      prepTime,
      cookTime,
      instructions,
    })

    const recipe = await prisma.recipe.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    })

    // Handle ingredients (assuming they're coming as JSON string)
    const ingredientsJson = formData.get("ingredients") as string
    if (ingredientsJson) {
      const ingredients = JSON.parse(ingredientsJson)

      for (const ingredient of ingredients) {
        // Find or create the ingredient
        let ingredientRecord = await prisma.ingredient.findFirst({
          where: { name: ingredient.name },
        })

        if (!ingredientRecord) {
          ingredientRecord = await prisma.ingredient.create({
            data: {
              name: ingredient.name,
              category: ingredient.category || null,
            },
          })
        }

        // Create recipe-ingredient relationship
        await prisma.recipeIngredient.create({
          data: {
            recipeId: recipe.id,
            ingredientId: ingredientRecord.id,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          },
        })
      }
    }

    revalidatePath("/recipes")
    return { success: true, message: "Recipe created successfully", recipeId: recipe.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to create recipe. Please try again." }
  }
}

export async function updateRecipe(recipeId: number, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to update a recipe" }
  }

  try {
    // Check if the recipe exists and belongs to the user
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    })

    if (!existingRecipe) {
      return { success: false, message: "Recipe not found" }
    }

    if (existingRecipe.userId !== user.id && user.role !== "Admin") {
      return { success: false, message: "You do not have permission to update this recipe" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const cuisine = formData.get("cuisine") as string
    const prepTime = Number.parseInt(formData.get("prepTime") as string)
    const cookTime = Number.parseInt(formData.get("cookTime") as string)
    const instructions = formData.get("instructions") as string

    const validatedData = recipeSchema.parse({
      title,
      description,
      cuisine,
      prepTime,
      cookTime,
      instructions,
    })

    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: validatedData,
    })

    // Handle ingredients (assuming they're coming as JSON string)
    const ingredientsJson = formData.get("ingredients") as string
    if (ingredientsJson) {
      // First, remove existing recipe-ingredient relationships
      await prisma.recipeIngredient.deleteMany({
        where: { recipeId },
      })

      const ingredients = JSON.parse(ingredientsJson)

      for (const ingredient of ingredients) {
        // Find or create the ingredient
        let ingredientRecord = await prisma.ingredient.findFirst({
          where: { name: ingredient.name },
        })

        if (!ingredientRecord) {
          ingredientRecord = await prisma.ingredient.create({
            data: {
              name: ingredient.name,
              category: ingredient.category || null,
            },
          })
        }

        // Create recipe-ingredient relationship
        await prisma.recipeIngredient.create({
          data: {
            recipeId,
            ingredientId: ingredientRecord.id,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          },
        })
      }
    }

    revalidatePath(`/recipes/${recipeId}`)
    return { success: true, message: "Recipe updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to update recipe. Please try again." }
  }
}

export async function deleteRecipe(recipeId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to delete a recipe" }
  }

  try {
    // Check if the recipe exists and belongs to the user
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    })

    if (!existingRecipe) {
      return { success: false, message: "Recipe not found" }
    }

    if (existingRecipe.userId !== user.id && user.role !== "Admin") {
      return { success: false, message: "You do not have permission to delete this recipe" }
    }

    // Delete the recipe (cascade will handle related records)
    await prisma.recipe.delete({
      where: { id: recipeId },
    })

    revalidatePath("/recipes")
    return { success: true, message: "Recipe deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete recipe. Please try again." }
  }
}
