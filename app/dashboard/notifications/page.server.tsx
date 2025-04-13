import { getCurrentUser } from "@/lib/auth"
import { getNotifications } from "@/app/actions/notifications"
import { redirect } from "next/navigation"
import NotificationsPage from "./page"

export default async function NotificationsPageServer() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { notifications } = await getNotifications()

  return <NotificationsPage notifications={notifications} />
}
