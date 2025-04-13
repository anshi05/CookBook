import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  category: {
    id: number
    name: string
    icon: string
    count: number
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${encodeURIComponent(category.name)}`}>
      <Card className="overflow-hidden h-full border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:bg-accent/50 group">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <span className="text-3xl mb-2">{category.icon}</span>
          <h3 className="font-medium group-hover:text-primary transition-colors">{category.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{category.count} recipes</p>
        </CardContent>
      </Card>
    </Link>
  )
}
