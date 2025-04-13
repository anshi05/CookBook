import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getSavedRecipes } from "@/app/actions/saved-recipes"
import SaveRecipeButton from "@/components/save-recipe-button"

export default async function SavedRecipesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch saved recipes
  const { recipes: savedRecipes } = await getSavedRecipes()

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav />

      <main className="flex-1 p-6 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Saved Recipes</h1>
            <p className="text-muted-foreground">Your favorite recipes</p>
          </div>
        </div>

        {savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="overflow-hidden h-full border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-all group"
              >
                <div className="relative h-48 w-full">
                  <Link href={`/recipes/${recipe.id}`}>
                    <Image
                      src="/food.jpg?height=400&width=600"
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="absolute top-2 right-2">
                    <SaveRecipeButton
                      recipeId={recipe.id}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background/90"
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/recipes/${recipe.id}`}>
                      <h3 className="font-semibold hover:text-primary">{recipe.title}</h3>
                    </Link>
                    <Badge variant="outline" className="text-xs">
                      {recipe.cuisine || "Other"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {recipe.prepTime + recipe.cookTime} min
                    </div>
                    <div className="flex items-center">
                      <Star className="mr-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                      {recipe.averageRating.toFixed(1)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't saved any recipes yet</p>
            <Button asChild>
              <Link href="/recipes">Explore Recipes</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
