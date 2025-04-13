"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      categoryName: "asc",
    },
  })

  return categories
}

export async function createCategory(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || user.role !== "Admin") {
    return { success: false, message: "You do not have permission to create categories" }
  }

  try {
    const categoryName = formData.get("categoryName") as string

    if (!categoryName || categoryName.trim() === "") {
      return { success: false, message: "Category name is required" }
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: { categoryName },
    })

    if (existingCategory) {
      return { success: false, message: "Category already exists" }
    }

    await prisma.category.create({
      data: { categoryName },
    })

    revalidatePath("/admin")
    return { success: true, message: "Category created successfully" }
  } catch (error) {
    return { success: false, message: "Failed to create category. Please try again." }
  }
}

export async function deleteCategory(categoryId: number) {
  const user = await getCurrentUser()

  if (!user || user.role !== "Admin") {
    return { success: false, message: "You do not have permission to delete categories" }
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    })

    revalidatePath("/admin")
    return { success: true, message: "Category deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete category. Please try again." }
  }
}
