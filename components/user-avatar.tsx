import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserInitials, getUserAvatarColor } from "@/lib/image-utils"

interface UserAvatarProps {
  user: {
    name: string
    image?: string | null
  }
  className?: string
  size?: "sm" | "md" | "lg"
}

export function UserAvatar({ user, className = "", size = "md" }: UserAvatarProps) {
  const initials = getUserInitials(user.name)
  const bgColor = getUserAvatarColor(user.name)

  // Determine size class
  const sizeClass = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-xl",
  }[size]

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      {user.image && <AvatarImage src={user.image || "/food.jpg"} alt={user.name} />}
      <AvatarFallback style={{ backgroundColor: bgColor }} className="text-white font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
