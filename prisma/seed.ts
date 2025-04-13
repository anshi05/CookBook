const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

async function main() {
  console.log("Starting seed process...")

  try {
    // Create users
    console.log("Creating users...")
    const adminPassword = await hashPassword("admin123")
    const userPassword = await hashPassword("user123")

    const admin = await prisma.user.upsert({
      where: { email: "admin@cookbook.com" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@cookbook.com",
        password: adminPassword,
        role: "Admin",
      },
    })

    const user1 = await prisma.user.upsert({
      where: { email: "chef@cookbook.com" },
      update: {},
      create: {
        name: "Chef Maria",
        email: "chef@cookbook.com",
        password: userPassword,
        role: "User",
      },
    })

    const user2 = await prisma.user.upsert({
      where: { email: "john@cookbook.com" },
      update: {},
      create: {
        name: "John Smith",
        email: "john@cookbook.com",
        password: userPassword,
        role: "User",
      },
    })

    console.log("Created users:", { admin: admin.id, user1: user1.id, user2: user2.id })

    // Create categories
    console.log("Creating categories...")
    const categories = [
      { categoryName: "Italian" },
      { categoryName: "Asian" },
      { categoryName: "Mexican" },
      { categoryName: "Mediterranean" },
      { categoryName: "Desserts" },
      { categoryName: "Breakfast" },
      { categoryName: "Vegetarian" },
      { categoryName: "Seafood" },
    ]

    for (const category of categories) {
      await prisma.category.upsert({
        where: { categoryName: category.categoryName },
        update: {},
        create: category,
      })
    }

    console.log("Created categories")

    // Create suppliers
    console.log("Creating suppliers...")
    const suppliers = [
      { supplierName: "Fresh Farms", contactInfo: "contact@freshfarms.com" },
      { supplierName: "Spice World", contactInfo: "info@spiceworld.com" },
      { supplierName: "Dairy Delights", contactInfo: "orders@dairydelights.com" },
    ]

    const createdSuppliers = []
    for (const supplier of suppliers) {
      const createdSupplier = await prisma.supplier.upsert({
        where: { supplierName: supplier.supplierName },
        update: {},
        create: supplier,
      })
      createdSuppliers.push(createdSupplier)
    }

    console.log("Created suppliers")

    // Create ingredients
    console.log("Creating ingredients...")
    const ingredients = [
      { name: "Pasta", category: "Grains", supplierId: createdSuppliers[0].id },
      { name: "Tomatoes", category: "Vegetables", supplierId: createdSuppliers[0].id },
      { name: "Garlic", category: "Vegetables", supplierId: createdSuppliers[0].id },
      { name: "Parmesan Cheese", category: "Dairy", supplierId: createdSuppliers[2].id },
      { name: "Basil", category: "Herbs", supplierId: createdSuppliers[1].id },
      { name: "Olive Oil", category: "Oils", supplierId: createdSuppliers[1].id },
      { name: "Chicken", category: "Meat", supplierId: createdSuppliers[0].id },
      { name: "Rice", category: "Grains", supplierId: createdSuppliers[0].id },
      { name: "Soy Sauce", category: "Condiments", supplierId: createdSuppliers[1].id },
      { name: "Ginger", category: "Vegetables", supplierId: createdSuppliers[1].id },
    ]

    const createdIngredients = []
    for (const ingredient of ingredients) {
      const createdIngredient = await prisma.ingredient.create({
        data: ingredient,
      })
      createdIngredients.push(createdIngredient)
    }

    console.log("Created ingredients")

    // Create recipes
    console.log("Creating recipes...")
    const recipes = [
      {
        title: "Creamy Garlic Parmesan Pasta",
        description:
          "A rich and creamy pasta dish that's perfect for a quick weeknight dinner. This garlic parmesan pasta is incredibly flavorful and ready in just 25 minutes!",
        cuisine: "Italian",
        prepTime: 10,
        cookTime: 15,
        userId: user1.id,
        instructions: `
1. Bring a large pot of salted water to a boil. Add pasta and cook according to package directions until al dente. Reserve 1/2 cup of pasta water before draining.
2. While pasta is cooking, melt butter in a large skillet over medium heat. Add minced garlic and sauté for 1-2 minutes until fragrant, being careful not to burn it.
3. Reduce heat to medium-low and add heavy cream. Simmer for 3-4 minutes until it starts to thicken slightly.
4. Gradually whisk in the Parmesan cheese until melted and smooth. Season with salt and pepper.
5. Add the drained pasta to the sauce and toss to coat. If the sauce is too thick, add a splash of the reserved pasta water to reach desired consistency.
6. Serve immediately, garnished with additional Parmesan cheese and chopped parsley.
        `,
        ingredients: [
          { ingredientId: createdIngredients[0].id, quantity: 8, unit: "oz" },
          { ingredientId: createdIngredients[2].id, quantity: 4, unit: "cloves" },
          { ingredientId: createdIngredients[3].id, quantity: 1, unit: "cup" },
          { ingredientId: createdIngredients[4].id, quantity: 2, unit: "tbsp" },
          { ingredientId: createdIngredients[5].id, quantity: 2, unit: "tbsp" },
        ],
      },
      {
        title: "Spicy Thai Basil Chicken",
        description:
          "A flavorful and spicy Thai dish that comes together in minutes. This basil chicken is aromatic and perfect served over steamed rice.",
        cuisine: "Asian",
        prepTime: 15,
        cookTime: 15,
        userId: user1.id,
        instructions: `
1. Heat oil in a large wok or skillet over high heat.
2. Add garlic and chili peppers and stir-fry for 30 seconds until fragrant.
3. Add chicken and stir-fry for 2-3 minutes until it begins to change color.
4. Add soy sauce, fish sauce, and sugar. Continue to stir-fry until chicken is cooked through, about 5 minutes.
5. Add basil leaves and stir until wilted.
6. Serve hot over steamed rice.
        `,
        ingredients: [
          { ingredientId: createdIngredients[6].id, quantity: 1, unit: "lb" },
          { ingredientId: createdIngredients[2].id, quantity: 5, unit: "cloves" },
          { ingredientId: createdIngredients[4].id, quantity: 1, unit: "cup" },
          { ingredientId: createdIngredients[7].id, quantity: 2, unit: "cups" },
          { ingredientId: createdIngredients[8].id, quantity: 2, unit: "tbsp" },
          { ingredientId: createdIngredients[9].id, quantity: 1, unit: "tbsp" },
        ],
      },
      {
        title: "Classic Chocolate Brownies",
        description:
          "Rich, fudgy brownies that are perfect for dessert or a sweet treat any time of day. These brownies have a crackly top and chewy center.",
        cuisine: "Desserts",
        prepTime: 15,
        cookTime: 25,
        userId: user2.id,
        instructions: `
1. Preheat oven to 350°F (175°C). Line an 8-inch square baking pan with parchment paper.
2. Melt butter and chocolate together in a microwave-safe bowl, stirring every 30 seconds until smooth.
3. Whisk in sugar until well combined. Add eggs one at a time, whisking well after each addition.
4. Stir in vanilla extract.
5. Fold in flour, cocoa powder, and salt until just combined. Do not overmix.
6. Pour batter into prepared pan and smooth the top.
7. Bake for 25-30 minutes, or until a toothpick inserted in the center comes out with a few moist crumbs.
8. Allow to cool completely before cutting into squares.
        `,
        ingredients: [
          { ingredientId: createdIngredients[3].id, quantity: 0.5, unit: "cup" }, // Using cheese as butter for demo
          { ingredientId: createdIngredients[1].id, quantity: 1, unit: "cup" }, // Using tomatoes as chocolate for demo
          { ingredientId: createdIngredients[0].id, quantity: 1, unit: "cup" }, // Using pasta as flour for demo
        ],
      },
    ]

    for (const recipe of recipes) {
      const { ingredients, ...recipeData } = recipe

      const createdRecipe = await prisma.recipe.create({
        data: recipeData,
      })

      // Create recipe ingredients
      for (const ingredient of ingredients) {
        await prisma.recipeIngredient.create({
          data: {
            recipeId: createdRecipe.id,
            ...ingredient,
          },
        })
      }

      // Create some ratings
      await prisma.rating.create({
        data: {
          recipeId: createdRecipe.id,
          userId: user2.id,
          rating: 5,
          comment: "Absolutely delicious! Will definitely make again.",
        },
      })

      if (recipe.title === "Spicy Thai Basil Chicken") {
        await prisma.rating.create({
          data: {
            recipeId: createdRecipe.id,
            userId: admin.id,
            rating: 4,
            comment: "Great flavor but a bit too spicy for me.",
          },
        })
      }
    }

    console.log("Created recipes with ingredients and ratings")

    // Create notifications
    console.log("Creating notifications...")
    await prisma.notification.create({
      data: {
        userId: user1.id,
        message: "Welcome to CookBook! Start by adding your favorite recipes.",
        isRead: false,
      },
    })

    await prisma.notification.create({
      data: {
        userId: user1.id,
        message: "Someone rated your Creamy Garlic Parmesan Pasta recipe!",
        isRead: false,
      },
    })

    console.log("Created notifications")
    console.log("Seed completed successfully!")
  } catch (error) {
    console.error("Error during seed:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error("Failed to seed database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
