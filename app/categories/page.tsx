import { prisma } from "@/lib/db"
import CategoryCard from "@/components/category-card"
import { getCuisineIcon } from "@/lib/utils"

export default async function CategoriesPage() {
  // Get categories with recipe counts
  const cuisines = await prisma.recipe.groupBy({
    by: ["cuisine"],
    where: {
      cuisine: {
        not: null,
      },
    },
    _count: {
      id: true,
    },
  })

  const categories = cuisines.map((cuisine, index) => ({
    id: index + 1,
    name: cuisine.cuisine || "Other",
    icon: getCuisineIcon(cuisine.cuisine),
    count: cuisine._count.id,
  }))

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Recipe Categories</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
