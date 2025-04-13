"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Star } from "lucide-react"
import { addRating } from "@/app/actions/ratings"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface RatingFormProps {
  recipeId: number
}

export default function RatingForm({ recipeId }: RatingFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    formData.set("rating", rating.toString())

    try {
      const result = await addRating(recipeId, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.refresh()
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
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1"
            >
              <Star
                className={`h-6 w-6 ${
                  value <= (hoveredRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          Your Review (Optional)
        </label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Share your thoughts about this recipe..."
          className="bg-background/50 min-h-[100px]"
        />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
        <MessageSquare className="h-4 w-4 mr-2" />
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
