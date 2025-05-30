"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Volume2, Mic, MicOff, CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import {
  sampleLessons,
  GamificationService,
  type Lesson,
  type LessonContent,
  type MultipleChoiceExercise,
  type TranslationExercise,
  type FillBlankExercise,
} from "@/lib/gamification"

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = Number(params.id)

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: any }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [feedback, setFeedback] = useState<{ [key: number]: { correct: boolean; explanation?: string } }>({})
  const [user] = useState({ id: 1, email: "learner@example.com", role: "user" })

  useEffect(() => {
    const foundLesson = sampleLessons.find((l) => l.id === lessonId)
    if (foundLesson) {
      setLesson(foundLesson)
    } else {
      router.push("/learn/interactive")
    }
  }, [lessonId, router])

  const playAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    // Implement speech recognition
    setTimeout(() => {
      setIsRecording(false)
      // Mock recorded text
      setUserAnswers((prev) => ({ ...prev, [currentQuestionIndex]: "Hello, how are you?" }))
    }, 3000)
  }

  const handleAnswer = (questionIndex: number, answer: any) => {
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: answer }))
  }

  const checkAnswers = () => {
    if (!lesson) return

    const content = lesson.content as LessonContent
    let correctCount = 0
    const newFeedback: { [key: number]: { correct: boolean; explanation?: string } } = {}

    if (content.type === "multiple_choice") {
      const mcContent = content as MultipleChoiceExercise
      mcContent.questions.forEach((question, index) => {
        const userAnswer = userAnswers[index]
        const isCorrect = userAnswer === question.correct_answer
        if (isCorrect) correctCount++

        newFeedback[index] = {
          correct: isCorrect,
          explanation: question.explanation,
        }
      })
    } else if (content.type === "translation") {
      const translationContent = content as TranslationExercise
      const userAnswer = userAnswers[0]?.toLowerCase().trim()
      const correctAnswer = translationContent.correct_translation.toLowerCase().trim()
      const isCorrect = userAnswer === correctAnswer
      if (isCorrect) correctCount++

      newFeedback[0] = {
        correct: isCorrect,
        explanation: isCorrect ? "Perfect translation!" : `Correct answer: ${translationContent.correct_translation}`,
      }
    } else if (content.type === "fill_blank") {
      const fillBlankContent = content as FillBlankExercise
      fillBlankContent.blanks.forEach((blank, index) => {
        const userAnswer = userAnswers[index]?.toLowerCase().trim()
        const correctAnswer = blank.correct_answer.toLowerCase().trim()
        const isCorrect = userAnswer === correctAnswer
        if (isCorrect) correctCount++

        newFeedback[index] = {
          correct: isCorrect,
          explanation: isCorrect ? "Correct!" : `Correct answer: ${blank.correct_answer}`,
        }
      })
    }

    const totalQuestions =
      content.type === "multiple_choice"
        ? (content as MultipleChoiceExercise).questions.length
        : content.type === "fill_blank"
          ? (content as FillBlankExercise).blanks.length
          : 1

    const finalScore = Math.round((correctCount / totalQuestions) * 100)
    setScore(finalScore)
    setFeedback(newFeedback)
    setShowResults(true)

    // Award points
    const pointsEarned = Math.round((finalScore / 100) * lesson.points_reward)
    GamificationService.awardPoints(1, pointsEarned, `Completed lesson: ${lesson.title}`)
  }

  const resetLesson = () => {
    setUserAnswers({})
    setShowResults(false)
    setScore(0)
    setFeedback({})
    setCurrentQuestionIndex(0)
  }

  const completeLesson = () => {
    // Mark lesson as completed and redirect
    router.push("/learn/interactive")
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p>Loading lesson...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const content = lesson.content as LessonContent

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <p className="text-gray-600">{lesson.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{lesson.lesson_type.replace("_", " ")}</Badge>
              <Badge variant="secondary">+{lesson.points_reward} pts</Badge>
            </div>
          </div>

          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Lesson Progress</span>
                <span className="text-sm text-gray-600">
                  {showResults ? "Complete" : `Question ${currentQuestionIndex + 1}`}
                </span>
              </div>
              <Progress value={showResults ? 100 : 50} className="h-2" />
            </CardContent>
          </Card>

          {/* Lesson Content */}
          {!showResults ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {content.type === "multiple_choice" && "Multiple Choice"}
                  {content.type === "translation" && "Translation Exercise"}
                  {content.type === "fill_blank" && "Fill in the Blanks"}
                  {content.type === "speaking" && "Speaking Practice"}
                  {content.type === "listening" && "Listening Comprehension"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Multiple Choice */}
                {content.type === "multiple_choice" && (
                  <div className="space-y-6">
                    {(content as MultipleChoiceExercise).questions.map((question, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">Question {index + 1}</h3>
                          <Button variant="ghost" size="sm" onClick={() => playAudio(question.question)}>
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-800">{question.question}</p>
                        <RadioGroup
                          value={userAnswers[index]?.toString() || ""}
                          onValueChange={(value) => handleAnswer(index, Number.parseInt(value))}
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={optionIndex.toString()} id={`q${index}_${optionIndex}`} />
                              <Label htmlFor={`q${index}_${optionIndex}`} className="flex-1 cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                )}

                {/* Translation */}
                {content.type === "translation" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">Translate this sentence:</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playAudio((content as TranslationExercise).source_text)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-lg text-blue-900">{(content as TranslationExercise).source_text}</p>
                    </div>
                    <Textarea
                      placeholder="Enter your translation..."
                      value={userAnswers[0] || ""}
                      onChange={(e) => handleAnswer(0, e.target.value)}
                      rows={3}
                    />
                    {(content as TranslationExercise).hints && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-800 mb-2">Hints:</p>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {(content as TranslationExercise).hints!.map((hint, index) => (
                            <li key={index}>• {hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Fill in the Blanks */}
                {content.type === "fill_blank" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Fill in the blanks:</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-lg">
                        {(content as FillBlankExercise).text.split("___").map((part, index, array) => (
                          <span key={index}>
                            {part}
                            {index < array.length - 1 && (
                              <Input
                                className="inline-block w-32 mx-2"
                                value={userAnswers[index] || ""}
                                onChange={(e) => handleAnswer(index, e.target.value)}
                                placeholder="..."
                              />
                            )}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {(content as FillBlankExercise).blanks.map(
                        (blank, index) =>
                          blank.options && (
                            <div key={index} className="space-y-1">
                              <p className="text-xs text-gray-600">Options for blank {index + 1}:</p>
                              <div className="flex flex-wrap gap-1">
                                {blank.options.map((option, optionIndex) => (
                                  <Badge
                                    key={optionIndex}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-blue-100"
                                    onClick={() => handleAnswer(index, option)}
                                  >
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                )}

                {/* Speaking Practice */}
                {content.type === "speaking" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Speaking Practice</h3>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-900">Practice saying: "Hello, how are you today?"</p>
                    </div>
                    <div className="text-center">
                      <Button
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        onClick={isRecording ? () => setIsRecording(false) : startRecording}
                      >
                        {isRecording ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>
                    </div>
                    {userAnswers[0] && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">You said: "{userAnswers[0]}"</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button onClick={checkAnswers} className="flex-1" disabled={Object.keys(userAnswers).length === 0}>
                    Check Answers
                  </Button>
                  <Button variant="outline" onClick={resetLesson}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Results */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Lesson Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{score}%</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {score >= 80 ? "Excellent!" : score >= 60 ? "Good Job!" : "Keep Practicing!"}
                    </h3>
                    <p className="text-gray-600">
                      You earned {Math.round((score / 100) * lesson.points_reward)} points
                    </p>
                  </div>
                </div>

                {/* Detailed Feedback */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Answer Review:</h4>
                  {Object.entries(feedback).map(([index, result]) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {result.correct ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-medium">
                          Question {Number.parseInt(index) + 1}: {result.correct ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                      {result.explanation && <p className="text-sm text-gray-700">{result.explanation}</p>}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button onClick={resetLesson} variant="outline" className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={completeLesson} className="flex-1">
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
