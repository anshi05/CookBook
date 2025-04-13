# CookBook - Recipe Management System

A modern, dark-themed UI for a cookbook/recipe management system built with Next.js, Tailwind CSS, and MySQL.

## Features

- User authentication (login/signup)
- Recipe management (create, edit, delete)
- Recipe search and filtering by category/cuisine
- Rating and commenting system
- Save favorite recipes
- User profiles
- Dashboard with saved recipes, history, and notifications
- Admin panel for managing users, recipes, and categories

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL database

### Setup

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/cookbook-ui.git
cd cookbook-ui
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

\`\`\`
# Database Connection
DATABASE_URL="mysql://username:password@localhost:3306/cookbook_db"

# Authentication
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

4. Set up the database and seed data:

\`\`\`bash
# Generate Prisma client
npm run prisma:generate

# Run migrations to create database tables
npm run prisma:migrate

# Seed the database with initial data
npm run prisma:seed

# Or run all of the above with one command
npm run db:setup
\`\`\`

5. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Reset

If you need to reset the database and start fresh:

\`\`\`bash
npm run db:reset
\`\`\`

This will drop all tables, run migrations, and seed the database with fresh data.

## Default Users

After seeding, you can log in with the following credentials:

- Admin User:
  - Email: admin@cookbook.com
  - Password: admin123

- Regular User:
  - Email: chef@cookbook.com
  - Password: user123

## Troubleshooting

### Seeding Issues

If you encounter issues with seeding:

1. Make sure your MySQL server is running
2. Check that your DATABASE_URL is correct in the .env file
3. Try resetting the database with `npm run db:reset`
4. Check the console for specific error messages

### Authentication Issues

If you have trouble logging in:

1. Ensure JWT_SECRET is set in your .env file
2. Clear your browser cookies
3. Check that the user exists in the database

## License

This project is licensed under the MIT License.
\`\`\`

## 10. Let's create a script to check database connectivity:
