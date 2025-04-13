"use client"
import { use } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Loader2 } from "lucide-react"
import { updateRecipe } from "@/app/actions/recipes"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

type Ingredient = {
  name: string
  quantity: number
  unit: string
}

type RecipeFormData = {
  title: string
  description: string
  cuisine: string
  prepTime: number
  cookTime: number
  instructions: string
}

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const recipeId = Number.parseInt(id)
  const [recipe, setRecipe] = useState<any>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cuisine: "",
    prepTime: 0,
    cookTime: 0,
    instructions: ""
  })

  // Fetch recipe data
  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch(`/api/recipes/${recipeId}`)
        if (!response.ok) {
          throw new Error("Recipe not found")
        }
        const data = await response.json()
        setRecipe(data)

        // Set form data from recipe
        setFormData({
          title: data.title || "",
          description: data.description || "",
          cuisine: data.cuisine || "",
          prepTime: data.prepTime || 0,
          cookTime: data.cookTime || 0,
          instructions: data.instructions || ""
        })
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load recipe. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }

    fetchRecipe()
  }, [recipeId, router, toast])

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Add ingredient input
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 1, unit: "g" }])
  }

  // Remove ingredient input
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  // Update ingredient field
  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    }
    setIngredients(newIngredients)
  }

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle number field changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "prepTime" || name === "cookTime" ? parseInt(value) || 0 : value    }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update recipe")

      toast({
        title: "Success",
        description: "Recipe updated successfully",
      })
      router.push(`/recipes/${recipeId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recipe",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading recipe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Recipe</h1>

      <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle>Recipe Details</CardTitle>
          <CardDescription>Update your recipe information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Briefly describe your recipe..."
                    className="bg-background/50 min-h-[100px]"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine</Label>
                  <Select 
                    value={formData.cuisine}
                    onValueChange={(value) => handleSelectChange("cuisine", value)}
                  >
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
                  <Input
                    id="prepTime"
                    name="prepTime"
                    type="number"
                    min="1"
                    className="bg-background/50"
                    value={formData.prepTime}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                  <Input
                    id="cookTime"
                    name="cookTime"
                    type="number"
                    min="1"
                    className="bg-background/50"
                    value={formData.cookTime}
                    onChange={handleNumberChange}
                    required
                  />
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
                          onChange={(e) => updateIngredient(index, "quantity", Math.max(0.1, Number.parseFloat(e.target.value)))}
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
                  value={formData.instructions}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}