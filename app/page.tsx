import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronRight, Clock, Star, BookOpen, ChefHat, User } from 'lucide-react'
import RecipeCard from "@/components/recipe-card"
import CategoryCard from "@/components/category-card"
import { getRecipes } from "./actions/recipes"
import { prisma } from "@/lib/db"
import { getCuisineIcon } from "@/lib/utils"

export default async function Home() {
  // Get top recipes
  const { recipes: topRecipes } = await getRecipes({
    limit: 3,
  })
  
  // Get categories
  const cuisines = await prisma.recipe.groupBy({
    by: ['cuisine'],
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.webp"
            alt="Delicious food"
            fill
            className="object-cover blur-[2px] brightness-[0.4]"
            priority
          />
        </div>
        <div className="container relative z-10 flex flex-col items-center text-center gap-8 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-md">
            Discover, Cook & Share
            <span className="block text-primary mt-2">Your Digital Cookbook</span>
          </h1>
          <form action="/recipes" className="w-full max-w-2xl relative">
            <Input
              type="search"
              name="search"
              placeholder="Search for recipes, ingredients, cuisines..."
              className="h-12 pl-12 pr-4 rounded-full border-2 border-primary/50 bg-background/30 backdrop-blur-md text-white placeholder:text-white/70 focus-visible:ring-primary/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
            <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full h-8 px-4 bg-primary text-primary-foreground">
              Search
            </Button>
          </form>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30" asChild>
              <Link href="/recipes">
                Explore Recipes
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-2 border-primary/70 text-white hover:bg-primary/20 shadow-[0_0_10px_rgba(74,222,128,0.3)] hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]" asChild>
              <Link href="/recipes/new">
                Add Your Recipe
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Top Recipes Section */}
      <section className="py-16 container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Top Recipes</h2>
          <Link href="/recipes" className="text-primary hover:text-primary/80 flex items-center">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose CookBook</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background/50 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-sm">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Culinary Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of food enthusiasts who are discovering, sharing, and cooking amazing recipes every day.
          </p>
          <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" asChild>
            <Link href="/login">
              Sign Up Now — It's Free
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    title: "Personalized Collections",
    description: "Save your favorite recipes and create custom collections for any occasion.",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
  },
  {
    title: "Step-by-Step Guidance",
    description: "Follow clear instructions with timers and checkboxes to make cooking easier.",
    icon: <ChefHat className="h-8 w-8 text-primary" />,
  },
  {
    title: "Community Sharing",
    description: "Share your culinary creations and discover recipes from food enthusiasts worldwide.",
    icon: <User className="h-8 w-8 text-primary" />,
  },
]
