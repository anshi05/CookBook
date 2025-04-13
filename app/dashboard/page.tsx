import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Clock, Star, Heart, BookOpen, Bell, History, ChevronRight, Edit } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { getNotifications } from "../actions/notifications"
import { formatDistanceToNow } from "date-fns"
import DeleteRecipeButton from "@/components/delete-recipe-button"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's recipes
  const myRecipes = await prisma.recipe.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 6,
  })

  // Fetch saved recipes (for now, we'll use ratings as a proxy for saved recipes)
  const savedRecipes = await prisma.rating.findMany({
    where: { userId: user.id, rating: { gte: 4 } },
    include: {
      recipe: {
        include: {
          ratings: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  })

  // Fetch recently viewed recipes (for now, we'll use a simple query)
  const historyItems = await prisma.recipe.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  })

  // Fetch notifications
  const { notifications } = await getNotifications()

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav />

      <main className="flex-1 p-6 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your recipes and collections</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/recipes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Recipe
            </Link>
          </Button>
        </div>

        <div className="grid gap-6">
          <Tabs defaultValue="my-recipes" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="my-recipes" className="data-[state=active]:bg-primary/10">
                <BookOpen className="mr-2 h-4 w-4" />
                My Recipes
              </TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-primary/10">
                <Heart className="mr-2 h-4 w-4" />
                Saved
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary/10">
                <History className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/10">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-recipes" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-all"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt={recipe.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background"
                          asChild
                        >
                          <Link href={`/recipes/edit/${recipe.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteRecipeButton recipeId={recipe.id} />
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
                          {/* Calculate average rating */}
                          {0}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="border-dashed border-border/50 bg-background/30 hover:bg-background/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[250px] text-center">
                    <div className="rounded-full bg-primary/10 p-3 mb-4">
                      <PlusCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Add a New Recipe</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Share your culinary creations with the community
                    </p>
                    <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" asChild>
                      <Link href="/recipes/new">Create Recipe</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedRecipes.map(({ recipe }) => (
                  <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                    <Card className="overflow-hidden h-full border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-all group">
                      <div className="relative h-48 w-full">
                        <Image
                          src="/placeholder.svg?height=400&width=600"
                          alt={recipe.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background/90"
                          >
                            <Heart className="h-4 w-4 fill-primary text-primary" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{recipe.title}</h3>
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
                            {/* Calculate average rating */}
                            {recipe.ratings.length > 0
                              ? (recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length).toFixed(
                                  1,
                                )
                              : "0"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recently Viewed</CardTitle>
                  <CardDescription>Recipes you've viewed recently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {historyItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src="/placeholder.svg?height=80&width=80"
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Viewed {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/recipes/${item.id}`}>
                            <span>View</span>
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Stay updated with the latest activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg ${!notification.isRead ? "bg-primary/5 border-l-2 border-primary" : "bg-muted/30"}`}
                        >
                          <div className="flex gap-4">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                              <Image src="/placeholder.svg?height=100&width=100" alt="" fill className="object-cover" />
                            </div>
                            <div>
                              <p className="text-sm">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(notification.sentTime), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No notifications yet</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
