import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCuisineIcon(cuisine: string | null): string {
  switch (cuisine?.toLowerCase()) {
    case "italian":
      return "🍝"
    case "asian":
    case "chinese":
    case "japanese":
    case "thai":
      return "🍜"
    case "mexican":
      return "🌮"
    case "desserts":
    case "dessert":
      return "🍰"
    case "breakfast":
      return "🍳"
    case "vegetarian":
    case "vegan":
      return "🥗"
    case "seafood":
      return "🦞"
    case "grilling":
    case "bbq":
      return "🍖"
    case "soups":
    case "soup":
      return "🍲"
    case "baking":
      return "🍞"
    case "drinks":
    case "beverages":
      return "🍹"
    default:
      return "🍽️"
  }
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
