import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react"
import RecipeCard from "@/components/recipe-card"
import { getRecipes } from "../actions/recipes"
import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const cuisine = typeof searchParams.cuisine === "string" ? searchParams.cuisine : ""
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  const { recipes, pagination } = await getRecipes({
    search,
    cuisine,
    page,
    limit: 9,
  })

  // Get all cuisines for filter
  const cuisines = await prisma.recipe.groupBy({
    by: ["cuisine"],
    where: {
      cuisine: {
        not: null,
      },
    },
  })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Recipes</h1>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search recipes..."
              className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/50"
              defaultValue={search}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90">
              Search
            </Button>
            <Button variant="outline" size="icon" className="border-border/50">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Tabs defaultValue="grid" className="w-[120px]">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="grid" className="data-[state=active]:bg-background">
                  <Grid3X3 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-background">
                  <LayoutList className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/30 backdrop-blur-sm border border-border/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select name="cuisine" defaultValue={cuisine}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {cuisines.map((item) => (
                  <SelectItem key={item.cuisine} value={item.cuisine || "other"}>
                    {item.cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Any Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Difficulty</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time (minutes)</label>
            <div className="pt-2 px-2">
              <Slider defaultValue={[60]} max={120} step={5} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 min</span>
              <span>60 min</span>
              <span>120 min</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Most Popular" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="time-asc">Quickest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={pagination.page <= 1} asChild>
              <Link
                href={`/recipes?page=${pagination.page - 1}${search ? `&search=${search}` : ""}${cuisine ? `&cuisine=${cuisine}` : ""}`}
              >
                Previous
              </Link>
            </Button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant="outline"
                size="sm"
                className={pageNum === pagination.page ? "bg-primary/10 border-primary" : ""}
                asChild
              >
                <Link
                  href={`/recipes?page=${pageNum}${search ? `&search=${search}` : ""}${cuisine ? `&cuisine=${cuisine}` : ""}`}
                >
                  {pageNum}
                </Link>
              </Button>
            ))}

            <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} asChild>
              <Link
                href={`/recipes?page=${pagination.page + 1}${search ? `&search=${search}` : ""}${cuisine ? `&cuisine=${cuisine}` : ""}`}
              >
                Next
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
