"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Mic, MicOff, Volume2, RotateCcw, MessageCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import {
  ConversationManager,
  conversationCategories,
  difficultyLevels,
  audioManager,
  type ConversationTopic,
  type DialogueLine,
} from "@/lib/conversation-data"

export default function ConversationPage() {
  const [selectedTopic, setSelectedTopic] = useState<ConversationTopic | null>(null)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [userResponse, setUserResponse] = useState("")
  const [conversationHistory, setConversationHistory] = useState<DialogueLine[]>([])
  const [practiceMode, setPracticeMode] = useState<"listen" | "speak" | "roleplay">("listen")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [filteredTopics, setFilteredTopics] = useState<ConversationTopic[]>([])
  const [user] = useState(null)

  // Load all conversation topics on component mount
  useEffect(() => {
    const allTopics = ConversationManager.getTopicsByDifficulty("beginner")
      .concat(ConversationManager.getTopicsByDifficulty("intermediate"))
      .concat(ConversationManager.getTopicsByDifficulty("advanced"))

    setFilteredTopics(allTopics)

    if (allTopics.length > 0) {
      setSelectedTopic(allTopics[0])
    }
  }, [])

  // Filter topics based on search and filters
  useEffect(() => {
    let topics = ConversationManager.getTopicsByDifficulty("beginner")
      .concat(ConversationManager.getTopicsByDifficulty("intermediate"))
      .concat(ConversationManager.getTopicsByDifficulty("advanced"))

    if (searchTerm) {
      topics = ConversationManager.searchTopics(searchTerm)
    }

    if (selectedCategory !== "all") {
      topics = topics.filter((topic) => topic.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      topics = topics.filter((topic) => topic.difficulty_level === selectedDifficulty)
    }

    setFilteredTopics(topics)
  }, [searchTerm, selectedCategory, selectedDifficulty])

  const playAudio = async (text: string) => {
    try {
      setIsPlaying(true)
      await audioManager.playText(text, { rate: 0.8 })
    } catch (error) {
      console.error("Error playing audio:", error)
    } finally {
      setIsPlaying(false)
    }
  }

  const stopAudio = () => {
    audioManager.stopSpeaking()
    setIsPlaying(false)
  }

  const startRecording = async () => {
    try {
      setIsRecording(true)
      const transcript = await audioManager.startRecording()
      setUserResponse(transcript)
    } catch (error) {
      console.error("Error recording:", error)
      alert("Speech recognition not supported or permission denied")
    } finally {
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    audioManager.stopRecording()
    setIsRecording(false)
  }

  const nextDialogue = () => {
    if (selectedTopic && currentDialogueIndex < selectedTopic.sample_dialogue.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1)
    }
  }

  const previousDialogue = () => {
    if (currentDialogueIndex > 0) {
      setCurrentDialogueIndex(currentDialogueIndex - 1)
    }
  }

  const resetConversation = () => {
    setCurrentDialogueIndex(0)
    setConversationHistory([])
    setUserResponse("")
    stopAudio()
  }

  const addToConversation = () => {
    if (userResponse.trim()) {
      const newLine: DialogueLine = {
        speaker: "you",
        text: userResponse.trim(),
      }
      setConversationHistory([...conversationHistory, newLine])
      setUserResponse("")
    }
  }

  const selectRandomTopic = () => {
    const randomTopic = ConversationManager.getRandomTopic()
    setSelectedTopic(randomTopic)
    resetConversation()
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

  const currentDialogue = selectedTopic?.sample_dialogue[currentDialogueIndex]
  const progress = selectedTopic ? ((currentDialogueIndex + 1) / selectedTopic.sample_dialogue.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Audio Conversations</h1>
            <p className="text-gray-600">Practice speaking English with 100+ interactive dialogues</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Find Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(conversationCategories).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {Object.entries(difficultyLevels).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)} ({value.cefr_level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={selectRandomTopic} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Random Topic
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Topic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTopics.slice(0, 12).map((topic) => (
              <Card
                key={topic.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedTopic?.id === topic.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => {
                  setSelectedTopic(topic)
                  resetConversation()
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <Badge className={getDifficultyColor(topic.difficulty_level)}>{topic.difficulty_level}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">
                        {conversationCategories[topic.category as keyof typeof conversationCategories]}
                      </Badge>
                      <span className="text-gray-500">{topic.estimated_time} min</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Key Vocabulary:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {topic.vocabulary_focus.slice(0, 3).map((word) => (
                          <Badge key={word} variant="secondary" className="text-xs">
                            {word}
                          </Badge>
                        ))}
                        {topic.vocabulary_focus.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{topic.vocabulary_focus.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show more button */}
          {filteredTopics.length > 12 && (
            <div className="text-center mb-8">
              <Button variant="outline">Show {filteredTopics.length - 12} More Conversations</Button>
            </div>
          )}

          {selectedTopic && (
            <div className="space-y-8">
              {/* Topic Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedTopic.title}</CardTitle>
                      <p className="text-gray-600 mt-2">{selectedTopic.scenario}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(selectedTopic.difficulty_level)}>
                        {selectedTopic.difficulty_level}
                      </Badge>
                      <Badge variant="outline">{selectedTopic.estimated_time} min</Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Practice Mode Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Practice Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={practiceMode} onValueChange={(value) => setPracticeMode(value as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="listen">Listen & Learn</TabsTrigger>
                      <TabsTrigger value="speak">Speak & Practice</TabsTrigger>
                      <TabsTrigger value="roleplay">Role Play</TabsTrigger>
                    </TabsList>

                    <TabsContent value="listen" className="mt-6">
                      <div className="space-y-6">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-600">
                              {currentDialogueIndex + 1} of {selectedTopic.sample_dialogue.length}
                            </span>
                          </div>
                          <Progress value={progress} />
                        </div>

                        {/* Current Dialogue */}
                        {currentDialogue && (
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex-1">
                                  <Badge variant="outline" className="mb-2">
                                    {currentDialogue.speaker}
                                  </Badge>
                                  <p className="text-lg text-gray-800">{currentDialogue.text}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="lg"
                                  onClick={() => (isPlaying ? stopAudio() : playAudio(currentDialogue.text))}
                                >
                                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                </Button>
                              </div>

                              <div className="flex justify-between">
                                <Button
                                  variant="outline"
                                  onClick={previousDialogue}
                                  disabled={currentDialogueIndex === 0}
                                >
                                  Previous
                                </Button>
                                <Button
                                  onClick={nextDialogue}
                                  disabled={currentDialogueIndex === selectedTopic.sample_dialogue.length - 1}
                                >
                                  Next
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="speak" className="mt-6">
                      <div className="space-y-6">
                        {/* Current Dialogue for Reference */}
                        {currentDialogue && (
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex items-center gap-4 mb-4">
                                <Badge variant="outline">{currentDialogue.speaker}</Badge>
                                <Button variant="outline" size="sm" onClick={() => playAudio(currentDialogue.text)}>
                                  <Volume2 className="h-4 w-4 mr-2" />
                                  Listen
                                </Button>
                              </div>
                              <p className="text-lg text-gray-800 mb-4">{currentDialogue.text}</p>

                              <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-800 mb-2">Now try to repeat this line:</p>
                                <div className="flex gap-2">
                                  <Button
                                    variant={isRecording ? "destructive" : "default"}
                                    onClick={isRecording ? stopRecording : startRecording}
                                  >
                                    {isRecording ? (
                                      <MicOff className="h-4 w-4 mr-2" />
                                    ) : (
                                      <Mic className="h-4 w-4 mr-2" />
                                    )}
                                    {isRecording ? "Stop Recording" : "Start Recording"}
                                  </Button>
                                  {userResponse && (
                                    <Button variant="outline" onClick={() => playAudio(userResponse)}>
                                      <Volume2 className="h-4 w-4 mr-2" />
                                      Play Back
                                    </Button>
                                  )}
                                </div>
                                {userResponse && (
                                  <div className="mt-3 p-3 bg-white rounded border">
                                    <p className="text-sm text-gray-600 mb-1">You said:</p>
                                    <p className="text-gray-800">"{userResponse}"</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="roleplay" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Conversation History */}
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Conversation
                              </CardTitle>
                              <Button variant="outline" size="sm" onClick={resetConversation}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {selectedTopic.sample_dialogue.slice(0, 2).map((line, index) => (
                                <div key={index} className="flex gap-3">
                                  <Badge variant="outline" className="shrink-0">
                                    {line.speaker}
                                  </Badge>
                                  <p className="text-gray-800">{line.text}</p>
                                </div>
                              ))}
                              {conversationHistory.map((line, index) => (
                                <div key={`history-${index}`} className="flex gap-3">
                                  <Badge variant={line.speaker === "you" ? "default" : "outline"} className="shrink-0">
                                    {line.speaker}
                                  </Badge>
                                  <p className="text-gray-800">{line.text}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Response Input */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Your Response</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Textarea
                              placeholder="Type your response or use voice input..."
                              value={userResponse}
                              onChange={(e) => setUserResponse(e.target.value)}
                              rows={4}
                            />

                            <div className="flex gap-2">
                              <Button
                                variant={isRecording ? "destructive" : "outline"}
                                onClick={isRecording ? stopRecording : startRecording}
                              >
                                {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                                {isRecording ? "Stop" : "Voice Input"}
                              </Button>

                              <Button onClick={addToConversation} disabled={!userResponse.trim()} className="flex-1">
                                Add to Conversation
                              </Button>
                            </div>

                            {userResponse && (
                              <Button variant="outline" onClick={() => playAudio(userResponse)} className="w-full">
                                <Volume2 className="h-4 w-4 mr-2" />
                                Practice Pronunciation
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Vocabulary & Grammar Focus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Vocabulary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedTopic.vocabulary_focus.map((word) => (
                        <Badge
                          key={word}
                          variant="secondary"
                          className="cursor-pointer hover:bg-blue-100"
                          onClick={() => playAudio(word)}
                        >
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Grammar Focus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedTopic.grammar_focus.map((grammar) => (
                        <Badge key={grammar} variant="outline">
                          {grammar}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Related Topics */}
              {selectedTopic && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Conversations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {ConversationManager.getRelatedTopics(selectedTopic.id, 3).map((topic) => (
                        <Card
                          key={topic.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedTopic(topic)
                            resetConversation()
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getDifficultyColor(topic.difficulty_level)} variant="outline">
                                {topic.difficulty_level}
                              </Badge>
                              <span className="text-xs text-gray-500">{topic.estimated_time} min</span>
                            </div>
                            <h4 className="font-medium text-sm mb-1">{topic.title}</h4>
                            <p className="text-xs text-gray-600">{topic.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Statistics */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Conversation Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {ConversationManager.getTopicsByDifficulty("beginner").length}
                  </div>
                  <div className="text-sm text-gray-600">Beginner Topics</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {ConversationManager.getTopicsByDifficulty("intermediate").length}
                  </div>
                  <div className="text-sm text-gray-600">Intermediate Topics</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {ConversationManager.getTopicsByDifficulty("advanced").length}
                  </div>
                  <div className="text-sm text-gray-600">Advanced Topics</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{Object.keys(conversationCategories).length}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
