"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export async function addRating(recipeId: number, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to rate a recipe" }
  }

  try {
    const rating = Number.parseInt(formData.get("rating") as string)
    const comment = formData.get("comment") as string

    const validatedData = ratingSchema.parse({ rating, comment })

    // Check if the user has already rated this recipe
    const existingRating = await prisma.rating.findFirst({
      where: {
        recipeId,
        userId: user.id,
      },
    })

    if (existingRating) {
      // Update existing rating
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: validatedData,
      })
    } else {
      // Create new rating
      await prisma.rating.create({
        data: {
          ...validatedData,
          recipeId,
          userId: user.id,
        },
      })

      // Create notification for recipe owner
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        select: { userId: true, title: true },
      })

      if (recipe && recipe.userId !== user.id) {
        await prisma.notification.create({
          data: {
            userId: recipe.userId,
            message: `${user.name} rated your recipe "${recipe.title}"`,
          },
        })
      }
    }

    revalidatePath(`/recipes/${recipeId}`)
    return { success: true, message: "Rating submitted successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to submit rating. Please try again." }
  }
}

export async function deleteRating(ratingId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to delete a rating" }
  }

  try {
    // Check if the rating exists and belongs to the user
    const existingRating = await prisma.rating.findUnique({
      where: { id: ratingId },
      include: { recipe: true },
    })

    if (!existingRating) {
      return { success: false, message: "Rating not found" }
    }

    if (existingRating.userId !== user.id && user.role !== "Admin") {
      return { success: false, message: "You do not have permission to delete this rating" }
    }

    // Delete the rating
    await prisma.rating.delete({
      where: { id: ratingId },
    })

    revalidatePath(`/recipes/${existingRating.recipeId}`)
    return { success: true, message: "Rating deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete rating. Please try again." }
  }
}
