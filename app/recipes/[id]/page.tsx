import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChefHat, Share2, Printer, Star, MessageSquare } from "lucide-react"
import { getRecipeById } from "@/app/actions/recipes"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import RatingForm from "@/components/rating-form"
import { getCurrentUser } from "@/lib/auth"
import SaveRecipeButton from "@/components/save-recipe-button"
import { isRecipeSaved } from "@/app/actions/saved-recipes"
import { UserAvatar } from "@/components/user-avatar"

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipeId = Number.parseInt(params.id)
  const recipe = await getRecipeById(recipeId)
  const currentUser = await getCurrentUser()

  if (!recipe) {
    notFound()
  }

  // Check if user has already rated this recipe
  const userRating = recipe.ratings.find((rating) => currentUser && rating.user.id === currentUser.id)

  // Check if recipe is saved
  const isSaved = currentUser ? await isRecipeSaved(recipeId) : false

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src="/food.jpg?height=800&width=1200"
          alt={recipe.title}
          fill
          className="object-cover brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-background/80 backdrop-blur-md shadow-xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground">
                    {recipe.cuisine || "Other"}
                  </Badge>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center">
                    <ChefHat className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {recipe.prepTime > 30 ? "Advanced" : recipe.prepTime > 15 ? "Medium" : "Easy"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">4 servings</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(recipe.averageRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">{recipe.averageRating}</span>
                    <span className="ml-1 text-sm text-muted-foreground">({recipe.ratings.length} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <SaveRecipeButton recipeId={recipe.id} variant="outline" size="sm" className="rounded-full" />
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-8">{recipe.description}</p>

                <Tabs defaultValue="instructions" className="mb-8">
                  <TabsList className="bg-muted/50 w-full justify-start">
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="instructions" className="pt-6">
                    <div className="prose prose-invert max-w-none">
                      {recipe.instructions.split("\n").map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="ingredients" className="pt-6">
                    <div className="space-y-3">
                      {recipe.recipeIngredients.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Checkbox id={`ingredient-${index}`} />
                          <label
                            htmlFor={`ingredient-${index}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item.quantity} {item.unit} {item.ingredient.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="nutrition" className="pt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-muted/30 text-center">
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="text-2xl font-bold">520</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 text-center">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="text-2xl font-bold">18g</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 text-center">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="text-2xl font-bold">42g</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 text-center">
                        <p className="text-sm text-muted-foreground">Fat</p>
                        <p className="text-2xl font-bold">32g</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="pt-6">
                    <div className="space-y-6">
                      {recipe.ratings.length > 0 ? (
                        recipe.ratings.map((review) => (
                          <div key={review.id} className="border-b border-border/50 pb-6 last:border-0">
                            <div className="flex items-center gap-3 mb-3">
                            <UserAvatar user={review.user} size="sm" />
                              <div>
                                <p className="font-medium">{review.user.name}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                      )}

                      {currentUser ? (
                        userRating ? (
                          <div className="bg-muted/20 p-4 rounded-lg">
                            <p className="text-sm mb-2">You've already rated this recipe</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < userRating.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <RatingForm recipeId={recipe.id} />
                        )
                      ) : (
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/login">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Login to Write a Review
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-background/80 backdrop-blur-md shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">About the Chef</h3>
                <div className="flex items-center gap-3 mb-4">
                  <UserAvatar user={recipe.user} />
                  <div>
                    <p className="font-medium">{recipe.user.name}</p>
                    <p className="text-sm text-muted-foreground">Recipe Creator</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Sharing delicious recipes with the CookBook community.
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/profile/${recipe.user.id}`}>View Profile</Link>
                </Button>
              </div>
            </Card>

            <Card className="border-border/50 bg-background/80 backdrop-blur-md shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">You Might Also Like</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((id) => (
                    <Link href={`/recipes/${id}`} key={id} className="flex gap-3 group">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src="/food.jpg?height=80&width=80"
                          alt="Related recipe"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                          {id === 1
                            ? "Garlic Butter Shrimp Pasta"
                            : id === 2
                              ? "Classic Carbonara"
                              : "Pesto Pasta with Cherry Tomatoes"}
                        </h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-xs text-muted-foreground">(42)</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {id === 1 ? "30 min • Medium" : id === 2 ? "25 min • Easy" : "20 min • Easy"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
