"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
  const user = await getCurrentUser()

  if (!user) {
    return { notifications: [], unreadCount: 0 }
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { sentTime: "desc" },
  })

  const unreadCount = await prisma.notification.count({
    where: {
      userId: user.id,
      isRead: false,
    },
  })

  return { notifications, unreadCount }
}

export async function markNotificationAsRead(notificationId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to update notifications" }
  }

  try {
    // Check if the notification belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.userId !== user.id) {
      return { success: false, message: "Notification not found" }
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, message: "Failed to update notification" }
  }
}

export async function markAllNotificationsAsRead() {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to update notifications" }
  }

  try {
    await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: { isRead: true },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, message: "Failed to update notifications" }
  }
}

export async function deleteNotification(notificationId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to delete notifications" }
  }

  try {
    // Check if the notification belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.userId !== user.id) {
      return { success: false, message: "Notification not found" }
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, message: "Failed to delete notification" }
  }
}
