"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Check } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { markAllNotificationsAsRead, markNotificationAsRead } from "@/app/actions/notifications"

export default function NotificationsPage({
  notifications = [],
}: {
  notifications?: any[]
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleMarkAllAsRead() {
    setIsLoading(true)

    try {
      const result = await markAllNotificationsAsRead()

      if (result.success) {
        toast({
          title: "Success",
          description: "All notifications marked as read",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update notifications",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleMarkAsRead(id: number) {
    try {
      const result = await markNotificationAsRead(id)

      if (result.success) {
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update notification",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav />

      <main className="flex-1 p-6 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with the latest activity</p>
          </div>

          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={isLoading}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Your latest updates and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg ${!notification.isRead ? "bg-primary/5 border-l-2 border-primary" : "bg-muted/30"}`}
                  >
                    <div className="flex gap-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image src="/food.jpg?height=100&width=100" alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.sentTime), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted/30 p-3 mb-4">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No notifications yet</h3>
                  <p className="text-sm text-muted-foreground">When you get notifications, they'll show up here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
