"use client"

import { useState, useEffect } from "react"
import { Shuffle, RotateCcw, CheckCircle, Brain, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

interface SentenceTemplate {
  id: number
  template: string
  category: string
  difficulty_level: string
  example_sentence: string
  word_types: {
    [key: string]: string[]
  }
}

const sentenceTemplates: SentenceTemplate[] = [
  {
    id: 1,
    template: "The {adjective} {noun} {verb} {adverb}.",
    category: "simple",
    difficulty_level: "beginner",
    example_sentence: "The happy dog runs quickly.",
    word_types: {
      adjective: ["happy", "big", "small", "beautiful", "smart", "funny", "kind", "brave"],
      noun: ["dog", "cat", "bird", "car", "house", "tree", "book", "student"],
      verb: ["runs", "jumps", "flies", "moves", "walks", "dances", "sings", "reads"],
      adverb: ["quickly", "slowly", "carefully", "loudly", "quietly", "gracefully", "eagerly", "patiently"],
    },
  },
  {
    id: 2,
    template: "{noun} {verb} {preposition} the {adjective} {noun}.",
    category: "simple",
    difficulty_level: "intermediate",
    example_sentence: "Students study in the quiet library.",
    word_types: {
      noun: ["students", "teachers", "children", "people", "workers", "artists", "scientists", "musicians"],
      verb: ["study", "work", "play", "read", "write", "think", "create", "explore"],
      preposition: ["in", "on", "under", "beside", "near", "behind", "above", "below"],
      adjective: ["quiet", "busy", "large", "small", "modern", "old", "beautiful", "comfortable"],
    },
  },
  {
    id: 3,
    template: "When {noun} {verb}, they {verb} {adverb}.",
    category: "complex",
    difficulty_level: "intermediate",
    example_sentence: "When children play, they laugh happily.",
    word_types: {
      noun: ["children", "students", "people", "friends", "families", "teams", "groups", "communities"],
      verb: ["play", "learn", "work", "exercise", "travel", "cook", "dance", "sing"],
      adverb: [
        "happily",
        "carefully",
        "enthusiastically",
        "peacefully",
        "creatively",
        "confidently",
        "joyfully",
        "skillfully",
      ],
    },
  },
]

export default function ExercisesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<SentenceTemplate | null>(null)
  const [currentWords, setCurrentWords] = useState<{ [key: string]: string }>({})
  const [userSentence, setUserSentence] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [completedSentences, setCompletedSentences] = useState<string[]>([])
  const [user] = useState(null)

  useEffect(() => {
    if (sentenceTemplates.length > 0) {
      selectRandomTemplate()
    }
  }, [])

  const selectRandomTemplate = () => {
    const randomTemplate = sentenceTemplates[Math.floor(Math.random() * sentenceTemplates.length)]
    setSelectedTemplate(randomTemplate)
    generateRandomWords(randomTemplate)
    setUserSentence("")
    setShowHint(false)
  }

  const generateRandomWords = (template: SentenceTemplate) => {
    const words: { [key: string]: string } = {}
    Object.keys(template.word_types).forEach((type) => {
      const wordList = template.word_types[type]
      words[type] = wordList[Math.floor(Math.random() * wordList.length)]
    })
    setCurrentWords(words)
  }

  const generateSentence = () => {
    if (!selectedTemplate) return ""

    let sentence = selectedTemplate.template
    Object.keys(currentWords).forEach((type) => {
      sentence = sentence.replace(`{${type}}`, currentWords[type])
    })
    return sentence
  }

  const checkSentence = () => {
    const correctSentence = generateSentence()
    if (userSentence.toLowerCase().trim() === correctSentence.toLowerCase()) {
      setCompletedSentences((prev) => [...prev, correctSentence])
      alert("Correct! Well done!")
      selectRandomTemplate()
    } else {
      alert("Not quite right. Try again or use the hint!")
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sentence Building Exercises</h1>
            <p className="text-gray-600">Practice constructing sentences with guided word prompts</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{completedSentences.length}</div>
                <div className="text-sm text-gray-600">Sentences Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {selectedTemplate ? selectedTemplate.difficulty_level : "N/A"}
                </div>
                <div className="text-sm text-gray-600">Current Level</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{showHint ? "1" : "0"}</div>
                <div className="text-sm text-gray-600">Hints Used</div>
              </CardContent>
            </Card>
          </div>

          {/* Template Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Choose Exercise Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sentenceTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer hover:shadow-lg transition-shadow ${
                      selectedTemplate?.id === template.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => {
                      setSelectedTemplate(template)
                      generateRandomWords(template)
                      setUserSentence("")
                      setShowHint(false)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getDifficultyColor(template.difficulty_level)}>
                          {template.difficulty_level}
                        </Badge>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.template}</p>
                      <p className="text-xs text-gray-500 italic">Example: {template.example_sentence}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Exercise */}
          {selectedTemplate && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Build Your Sentence</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => generateRandomWords(selectedTemplate)}>
                      <Shuffle className="h-4 w-4 mr-2" />
                      New Words
                    </Button>
                    <Button variant="outline" size="sm" onClick={selectRandomTemplate}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Template
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Word Bank */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Word Bank</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(currentWords).map((type) => (
                      <div key={type} className="text-center">
                        <Badge variant="outline" className="mb-2">
                          {type}
                        </Badge>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="font-medium text-blue-900">{currentWords[type]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Template */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Template</h3>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-gray-700 font-mono">{selectedTemplate.template}</p>
                  </div>
                </div>

                {/* User Input */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Sentence</h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="Type your sentence here..."
                      value={userSentence}
                      onChange={(e) => setUserSentence(e.target.value)}
                      className="text-lg p-4"
                    />
                    <div className="flex gap-2">
                      <Button onClick={checkSentence} disabled={!userSentence.trim()}>
                        Check Sentence
                      </Button>
                      <Button variant="outline" onClick={() => setShowHint(!showHint)}>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        {showHint ? "Hide" : "Show"} Hint
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hint */}
                {showHint && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">Hint</h4>
                    <p className="text-yellow-700">Correct sentence: {generateSentence()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Completed Sentences */}
          {completedSentences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Completed Sentences ({completedSentences.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {completedSentences.slice(-5).map((sentence, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800">{sentence}</p>
                    </div>
                  ))}
                  {completedSentences.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      ... and {completedSentences.length - 5} more sentences
                    </p>
                  )}
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
