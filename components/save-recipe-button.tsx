"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { saveRecipe, unsaveRecipe, isRecipeSaved } from "@/app/actions/saved-recipes"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

interface SaveRecipeButtonProps {
  recipeId: number
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function SaveRecipeButton({
  recipeId,
  variant = "outline",
  size = "icon",
  className,
}: SaveRecipeButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    async function checkIfSaved() {
      if (!user) {
        setIsChecking(false)
        return
      }

      try {
        const saved = await isRecipeSaved(recipeId)
        setIsSaved(saved)
      } catch (error) {
        console.error("Error checking if recipe is saved:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkIfSaved()
  }, [recipeId, user])

  async function handleToggleSave() {
    if (!user) {
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      if (isSaved) {
        const result = await unsaveRecipe(recipeId)
        if (result.success) {
          setIsSaved(false)
          toast({
            title: "Success",
            description: result.message,
          })
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } else {
        const result = await saveRecipe(recipeId)
        if (result.success) {
          setIsSaved(true)
          toast({
            title: "Success",
            description: result.message,
          })
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      router.refresh()
    }
  }

  if (isChecking) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Heart className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleToggleSave}
      disabled={isLoading}
      aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
    >
      <Heart className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
      {size !== "icon" && <span className="ml-2">{isSaved ? "Saved" : "Save"}</span>}
    </Button>
  )
}
