"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, History, Bell, Settings, LogOut, ChefHat, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useAuth } from "./auth-provider"
import { logout } from "@/app/actions/auth"
import { UserAvatar } from "@/components/user-avatar"

export default function DashboardNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const routes = [
    {
      href: "/dashboard",
      label: "My Recipes",
      icon: BookOpen,
    },
    {
      href: "/dashboard/saved",
      label: "Saved Recipes",
      icon: Heart,
    },
    {
      href: "/dashboard/history",
      label: "History",
      icon: History,
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-background/95 backdrop-blur-xl p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <ChefHat className="h-6 w-6 text-primary" />
                <span className="font-bold">CookBook</span>
              </div>
            </div>
            <div className="flex flex-col flex-1 p-6">
              <div className="flex items-center gap-3 mb-8">
                {user && <UserAvatar user={user} size="sm" />}
                <div>
                  <p className="font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || "User"}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      pathname === route.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-6">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden md:flex flex-col w-64 border-r border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-screen sticky top-0">
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="font-bold">CookBook</span>
          </div>
        </div>

        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-center gap-3 mb-8">
            {user && <UserAvatar user={user} size="sm" />}
            <div>
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.role || "User"}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  pathname === route.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            <form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
