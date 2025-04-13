import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, Users, BookOpen, Star } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About CookBook</h1>

        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-8">
          <Image src="/food.jpg?height=400&width=1200" alt="Cooking together" fill className="object-cover" />
        </div>

        <div className="prose prose-invert max-w-none mb-12">
          <p className="lead text-xl text-muted-foreground">
            CookBook is a digital recipe management system designed to help food enthusiasts discover, create, and share
            culinary creations with a community of like-minded individuals.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to make cooking more accessible, enjoyable, and social. We believe that good food brings
            people together, and we're committed to building a platform that celebrates the joy of cooking and sharing
            meals.
          </p>

          <h2>What We Offer</h2>
          <p>
            CookBook provides a comprehensive set of tools for managing your recipes, discovering new dishes, and
            connecting with other food enthusiasts. From detailed recipe pages with step-by-step instructions to
            personalized collections and community features, we've designed every aspect of CookBook to enhance your
            culinary journey.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Key Features</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3 mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Our Team</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {team.map((member, index) => (
            <Card key={index} className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                  <Image src={member.avatar || "/food.jpg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    title: "Recipe Management",
    description: "Create, store, and organize your recipes with detailed instructions, ingredients, and cooking times.",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
  },
  {
    title: "Community Sharing",
    description: "Share your culinary creations and discover recipes from food enthusiasts worldwide.",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    title: "Ratings & Reviews",
    description: "Rate recipes and leave detailed reviews to help others find the best dishes.",
    icon: <Star className="h-6 w-6 text-primary" />,
  },
  {
    title: "Expert Guidance",
    description: "Access cooking tips, techniques, and guidance from experienced chefs and home cooks.",
    icon: <ChefHat className="h-6 w-6 text-primary" />,
  },
]

const team = [
  {
    name: "Alex Johnson",
    role: "Founder & Head Chef",
    bio: "Professional chef with 15 years of experience in top restaurants around the world.",
    avatar: "/food.jpg?height=200&width=200",
  },
  {
    name: "Maria Rodriguez",
    role: "Recipe Developer",
    bio: "Culinary school graduate specializing in fusion cuisine and innovative cooking techniques.",
    avatar: "/food.jpg?height=200&width=200",
  },
  {
    name: "David Chen",
    role: "Community Manager",
    bio: "Food blogger and social media expert passionate about building culinary communities.",
    avatar: "/food.jpg?height=200&width=200",
  },
]
