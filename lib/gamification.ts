// Gamification and learning progress management
export interface UserProfile {
  id: number
  user_id: number
  display_name: string
  avatar_url?: string
  current_level: number
  total_points: number
  current_streak: number
  longest_streak: number
  last_activity_date: string
  learning_language: string
  native_language: string
  daily_goal: number
}

export interface Course {
  id: number
  title: string
  description: string
  language_code: string
  difficulty_level: string
  total_lessons: number
  estimated_hours: number
  is_premium: boolean
  thumbnail_url?: string
  progress?: number
}

export interface Lesson {
  id: number
  course_id: number
  title: string
  description: string
  lesson_order: number
  lesson_type: string
  content: any
  points_reward: number
  estimated_minutes: number
  is_premium: boolean
  status?: string
  score?: number
}

export interface Badge {
  id: number
  name: string
  description: string
  icon_url?: string
  badge_type: string
  requirement_value: number
  points_reward: number
  earned?: boolean
  earned_at?: string
}

export interface LeaderboardEntry {
  user_id: number
  display_name: string
  avatar_url?: string
  points: number
  rank_position: number
}

// Gamification service
export class GamificationService {
  static async getUserProfile(userId: number): Promise<UserProfile | null> {
    // In real app, this would fetch from database
    return {
      id: 1,
      user_id: userId,
      display_name: "Language Learner",
      current_level: 5,
      total_points: 1250,
      current_streak: 12,
      longest_streak: 25,
      last_activity_date: new Date().toISOString().split("T")[0],
      learning_language: "en",
      native_language: "es",
      daily_goal: 20,
    }
  }

  static async updateStreak(userId: number): Promise<void> {
    // Update user's daily streak
    console.log(`Updating streak for user ${userId}`)
  }

  static async awardPoints(userId: number, points: number, reason: string): Promise<void> {
    // Award points to user
    console.log(`Awarding ${points} points to user ${userId} for ${reason}`)
  }

  static async checkBadgeEligibility(userId: number): Promise<Badge[]> {
    // Check if user has earned any new badges
    return []
  }

  static async getLeaderboard(type = "weekly", limit = 10): Promise<LeaderboardEntry[]> {
    // Mock leaderboard data
    return [
      { user_id: 1, display_name: "Sarah Chen", points: 2450, rank_position: 1 },
      { user_id: 2, display_name: "Mike Johnson", points: 2380, rank_position: 2 },
      { user_id: 3, display_name: "Ana Rodriguez", points: 2250, rank_position: 3 },
      { user_id: 4, display_name: "David Kim", points: 2100, rank_position: 4 },
      { user_id: 5, display_name: "Emma Wilson", points: 1950, rank_position: 5 },
    ]
  }

  static calculateLevel(totalPoints: number): number {
    // Calculate user level based on total points
    if (totalPoints < 100) return 1
    if (totalPoints < 300) return 2
    if (totalPoints < 600) return 3
    if (totalPoints < 1000) return 4
    if (totalPoints < 1500) return 5
    if (totalPoints < 2100) return 6
    if (totalPoints < 2800) return 7
    if (totalPoints < 3600) return 8
    if (totalPoints < 4500) return 9
    return 10
  }

  static getPointsForNextLevel(currentPoints: number): number {
    const level = this.calculateLevel(currentPoints)
    const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500]
    return levelThresholds[level] || 5500
  }
}

// Lesson content types and structures
export interface TranslationExercise {
  type: "translation"
  source_text: string
  target_language: string
  correct_translation: string
  hints?: string[]
}

export interface ListeningExercise {
  type: "listening"
  audio_url: string
  transcript: string
  questions: {
    question: string
    options: string[]
    correct_answer: number
  }[]
}

export interface SpeakingExercise {
  type: "speaking"
  prompt: string
  target_phrases: string[]
  pronunciation_tips?: string[]
}

export interface FillBlankExercise {
  type: "fill_blank"
  text: string
  blanks: {
    position: number
    correct_answer: string
    options?: string[]
  }[]
}

export interface MultipleChoiceExercise {
  type: "multiple_choice"
  questions: {
    question: string
    options: string[]
    correct_answer: number
    explanation?: string
  }[]
}

export interface StoryLesson {
  type: "story"
  title: string
  content: string
  vocabulary: {
    word: string
    definition: string
    pronunciation?: string
  }[]
  comprehension_questions: {
    question: string
    options: string[]
    correct_answer: number
  }[]
}

export type LessonContent =
  | TranslationExercise
  | ListeningExercise
  | SpeakingExercise
  | FillBlankExercise
  | MultipleChoiceExercise
  | StoryLesson

// Sample lesson data
export const sampleLessons: Lesson[] = [
  {
    id: 1,
    course_id: 1,
    title: "Basic Greetings",
    description: "Learn common English greetings",
    lesson_order: 1,
    lesson_type: "multiple_choice",
    content: {
      type: "multiple_choice",
      questions: [
        {
          question: "How do you say 'hello' formally in English?",
          options: ["Hi", "Good morning", "Hey", "What's up"],
          correct_answer: 1,
          explanation: "'Good morning' is a formal greeting used in professional settings.",
        },
        {
          question: "Which greeting is most casual?",
          options: ["Good evening", "How do you do", "Hey there", "Good afternoon"],
          correct_answer: 2,
          explanation: "'Hey there' is very casual and used with friends.",
        },
      ],
    },
    points_reward: 10,
    estimated_minutes: 3,
    is_premium: false,
  },
  {
    id: 2,
    course_id: 1,
    title: "Translate Simple Sentences",
    description: "Practice translating basic English sentences",
    lesson_order: 2,
    lesson_type: "translation",
    content: {
      type: "translation",
      source_text: "I am learning English.",
      target_language: "es",
      correct_translation: "Estoy aprendiendo inglés.",
      hints: ["'am learning' = 'estoy aprendiendo'", "'English' = 'inglés'"],
    },
    points_reward: 15,
    estimated_minutes: 5,
    is_premium: false,
  },
  {
    id: 3,
    course_id: 1,
    title: "Fill in the Blanks",
    description: "Complete sentences with the correct words",
    lesson_order: 3,
    lesson_type: "fill_blank",
    content: {
      type: "fill_blank",
      text: "My name ___ John and I ___ from New York.",
      blanks: [
        {
          position: 1,
          correct_answer: "is",
          options: ["is", "are", "am", "be"],
        },
        {
          position: 2,
          correct_answer: "am",
          options: ["is", "are", "am", "be"],
        },
      ],
    },
    points_reward: 12,
    estimated_minutes: 4,
    is_premium: false,
  },
]

// Course data
export const sampleCourses: Course[] = [
  {
    id: 1,
    title: "English Basics",
    description: "Learn fundamental English grammar and vocabulary",
    language_code: "en",
    difficulty_level: "beginner",
    total_lessons: 25,
    estimated_hours: 10,
    is_premium: false,
    thumbnail_url: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Conversational English",
    description: "Practice real-world English conversations",
    language_code: "en",
    difficulty_level: "intermediate",
    total_lessons: 30,
    estimated_hours: 15,
    is_premium: false,
    thumbnail_url: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Business English",
    description: "Professional English for the workplace",
    language_code: "en",
    difficulty_level: "advanced",
    total_lessons: 20,
    estimated_hours: 12,
    is_premium: true,
    thumbnail_url: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Spanish Fundamentals",
    description: "Basic Spanish for beginners",
    language_code: "es",
    difficulty_level: "beginner",
    total_lessons: 28,
    estimated_hours: 12,
    is_premium: false,
    thumbnail_url: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "French Essentials",
    description: "Essential French vocabulary and grammar",
    language_code: "fr",
    difficulty_level: "beginner",
    total_lessons: 26,
    estimated_hours: 11,
    is_premium: false,
    thumbnail_url: "/placeholder.svg?height=200&width=300",
  },
]

// Badge definitions
export const availableBadges: Badge[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first lesson",
    badge_type: "lessons",
    requirement_value: 1,
    points_reward: 50,
  },
  {
    id: 2,
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    badge_type: "streak",
    requirement_value: 7,
    points_reward: 100,
  },
  {
    id: 3,
    name: "Century Club",
    description: "Earn 100 total points",
    badge_type: "points",
    requirement_value: 100,
    points_reward: 25,
  },
  {
    id: 4,
    name: "Dedicated Learner",
    description: "Complete 10 lessons",
    badge_type: "lessons",
    requirement_value: 10,
    points_reward: 75,
  },
  {
    id: 5,
    name: "Month Master",
    description: "Maintain a 30-day streak",
    badge_type: "streak",
    requirement_value: 30,
    points_reward: 500,
  },
]
