"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Brain, Puzzle, MessageCircle, Trophy, Clock, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const learningModules = [
  {
    id: "grammar",
    title: "Grammar Lessons",
    description: "Master English grammar with interactive lessons and exercises",
    icon: BookOpen,
    color: "bg-blue-500",
    lessons: 24,
    progress: 65,
    href: "/learn/grammar",
  },
  {
    id: "exercises",
    title: "Sentence Building",
    description: "Practice constructing sentences with guided exercises",
    icon: Brain,
    color: "bg-green-500",
    lessons: 18,
    progress: 40,
    href: "/learn/exercises",
  },
  {
    id: "puzzles",
    title: "Word Puzzles",
    description: "Fun word games including crosswords and word searches",
    icon: Puzzle,
    color: "bg-purple-500",
    lessons: 15,
    progress: 80,
    href: "/learn/puzzles",
  },
  {
    id: "conversation",
    title: "Audio Conversations",
    description: "Practice speaking with interactive audio dialogues",
    icon: MessageCircle,
    color: "bg-orange-500",
    lessons: 12,
    progress: 25,
    href: "/learn/conversation",
  },
]

const recentActivity = [
  { activity: "Completed Present Simple Quiz", score: "8/10", time: "2 hours ago" },
  { activity: "Finished Word Search Puzzle", score: "Perfect", time: "1 day ago" },
  { activity: "Grammar Exercise: Articles", score: "9/10", time: "2 days ago" },
  { activity: "Conversation Practice", score: "Good", time: "3 days ago" },
]

const achievements = [
  { title: "Grammar Master", description: "Complete 10 grammar lessons", earned: true },
  { title: "Puzzle Solver", description: "Solve 5 word puzzles", earned: true },
  { title: "Conversation Starter", description: "Complete first audio conversation", earned: false },
  { title: "Quiz Champion", description: "Score 100% on any quiz", earned: false },
]

export default function LearnPage() {
  const [user] = useState(null) // Mock user state

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Learn English</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Improve your English skills with interactive lessons, exercises, and games designed for all levels
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">24h</div>
                <div className="text-sm text-gray-600">Study Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">7</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">B1</div>
                <div className="text-sm text-gray-600">Current Level</div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Modules */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningModules.map((module) => {
                const IconComponent = module.icon
                return (
                  <Card key={module.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${module.color}`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{module.lessons} lessons</span>
                          <span className="font-medium">{module.progress}% complete</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                        <Button asChild className="w-full">
                          <Link href={module.href}>Continue Learning</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{activity.activity}</p>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                        <Badge variant="secondary">{activity.score}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Achievements */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                        <div className={`p-2 rounded-full ${achievement.earned ? "bg-yellow-100" : "bg-gray-100"}`}>
                          <Trophy className={`h-5 w-5 ${achievement.earned ? "text-yellow-600" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                            {achievement.title}
                          </p>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        {achievement.earned && <Badge variant="default">Earned</Badge>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Quick Actions */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Daily Challenge</h3>
                  <p className="text-sm text-gray-600 mb-4">Complete today's grammar challenge</p>
                  <Button variant="outline" size="sm">
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Puzzle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Random Puzzle</h3>
                  <p className="text-sm text-gray-600 mb-4">Solve a quick word puzzle</p>
                  <Button variant="outline" size="sm">
                    Play Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Practice Speaking</h3>
                  <p className="text-sm text-gray-600 mb-4">Have a quick conversation</p>
                  <Button variant="outline" size="sm">
                    Start Talking
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
