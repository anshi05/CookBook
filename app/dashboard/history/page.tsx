import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

export default async function HistoryPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // For now, we'll just show recent recipes as a proxy for history
  // In a real app, you'd track user views in a separate table
  const recentRecipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav />

      <main className="flex-1 p-6 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Browsing History</h1>
            <p className="text-muted-foreground">Recently viewed recipes</p>
          </div>
        </div>

        <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recently Viewed</CardTitle>
            <CardDescription>Recipes you've viewed recently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecipes.length > 0 ? (
                recentRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src="/food.jpg?height=80&width=80"
                        alt={recipe.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{recipe.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Viewed {formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/recipes/${recipe.id}`}>
                        <span>View</span>
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No viewing history yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
