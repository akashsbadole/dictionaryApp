"use client"

import { useState, useEffect } from "react"
import { Play, CheckCircle, Clock, ArrowRight, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

interface GrammarTopic {
  id: number
  title: string
  slug: string
  description: string
  content: string
  difficulty_level: string
  category: string
  examples: string[]
  completed: boolean
}

interface Exercise {
  id: number
  title: string
  instruction: string
  exercise_type: string
  content: any
  difficulty_level: string
  points: number
}

const grammarTopics: GrammarTopic[] = [
  {
    id: 1,
    title: "Present Simple Tense",
    slug: "present-simple",
    description: "Learn about the present simple tense for habits and facts",
    content:
      "The present simple tense is used to describe habits, facts, and general truths. It is formed with the base form of the verb (add -s for third person singular).",
    difficulty_level: "beginner",
    category: "tenses",
    examples: ["I eat breakfast every morning.", "She works in an office.", "The sun rises in the east."],
    completed: true,
  },
  {
    id: 2,
    title: "Articles: A, An, The",
    slug: "articles",
    description: "Understanding when to use definite and indefinite articles",
    content:
      "Articles are words that define nouns. 'A' and 'an' are indefinite articles, while 'the' is the definite article.",
    difficulty_level: "beginner",
    category: "parts of speech",
    examples: ["I saw a cat.", "She is an engineer.", "The book is on the table."],
    completed: false,
  },
  {
    id: 3,
    title: "Past Perfect Tense",
    slug: "past-perfect",
    description: "Learn about actions completed before another past action",
    content:
      "The past perfect tense shows that an action was completed before another action in the past. It is formed with 'had' + past participle.",
    difficulty_level: "intermediate",
    category: "tenses",
    examples: ["I had finished my homework before dinner.", "She had left when I arrived."],
    completed: false,
  },
]

const exercises: Exercise[] = [
  {
    id: 1,
    title: "Present Simple Practice",
    instruction: "Fill in the blanks with the correct form of the verb",
    exercise_type: "fill_blank",
    content: {
      sentences: [
        { text: "She _____ (work) in a hospital.", answer: "works" },
        { text: "They _____ (play) football every weekend.", answer: "play" },
        { text: "The train _____ (arrive) at 9 AM.", answer: "arrives" },
      ],
    },
    difficulty_level: "beginner",
    points: 10,
  },
  {
    id: 2,
    title: "Choose the Correct Article",
    instruction: "Select the appropriate article for each sentence",
    exercise_type: "multiple_choice",
    content: {
      questions: [
        { text: "I need ___ umbrella.", options: ["a", "an", "the"], correct: 1 },
        { text: "___ sun is bright today.", options: ["a", "an", "the"], correct: 2 },
        { text: "She is ___ honest person.", options: ["a", "an", "the"], correct: 1 },
      ],
    },
    difficulty_level: "beginner",
    points: 15,
  },
]

export default function GrammarPage() {
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [exerciseAnswers, setExerciseAnswers] = useState<{ [key: number]: string }>({})
  const [exerciseResults, setExerciseResults] = useState<{ [key: number]: boolean }>({})
  const [showResults, setShowResults] = useState(false)
  const [user] = useState(null)

  useEffect(() => {
    if (grammarTopics.length > 0) {
      setSelectedTopic(grammarTopics[0])
    }
  }, [])

  const playAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang.startsWith("en")) || null
      speechSynthesis.speak(utterance)
    }
  }

  const handleExerciseAnswer = (questionIndex: number, answer: string) => {
    setExerciseAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const checkExercise = () => {
    if (!selectedExercise) return

    const results: { [key: number]: boolean } = {}

    if (selectedExercise.exercise_type === "fill_blank") {
      selectedExercise.content.sentences.forEach((sentence: any, index: number) => {
        results[index] = exerciseAnswers[index]?.toLowerCase().trim() === sentence.answer.toLowerCase()
      })
    } else if (selectedExercise.exercise_type === "multiple_choice") {
      selectedExercise.content.questions.forEach((question: any, index: number) => {
        results[index] = Number.parseInt(exerciseAnswers[index]) === question.correct
      })
    }

    setExerciseResults(results)
    setShowResults(true)
  }

  const resetExercise = () => {
    setExerciseAnswers({})
    setExerciseResults({})
    setShowResults(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Grammar Lessons</h1>
            <p className="text-gray-600">Master English grammar with interactive lessons and exercises</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Topics Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Grammar Topics</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2">
                    {grammarTopics.map((topic) => (
                      <div
                        key={topic.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b last:border-b-0 ${
                          selectedTopic?.id === topic.id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm">{topic.title}</h3>
                            <p className="text-xs text-gray-600 mt-1">{topic.category}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={`text-xs ${getDifficultyColor(topic.difficulty_level)}`}>
                              {topic.difficulty_level}
                            </Badge>
                            {topic.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedTopic && (
                <Tabs defaultValue="lesson" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="lesson">Lesson</TabsTrigger>
                    <TabsTrigger value="exercises">Exercises</TabsTrigger>
                  </TabsList>

                  <TabsContent value="lesson" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-2xl">{selectedTopic.title}</CardTitle>
                            <p className="text-gray-600 mt-2">{selectedTopic.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(selectedTopic.difficulty_level)}>
                              {selectedTopic.difficulty_level}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => playAudio(selectedTopic.content)}>
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="prose max-w-none">
                          <p className="text-gray-700 leading-relaxed">{selectedTopic.content}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>
                          <div className="space-y-3">
                            {selectedTopic.examples.map((example, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => playAudio(example)}
                                  className="shrink-0"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                                <p className="text-gray-800 italic">"{example}"</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>Estimated time: 10 minutes</span>
                          </div>
                          <Button>
                            Mark as Complete
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="exercises" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {exercises.map((exercise) => (
                        <Card
                          key={exercise.id}
                          className={`cursor-pointer hover:shadow-lg transition-shadow ${
                            selectedExercise?.id === exercise.id ? "ring-2 ring-blue-500" : ""
                          }`}
                          onClick={() => {
                            setSelectedExercise(exercise)
                            resetExercise()
                          }}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{exercise.title}</CardTitle>
                              <Badge className={getDifficultyColor(exercise.difficulty_level)}>
                                {exercise.difficulty_level}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{exercise.instruction}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                {exercise.exercise_type === "fill_blank" ? "Fill in the blanks" : "Multiple choice"}
                              </span>
                              <Badge variant="secondary">{exercise.points} points</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {selectedExercise && (
                      <Card>
                        <CardHeader>
                          <CardTitle>{selectedExercise.title}</CardTitle>
                          <p className="text-gray-600">{selectedExercise.instruction}</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {selectedExercise.exercise_type === "fill_blank" && (
                            <div className="space-y-4">
                              {selectedExercise.content.sentences.map((sentence: any, index: number) => (
                                <div key={index} className="space-y-2">
                                  <p className="text-gray-800">{sentence.text}</p>
                                  <Input
                                    placeholder="Your answer..."
                                    value={exerciseAnswers[index] || ""}
                                    onChange={(e) => handleExerciseAnswer(index, e.target.value)}
                                    className={
                                      showResults
                                        ? exerciseResults[index]
                                          ? "border-green-500 bg-green-50"
                                          : "border-red-500 bg-red-50"
                                        : ""
                                    }
                                    disabled={showResults}
                                  />
                                  {showResults && (
                                    <p
                                      className={`text-sm ${
                                        exerciseResults[index] ? "text-green-600" : "text-red-600"
                                      }`}
                                    >
                                      {exerciseResults[index] ? "Correct!" : `Correct answer: ${sentence.answer}`}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {selectedExercise.exercise_type === "multiple_choice" && (
                            <div className="space-y-6">
                              {selectedExercise.content.questions.map((question: any, index: number) => (
                                <div key={index} className="space-y-3">
                                  <p className="text-gray-800 font-medium">{question.text}</p>
                                  <RadioGroup
                                    value={exerciseAnswers[index] || ""}
                                    onValueChange={(value) => handleExerciseAnswer(index, value)}
                                    disabled={showResults}
                                  >
                                    {question.options.map((option: string, optionIndex: number) => (
                                      <div key={optionIndex} className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value={optionIndex.toString()}
                                          id={`q${index}_${optionIndex}`}
                                        />
                                        <Label
                                          htmlFor={`q${index}_${optionIndex}`}
                                          className={
                                            showResults
                                              ? optionIndex === question.correct
                                                ? "text-green-600 font-medium"
                                                : Number.parseInt(exerciseAnswers[index]) === optionIndex
                                                  ? "text-red-600"
                                                  : ""
                                              : ""
                                          }
                                        >
                                          {option}
                                        </Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                  {showResults && (
                                    <p
                                      className={`text-sm ${
                                        exerciseResults[index] ? "text-green-600" : "text-red-600"
                                      }`}
                                    >
                                      {exerciseResults[index] ? "Correct!" : "Incorrect"}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-4 pt-6 border-t">
                            {!showResults ? (
                              <Button onClick={checkExercise} className="flex-1">
                                Check Answers
                              </Button>
                            ) : (
                              <>
                                <Button onClick={resetExercise} variant="outline" className="flex-1">
                                  Try Again
                                </Button>
                                <Button className="flex-1">Next Exercise</Button>
                              </>
                            )}
                          </div>

                          {showResults && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-900 mb-2">Results</h4>
                              <p className="text-blue-800">
                                You got {Object.values(exerciseResults).filter(Boolean).length} out of{" "}
                                {Object.keys(exerciseResults).length} correct!
                              </p>
                              <Progress
                                value={
                                  (Object.values(exerciseResults).filter(Boolean).length /
                                    Object.keys(exerciseResults).length) *
                                  100
                                }
                                className="mt-2"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
