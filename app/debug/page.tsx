"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"

export default function DebugPage() {
  const { user, isLoading } = useAuth()
  const [authTest, setAuthTest] = useState<any>(null)
  const [isTestLoading, setIsTestLoading] = useState(false)

  async function testAuth() {
    setIsTestLoading(true)
    try {
      const res = await fetch("/api/auth/test")
      const data = await res.json()
      setAuthTest(data)
    } catch (error) {
      console.error("Error testing auth:", error)
      toast({
        title: "Error",
        description: "Failed to test authentication",
        variant: "destructive",
      })
    } finally {
      setIsTestLoading(false)
    }
  }

  useEffect(() => {
    testAuth()
  }, [])

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>

      <div className="grid gap-6">
        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Auth Context State</CardTitle>
            <CardDescription>Current authentication state from the Auth Provider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-auto">
              <pre className="text-sm">{isLoading ? "Loading..." : JSON.stringify({ user, isLoading }, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
            <CardDescription>Result from the authentication test API endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-auto mb-4">
              <pre className="text-sm">{isTestLoading ? "Loading..." : JSON.stringify(authTest, null, 2)}</pre>
            </div>
            <Button onClick={testAuth} disabled={isTestLoading}>
              {isTestLoading ? "Testing..." : "Test Authentication"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
