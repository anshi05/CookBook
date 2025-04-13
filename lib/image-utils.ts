/**
 * Utility functions for handling images
 */

/**
 * Generates a recipe image URL based on the recipe title
 * Uses Unsplash API to get relevant food images
 */
export function getRecipeImageUrl(title: string, width = 600, height = 400): string {
  // Clean the title to get better search results
  const searchTerm = title
    .toLowerCase()
    .replace(/creamy|spicy|classic|homemade|easy|quick|healthy/gi, "")
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .join(" ")
    .trim()

  const finalSearchTerm = searchTerm || title.split(" ")[0]

  // Use Unsplash source for food images
  return `https://source.unsplash.com/random/${width}x${height}/?food,${encodeURIComponent(finalSearchTerm)},recipe,cooking`
}

/**
 * Generates a user avatar with initials
 */
export function getUserInitials(name: string): string {
  if (!name) return ""

  const parts = name.split(" ")
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Generates a color based on the user's name
 * This ensures the same user always gets the same color
 */
export function getUserAvatarColor(name: string): string {
  if (!name) return "hsl(var(--primary))"

  // Simple hash function to generate a number from a string
  const hash = name.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)

  // Use the hash to generate a hue value (0-360)
  const hue = hash % 360

  // Return a HSL color with fixed saturation and lightness
  return `hsl(${hue}, 70%, 40%)`
}
