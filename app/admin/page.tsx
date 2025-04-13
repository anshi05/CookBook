import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users, BookOpen, TrendingUp, CheckCircle, XCircle, MoreHorizontal, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DashboardNav from "@/components/dashboard-nav"

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav />

      <main className="flex-1 p-6 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, recipes, and site content</p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,853</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7,429</div>
                <p className="text-xs text-muted-foreground">+32% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">-4% from last week</p>
              </CardContent>
            </Card>
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary/10">
              Users
            </TabsTrigger>
            <TabsTrigger value="recipes" className="data-[state=active]:bg-primary/10">
              Recipes
            </TabsTrigger>
            <TabsTrigger value="approvals" className="data-[state=active]:bg-primary/10">
              Approvals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search users..."
                        className="pl-8 w-[200px] md:w-[300px] bg-background/50"
                      />
                    </div>
                    <Button variant="outline">
                      Export
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "Active" ? "default" : "outline"}
                            className={
                              user.status === "Active"
                                ? "bg-green-500/20 text-green-600 hover:bg-green-500/30 hover:text-green-700"
                                : ""
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit user</DropdownMenuItem>
                              <DropdownMenuItem>Reset password</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Suspend user</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipes">
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recipe Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search recipes..."
                        className="pl-8 w-[200px] md:w-[300px] bg-background/50"
                      />
                    </div>
                    <Button variant="outline">
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipe</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipes.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell className="font-medium">{recipe.title}</TableCell>
                        <TableCell>{recipe.author}</TableCell>
                        <TableCell>{recipe.category}</TableCell>
                        <TableCell>{recipe.rating}</TableCell>
                        <TableCell>
                          <Badge
                            variant={recipe.status === "Published" ? "default" : "outline"}
                            className={
                              recipe.status === "Published"
                                ? "bg-green-500/20 text-green-600 hover:bg-green-500/30 hover:text-green-700"
                                : ""
                            }
                          >
                            {recipe.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View recipe</DropdownMenuItem>
                              <DropdownMenuItem>Edit recipe</DropdownMenuItem>
                              <DropdownMenuItem>Feature recipe</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Remove recipe</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review and approve user-submitted recipes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipe</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell className="font-medium">{approval.title}</TableCell>
                        <TableCell>{approval.author}</TableCell>
                        <TableCell>{approval.category}</TableCell>
                        <TableCell>{approval.submitted}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 text-green-600 border-green-600/20 hover:bg-green-500/10 hover:text-green-700 hover:border-green-600/30"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "Admin",
    status: "Active",
    joined: "Jan 12, 2023",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@example.com",
    role: "User",
    status: "Active",
    joined: "Mar 4, 2023",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    role: "Editor",
    status: "Active",
    joined: "Feb 18, 2023",
  },
  {
    id: 4,
    name: "James Rodriguez",
    email: "james.r@example.com",
    role: "User",
    status: "Inactive",
    joined: "Apr 22, 2023",
  },
  {
    id: 5,
    name: "Olivia Taylor",
    email: "olivia.t@example.com",
    role: "User",
    status: "Active",
    joined: "May 9, 2023",
  },
]

const recipes = [
  {
    id: 1,
    title: "Creamy Garlic Parmesan Pasta",
    author: "Sarah Johnson",
    category: "Italian",
    rating: "4.8 ★",
    status: "Published",
  },
  {
    id: 2,
    title: "Spicy Thai Basil Chicken",
    author: "Michael Chen",
    category: "Asian",
    rating: "4.7 ★",
    status: "Published",
  },
  {
    id: 3,
    title: "Classic Beef Tacos",
    author: "Emma Wilson",
    category: "Mexican",
    rating: "4.9 ★",
    status: "Published",
  },
  {
    id: 4,
    title: "Chocolate Lava Cake",
    author: "James Rodriguez",
    category: "Desserts",
    rating: "4.9 ★",
    status: "Draft",
  },
  {
    id: 5,
    title: "Mediterranean Grilled Salmon",
    author: "Olivia Taylor",
    category: "Seafood",
    rating: "4.6 ★",
    status: "Published",
  },
]

const approvals = [
  {
    id: 1,
    title: "Vegan Mushroom Risotto",
    author: "Daniel Brown",
    category: "Vegetarian",
    submitted: "2 hours ago",
  },
  {
    id: 2,
    title: "Spicy Korean Fried Chicken",
    author: "Sophia Kim",
    category: "Asian",
    submitted: "5 hours ago",
  },
  {
    id: 3,
    title: "Authentic Greek Moussaka",
    author: "Alex Papadopoulos",
    category: "Mediterranean",
    submitted: "1 day ago",
  },
  {
    id: 4,
    title: "Triple Chocolate Brownies",
    author: "Mia Johnson",
    category: "Desserts",
    submitted: "1 day ago",
  },
  {
    id: 5,
    title: "Homemade Sourdough Bread",
    author: "Thomas Wright",
    category: "Baking",
    submitted: "2 days ago",
  },
]
