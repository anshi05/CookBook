import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <ChefHat className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button size="lg" asChild>
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/recipes">
            <Search className="mr-2 h-5 w-5" />
            Browse Recipes
          </Link>
        </Button>
      </div>
    </div>
  )
}
