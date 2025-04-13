"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"
import { createRecipe } from "@/app/actions/recipes"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

type Ingredient = {
  name: string
  quantity: number
  unit: string
}

export default function NewRecipePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: 1, unit: "g" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { user, isLoading } = useAuth()

  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push("/login")
    return null
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 1, unit: "g" }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    }
    setIngredients(newIngredients)
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    // Add ingredients to form data
    formData.append("ingredients", JSON.stringify(ingredients))

    try {
      const result = await createRecipe(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push(`/recipes/${result.recipeId}`)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>

      <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle>Recipe Details</CardTitle>
          <CardDescription>Share your culinary creation with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Recipe Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Creamy Garlic Parmesan Pasta"
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Briefly describe your recipe..."
                    className="bg-background/50 min-h-[100px]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine</Label>
                  <Select name="cuisine">
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="Asian">Asian</SelectItem>
                      <SelectItem value="Mexican">Mexican</SelectItem>
                      <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                  <Input id="prepTime" name="prepTime" type="number" min="1" className="bg-background/50" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                  <Input id="cookTime" name="cookTime" type="number" min="1" className="bg-background/50" required />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ingredients</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addIngredient}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Ingredient
                  </Button>
                </div>

                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`ingredient-${index}`}>Name</Label>
                        <Input
                          id={`ingredient-${index}`}
                          value={ingredient.name}
                          onChange={(e) => updateIngredient(index, "name", e.target.value)}
                          placeholder="e.g., Flour"
                          className="bg-background/50"
                          required
                        />
                      </div>
                      <div className="w-20 space-y-2">
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={ingredient.quantity}
                          onChange={(e) => updateIngredient(index, "quantity", Number.parseFloat(e.target.value))}
                          className="bg-background/50"
                          required
                        />
                      </div>
                      <div className="w-24 space-y-2">
                        <Label htmlFor={`unit-${index}`}>Unit</Label>
                        <Select
                          value={ingredient.unit}
                          onValueChange={(value) => updateIngredient(index, "unit", value)}
                        >
                          <SelectTrigger className="bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="l">l</SelectItem>
                            <SelectItem value="tsp">tsp</SelectItem>
                            <SelectItem value="tbsp">tbsp</SelectItem>
                            <SelectItem value="cup">cup</SelectItem>
                            <SelectItem value="piece">piece</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        disabled={ingredients.length === 1}
                        className="mb-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  placeholder="Step-by-step instructions for your recipe..."
                  className="bg-background/50 min-h-[200px]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? "Creating..." : "Create Recipe"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
