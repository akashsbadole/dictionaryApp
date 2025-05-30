"use client"

import { useState } from "react"
import { Plus, Upload, BarChart3, Users, BookOpen, TrendingUp, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"

// Mock admin user
const adminUser = { email: "admin@opendict.com", role: "admin" }

// Mock statistics data
const stats = {
  totalWords: 15420,
  totalDefinitions: 23150,
  totalUsers: 1250,
  dailySearches: 8940,
  recentAdditions: 45,
  pendingReviews: 12,
}

// Mock recent activity data
const recentActivity = [
  { id: 1, action: "Word Added", word: "cryptocurrency", user: "admin", time: "2 hours ago" },
  { id: 2, action: "Definition Updated", word: "algorithm", user: "editor1", time: "4 hours ago" },
  { id: 3, action: "CSV Import", details: "500 words imported", user: "admin", time: "1 day ago" },
  { id: 4, action: "User Registered", user: "newuser@email.com", time: "1 day ago" },
  { id: 5, action: "Word Added", word: "blockchain", user: "admin", time: "2 days ago" },
]

// Mock popular searches
const popularSearches = [
  { word: "algorithm", searches: 1250 },
  { word: "artificial intelligence", searches: 980 },
  { word: "blockchain", searches: 750 },
  { word: "machine learning", searches: 680 },
  { word: "cryptocurrency", searches: 520 },
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={adminUser} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your dictionary database and monitor activity</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <Button asChild>
              <Link href="/admin/words/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Word
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/import">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Words</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{stats.recentAdditions} from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Definitions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDefinitions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Searches</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dailySearches.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="words">Words</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">
                            {activity.word && `Word: ${activity.word}`}
                            {activity.details && activity.details}
                            {activity.user && ` by ${activity.user}`}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Searches */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Searches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {popularSearches.map((search, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{search.word}</p>
                          <p className="text-sm text-gray-600">{search.searches} searches</p>
                        </div>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col" asChild>
                    <Link href="/admin/words/new">
                      <Plus className="h-6 w-6 mb-2" />
                      Add New Word
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col" asChild>
                    <Link href="/admin/import">
                      <Upload className="h-6 w-6 mb-2" />
                      Import CSV Data
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col" asChild>
                    <Link href="/admin/export">
                      <Download className="h-6 w-6 mb-2" />
                      Export Database
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="words" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Word Management</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search words..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button asChild>
                      <Link href="/admin/words/new">Add Word</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Word management interface would be implemented here</p>
                  <p className="text-sm">Including search, edit, delete, and bulk operations</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Analytics charts and reports would be implemented here</p>
                  <p className="text-sm">Including search trends, user activity, and word popularity</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <p>System configuration options would be implemented here</p>
                  <p className="text-sm">Including API settings, user management, and data sources</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
