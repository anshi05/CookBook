import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import RecipeCard from "@/components/recipe-card"
import { getCuisineIcon } from "@/lib/utils"
import type { Metadata } from "next"

interface CategoryPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.slug)
  return {
    title: `${categoryName} Recipes | CookBook`,
    description: `Discover delicious ${categoryName.toLowerCase()} recipes from our community.`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const categoryName = decodeURIComponent(params.slug)
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const limit = 12

  // Get recipes for this category/cuisine
  const recipes = await prisma.recipe.findMany({
    where: {
      cuisine: {
        equals: categoryName,
        mode: "insensitive",
      },
    },
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
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  })

  // Get total count for pagination
  const totalRecipes = await prisma.recipe.count({
    where: {
      cuisine: {
        equals: categoryName,
        mode: "insensitive",
      },
    },
  })

  if (recipes.length === 0 && page === 1) {
    notFound()
  }

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

  const totalPages = Math.ceil(totalRecipes / limit)

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="text-4xl">{getCuisineIcon(categoryName)}</div>
        <div>
          <h1 className="text-3xl font-bold">{categoryName} Recipes</h1>
          <p className="text-muted-foreground mt-1">
            Showing {recipesWithRating.length} of {totalRecipes} recipes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipesWithRating.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <a
                key={pageNum}
                href={`/categories/${encodeURIComponent(categoryName)}?page=${pageNum}`}
                className={`px-4 py-2 rounded-md ${
                  pageNum === page ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {pageNum}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
