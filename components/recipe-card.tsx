import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"

interface RecipeCardProps {
  recipe: {
    id: number
    title: string
    cuisine: string | null
    prepTime: number
    cookTime: number
    averageRating: number
    ratingCount: number
  }
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="overflow-hidden group h-full border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:shadow-primary/5">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src="/food.jpg?height=400&width=600"
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary text-primary-foreground">
            {recipe.cuisine || "Other"}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{recipe.title}</h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm">{recipe.averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground ml-1">({recipe.ratingCount})</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            <Badge variant="outline" className="text-xs border-muted-foreground/30">
              {recipe.prepTime > 30 ? "Advanced" : recipe.prepTime > 15 ? "Medium" : "Easy"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
