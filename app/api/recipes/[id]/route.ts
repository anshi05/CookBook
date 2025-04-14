import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET: Fetch recipe by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recipeId = Number.parseInt(params.id)

    if (isNaN(recipeId)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 })
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        user: { select: { id: true, name: true } },
        recipeIngredients: {
          include: { ingredient: true },
        },
        ratings: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    const ratings = recipe.ratings.map((r) => r.rating)
    const averageRating =
      ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

    return NextResponse.json({
      ...recipe,
      averageRating: Number.parseFloat(averageRating.toFixed(1)),
      ratingCount: ratings.length,
    })
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// PUT: Update recipe by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recipeId = Number.parseInt(params.id)

    if (isNaN(recipeId)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 })
    }

    const body = await request.json()

    // Only allow specific fields to be updated
    const { title, description, imageUrl } = body

    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title,
        description,
        imageUrl,
      },
    })

    return NextResponse.json({ message: "Recipe updated successfully", recipe: updatedRecipe })
  } catch (error) {
    console.error("Error updating recipe:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
