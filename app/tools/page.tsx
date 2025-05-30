"use client"

import { useState } from "react"
import { CheckCircle, Wand2, RefreshCw, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

interface UsageStats {
  grammarChecks: number
  paraphrases: number
  totalUsed: number
  maxFreeUses: number
  resetDate: string
}

interface GrammarResult {
  originalText: string
  correctedText: string
  corrections: {
    type: string
    original: string
    corrected: string
    explanation: string
    position: number
  }[]
  score: number
}

interface ParaphraseResult {
  originalText: string
  paraphrases: {
    text: string
    style: string
    confidence: number
  }[]
}

export default function ToolsPage() {
  const [grammarText, setGrammarText] = useState("")
  const [paraphraseText, setParaphraseText] = useState("")
  const [paraphraseStyle, setParaphraseStyle] = useState("standard")
  const [grammarResult, setGrammarResult] = useState<GrammarResult | null>(null)
  const [paraphraseResult, setParaphraseResult] = useState<ParaphraseResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [usageStats, setUsageStats] = useState<UsageStats>({
    grammarChecks: 3,
    paraphrases: 2,
    totalUsed: 5,
    maxFreeUses: 10,
    resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  })
  const [user] = useState({ id: 1, email: "user@example.com", role: "user" })

  const canUseFeature = usageStats.totalUsed < usageStats.maxFreeUses

  const checkGrammar = async () => {
    if (!grammarText.trim() || !canUseFeature) return

    setIsProcessing(true)
    try {
      // Simulate API call to Gemini 2.0 Flash
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock grammar correction result
      const mockResult: GrammarResult = {
        originalText: grammarText,
        correctedText: grammarText
          .replace("I are", "I am")
          .replace("goed", "went")
          .replace("there house", "their house"),
        corrections: [
          {
            type: "Subject-Verb Agreement",
            original: "I are",
            corrected: "I am",
            explanation: "Use 'am' with the first person singular pronoun 'I'",
            position: 0,
          },
          {
            type: "Irregular Verb",
            original: "goed",
            corrected: "went",
            explanation: "'Go' is an irregular verb. The past tense is 'went', not 'goed'",
            position: 15,
          },
          {
            type: "Possessive Pronoun",
            original: "there house",
            corrected: "their house",
            explanation: "Use 'their' (possessive) instead of 'there' (location)",
            position: 25,
          },
        ],
        score: 75,
      }

      setGrammarResult(mockResult)
      setUsageStats((prev) => ({
        ...prev,
        grammarChecks: prev.grammarChecks + 1,
        totalUsed: prev.totalUsed + 1,
      }))
    } catch (error) {
      console.error("Grammar check failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const generateParaphrases = async () => {
    if (!paraphraseText.trim() || !canUseFeature) return

    setIsProcessing(true)
    try {
      // Simulate API call to Gemini 2.0 Flash
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock paraphrase results
      const mockResult: ParaphraseResult = {
        originalText: paraphraseText,
        paraphrases: [
          {
            text: "The rapid advancement of artificial intelligence technology is transforming numerous industries worldwide.",
            style: "formal",
            confidence: 95,
          },
          {
            text: "AI tech is quickly changing lots of different business areas around the globe.",
            style: "casual",
            confidence: 90,
          },
          {
            text: "Artificial intelligence's swift progress is revolutionizing various sectors across the planet.",
            style: "academic",
            confidence: 92,
          },
          {
            text: "The speedy growth of AI is making big changes in many types of work everywhere.",
            style: "simple",
            confidence: 88,
          },
        ],
      }

      setParaphraseResult(mockResult)
      setUsageStats((prev) => ({
        ...prev,
        paraphrases: prev.paraphrases + 1,
        totalUsed: prev.totalUsed + 1,
      }))
    } catch (error) {
      console.error("Paraphrase generation failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetResults = () => {
    setGrammarResult(null)
    setParaphraseResult(null)
    setGrammarText("")
    setParaphraseText("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Writing Tools</h1>
            <p className="text-xl text-gray-600">
              Powered by Google Gemini 2.0 Flash - Grammar correction and intelligent paraphrasing
            </p>
          </div>

          {/* Usage Stats */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Usage Statistics
                </CardTitle>
                <Badge variant={canUseFeature ? "default" : "destructive"}>
                  {usageStats.totalUsed} / {usageStats.maxFreeUses} uses
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{usageStats.grammarChecks}</div>
                  <div className="text-sm text-gray-600">Grammar Checks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{usageStats.paraphrases}</div>
                  <div className="text-sm text-gray-600">Paraphrases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {usageStats.maxFreeUses - usageStats.totalUsed}
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Resets on</div>
                  <div className="text-sm text-gray-600">{usageStats.resetDate}</div>
                </div>
              </div>

              {!canUseFeature && (
                <Alert className="mt-4">
                  <Crown className="h-4 w-4" />
                  <AlertDescription>
                    You've reached your free usage limit. Upgrade to Premium for unlimited access to all AI tools.
                    <Button size="sm" className="ml-2">
                      Upgrade Now
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Main Tools */}
          <Tabs defaultValue="grammar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grammar">Grammar Correction</TabsTrigger>
              <TabsTrigger value="paraphrase">Paraphraser</TabsTrigger>
            </TabsList>

            <TabsContent value="grammar" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Grammar Checker
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Enter your text here for grammar checking... (e.g., 'I are going to there house yesterday')"
                      value={grammarText}
                      onChange={(e) => setGrammarText(e.target.value)}
                      rows={8}
                      className="resize-none"
                    />

                    <div className="flex gap-2">
                      <Button
                        onClick={checkGrammar}
                        disabled={!grammarText.trim() || isProcessing || !canUseFeature}
                        className="flex-1"
                      >
                        {isProcessing ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        {isProcessing ? "Checking..." : "Check Grammar"}
                      </Button>
                      <Button variant="outline" onClick={resetResults}>
                        Clear
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500">Powered by Google Gemini 2.0 Flash API</div>
                  </CardContent>
                </Card>

                {/* Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {grammarResult ? (
                      <div className="space-y-4">
                        {/* Score */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Grammar Score:</span>
                          <Badge
                            variant={
                              grammarResult.score >= 80
                                ? "default"
                                : grammarResult.score >= 60
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {grammarResult.score}%
                          </Badge>
                        </div>

                        {/* Corrected Text */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">Corrected Text:</h4>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800">{grammarResult.correctedText}</p>
                          </div>
                        </div>

                        {/* Corrections */}
                        {grammarResult.corrections.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Corrections Made:</h4>
                            <div className="space-y-2">
                              {grammarResult.corrections.map((correction, index) => (
                                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-xs">
                                      {correction.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm">
                                    <span className="line-through text-red-600">{correction.original}</span>
                                    {" → "}
                                    <span className="text-green-600 font-medium">{correction.corrected}</span>
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">{correction.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Enter text and click "Check Grammar" to see corrections</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="paraphrase" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-purple-500" />
                      Paraphraser
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Enter your text here for paraphrasing... (e.g., 'The quick development of AI technology is changing many industries around the world')"
                      value={paraphraseText}
                      onChange={(e) => setParaphraseText(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />

                    <div>
                      <label className="text-sm font-medium mb-2 block">Paraphrasing Style:</label>
                      <Select value={paraphraseStyle} onValueChange={setParaphraseStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={generateParaphrases}
                        disabled={!paraphraseText.trim() || isProcessing || !canUseFeature}
                        className="flex-1"
                      >
                        {isProcessing ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4 mr-2" />
                        )}
                        {isProcessing ? "Generating..." : "Generate Paraphrases"}
                      </Button>
                      <Button variant="outline" onClick={resetResults}>
                        Clear
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500">Powered by Google Gemini 2.0 Flash API</div>
                  </CardContent>
                </Card>

                {/* Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Paraphrase Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paraphraseResult ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Original Text:</h4>
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-gray-800">{paraphraseResult.originalText}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Paraphrased Versions:</h4>
                          <div className="space-y-3">
                            {paraphraseResult.paraphrases.map((paraphrase, index) => (
                              <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {paraphrase.style}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {paraphrase.confidence}% confidence
                                  </Badge>
                                </div>
                                <p className="text-purple-800">{paraphrase.text}</p>
                                <Button size="sm" variant="ghost" className="mt-2 text-xs">
                                  Copy Text
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Wand2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Enter text and click "Generate Paraphrases" to see alternatives</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Grammar Correction Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Subject-verb agreement correction
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Tense consistency checking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Punctuation and capitalization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Word choice suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Detailed explanations for each correction
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-purple-500" />
                  Paraphrasing Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Multiple style options (formal, casual, academic)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Maintains original meaning
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Confidence scoring for each option
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Plagiarism avoidance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Context-aware rewording
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
