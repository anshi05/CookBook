import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { prisma } from "@/lib/db"
import RecipeCard from "@/components/recipe-card"
import { formatDate } from "@/lib/utils"

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const userId = Number.parseInt(params.id)

  if (isNaN(userId)) {
    notFound()
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  })

  if (!user) {
    notFound()
  }

  // Get user's recipes
  const recipes = await prisma.recipe.findMany({
    where: { userId },
    include: {
      ratings: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  })

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

  // Get user's ratings
  const ratings = await prisma.rating.findMany({
    where: { userId },
    include: {
      recipe: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/3">
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                    <Image src="/placeholder.svg?height=200&width=200" alt={user.name} fill className="object-cover" />
                  </div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-primary text-sm mb-4">{user.role}</p>
                  <p className="text-sm text-muted-foreground mb-6">Member since {formatDate(user.createdAt)}</p>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="text-center p-3 bg-muted/30 rounded-md">
                      <p className="text-2xl font-bold">{recipes.length}</p>
                      <p className="text-xs text-muted-foreground">Recipes</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-md">
                      <p className="text-2xl font-bold">{ratings.length}</p>
                      <p className="text-xs text-muted-foreground">Reviews</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-2/3">
            <Tabs defaultValue="recipes" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="recipes">Recipes</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="recipes" className="mt-6">
                {recipesWithRating.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recipesWithRating.map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No recipes yet</p>
                    <Button asChild>
                      <Link href="/recipes/new">Create a Recipe</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                {ratings.length > 0 ? (
                  <div className="space-y-6">
                    {ratings.map((rating) => (
                      <Card key={rating.id} className="bg-background/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Link href={`/recipes/${rating.recipe.id}`} className="font-medium hover:text-primary">
                                {rating.recipe.title}
                              </Link>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${i < rating.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Recipe by{" "}
                              <Link href={`/profile/${rating.recipe.user.id}`} className="text-primary hover:underline">
                                {rating.recipe.user.name}
                              </Link>
                            </p>
                            {rating.comment && <p className="text-sm mt-2">{rating.comment}</p>}
                            <p className="text-xs text-muted-foreground mt-2">
                              Reviewed on {formatDate(rating.createdAt)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No reviews yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
