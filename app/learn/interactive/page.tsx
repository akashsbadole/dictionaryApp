"use client"

import { useState, useEffect } from "react"
import { Play, Trophy, Target, Star, Award, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import {
  GamificationService,
  sampleCourses,
  availableBadges,
  type UserProfile,
  type Course,
  type LeaderboardEntry,
} from "@/lib/gamification"

export default function InteractiveLearningPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [badges, setBadges] = useState<LeaderboardEntry[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [selectedTab, setSelectedTab] = useState("dashboard")
  const [user] = useState({ id: 1, email: "learner@example.com", role: "user" })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const profile = await GamificationService.getUserProfile(1)
      setUserProfile(profile)

      const coursesData = sampleCourses.map((course) => ({
        ...course,
        progress: Math.floor(Math.random() * 100), // Mock progress
      }))
      setCourses(coursesData)

      const badgesData = availableBadges.map((badge) => ({
        ...badge,
        earned: Math.random() > 0.6, // Mock earned status
      }))
      setBadges(badgesData)

      const leaderboardData = await GamificationService.getLeaderboard()
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLanguageFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      en: "🇺🇸",
      es: "🇪🇸",
      fr: "🇫🇷",
      de: "🇩🇪",
      it: "🇮🇹",
      ja: "🇯🇵",
      zh: "🇨🇳",
      pt: "🇧🇷",
    }
    return flags[code] || "🌍"
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p>Loading your learning dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Interactive Learning</h1>
            <p className="text-xl text-gray-600">Master languages through gamified lessons and community challenges</p>
          </div>

          {/* User Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userProfile.total_points}</div>
                <div className="text-sm opacity-90">Total Points</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userProfile.current_streak}</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">Level {userProfile.current_level}</div>
                <div className="text-sm opacity-90">Current Level</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{badges.filter((b) => b.earned).length}</div>
                <div className="text-sm opacity-90">Badges Earned</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Progress Overview */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Goal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Daily Learning Goal</span>
                          <span className="text-sm text-gray-600">12 / {userProfile.daily_goal} minutes</span>
                        </div>
                        <Progress value={(12 / userProfile.daily_goal) * 100} className="h-3" />
                        <p className="text-sm text-gray-600">
                          You're {userProfile.daily_goal - 12} minutes away from reaching your daily goal!
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Continue Learning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {courses.slice(0, 3).map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-2xl">{getLanguageFlag(course.language_code)}</div>
                            <div className="flex-1">
                              <h3 className="font-medium">{course.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={course.progress || 0} className="flex-1 h-2" />
                                <span className="text-sm text-gray-600">{course.progress}%</span>
                              </div>
                            </div>
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Continue
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {badges
                          .filter((b) => b.earned)
                          .slice(0, 3)
                          .map((badge) => (
                            <div key={badge.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Trophy className="h-4 w-4 text-yellow-800" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{badge.name}</p>
                                <p className="text-xs text-gray-600">{badge.description}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Friends Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            S
                          </div>
                          <div>
                            <p className="text-sm font-medium">Sarah completed a lesson</p>
                            <p className="text-xs text-gray-600">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            M
                          </div>
                          <div>
                            <p className="text-sm font-medium">Mike earned a new badge</p>
                            <p className="text-xs text-gray-600">5 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            A
                          </div>
                          <div>
                            <p className="text-sm font-medium">Ana started a new course</p>
                            <p className="text-xs text-gray-600">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getLanguageFlag(course.language_code)}</span>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                        </div>
                        {course.is_premium && (
                          <UIBadge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Premium
                          </UIBadge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{course.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <UIBadge className={getDifficultyColor(course.difficulty_level)}>
                            {course.difficulty_level}
                          </UIBadge>
                          <span className="text-gray-600">{course.estimated_hours}h</span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress || 0} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{course.total_lessons} lessons</span>
                          <span>{Math.floor(((course.progress || 0) / 100) * course.total_lessons)} completed</span>
                        </div>

                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          {course.progress === 0 ? "Start Course" : "Continue"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                  <Card key={badge.id} className={`${badge.earned ? "bg-yellow-50 border-yellow-200" : "opacity-60"}`}>
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          badge.earned ? "bg-yellow-400" : "bg-gray-300"
                        }`}
                      >
                        <Trophy className={`h-8 w-8 ${badge.earned ? "text-yellow-800" : "text-gray-600"}`} />
                      </div>
                      <h3 className="font-semibold mb-2">{badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                      <div className="flex items-center justify-center gap-2">
                        <UIBadge variant={badge.earned ? "default" : "secondary"}>
                          {badge.earned ? "Earned" : "Locked"}
                        </UIBadge>
                        <UIBadge variant="outline">+{badge.points_reward} pts</UIBadge>
                      </div>
                      {badge.earned && (
                        <p className="text-xs text-gray-500 mt-2">Earned on {new Date().toLocaleDateString()}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Leaderboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaderboard.map((entry, index) => (
                        <div key={entry.user_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0
                                ? "bg-yellow-400 text-yellow-800"
                                : index === 1
                                  ? "bg-gray-300 text-gray-700"
                                  : index === 2
                                    ? "bg-orange-300 text-orange-800"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {entry.rank_position}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{entry.display_name}</p>
                            <p className="text-sm text-gray-600">{entry.points} points</p>
                          </div>
                          {index < 3 && (
                            <Trophy
                              className={`h-5 w-5 ${
                                index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-orange-400"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Ranking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                        #6
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{userProfile.total_points} points</p>
                        <p className="text-gray-600">This week</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">You're 150 points away from 5th place!</p>
                        <Progress value={75} className="h-2" />
                      </div>
                      <Button variant="outline" className="w-full">
                        <Target className="h-4 w-4 mr-2" />
                        Set Weekly Goal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Language Clubs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">🇺🇸 English Learners</h3>
                          <UIBadge variant="outline">2.3k members</UIBadge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Practice English with learners from around the world
                        </p>
                        <Button size="sm" variant="outline">
                          Join Club
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">🇪🇸 Spanish Conversation</h3>
                          <UIBadge variant="outline">1.8k members</UIBadge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Improve your Spanish through daily conversations</p>
                        <Button size="sm" variant="outline">
                          Join Club
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">🇫🇷 French Grammar Masters</h3>
                          <UIBadge variant="outline">956 members</UIBadge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Master French grammar with expert guidance</p>
                        <Button size="sm" variant="outline">
                          Join Club
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Discussions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                        <h4 className="font-medium text-sm">Tips for improving pronunciation</h4>
                        <p className="text-xs text-gray-600 mt-1">Sarah Chen • English Learners • 2 hours ago</p>
                        <p className="text-sm mt-2">I've been struggling with English pronunciation. Any tips for...</p>
                      </div>

                      <div className="p-3 border-l-4 border-green-500 bg-green-50">
                        <h4 className="font-medium text-sm">Spanish verb conjugations</h4>
                        <p className="text-xs text-gray-600 mt-1">Mike Johnson • Spanish Conversation • 4 hours ago</p>
                        <p className="text-sm mt-2">Can someone explain the difference between ser and estar?</p>
                      </div>

                      <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                        <h4 className="font-medium text-sm">French listening resources</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Ana Rodriguez • French Grammar Masters • 6 hours ago
                        </p>
                        <p className="text-sm mt-2">Looking for good French podcasts for beginners...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
