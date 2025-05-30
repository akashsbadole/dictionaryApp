"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Grid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { wordsetDictionary, type WordSetEntry } from "@/lib/wordset-data"

export default function BrowsePage() {
  const [selectedLetter, setSelectedLetter] = useState("a")
  const [words, setWords] = useState<WordSetEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterTerm, setFilterTerm] = useState("")

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

  useEffect(() => {
    loadWordsForLetter(selectedLetter)
  }, [selectedLetter])

  const loadWordsForLetter = async (letter: string) => {
    setLoading(true)
    try {
      const letterWords = await wordsetDictionary.getWordsByLetter(letter)
      setWords(letterWords.slice(0, 100)) // Limit to first 100 words for performance
    } catch (error) {
      console.error("Error loading words:", error)
      setWords([])
    } finally {
      setLoading(false)
    }
  }

  const filteredWords = words.filter(
    (word) =>
      word.word.toLowerCase().includes(filterTerm.toLowerCase()) ||
      word.meanings.some((meaning) => meaning.def.toLowerCase().includes(filterTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Dictionary</h1>
            <p className="text-lg text-gray-600">Explore words alphabetically from the WordSet dictionary</p>
          </div>

          {/* Alphabet Navigation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Browse by Letter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-13 gap-2">
                {alphabet.map((letter) => (
                  <Button
                    key={letter}
                    variant={selectedLetter === letter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLetter(letter)}
                    className="uppercase"
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Filter words..."
                  value={filterTerm}
                  onChange={(e) => setFilterTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Badge variant="secondary">{filteredWords.length} words</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Words Display */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading words...</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredWords.map((word) => (
                <Card key={word.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{word.word}</CardTitle>
                      <Badge variant="outline">{word.meanings[0]?.speech_part}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 line-clamp-3 mb-3">{word.meanings[0]?.def}</p>

                    {word.meanings[0]?.example && (
                      <p className="text-sm text-gray-500 italic line-clamp-2">"{word.meanings[0].example}"</p>
                    )}

                    {word.meanings.length > 1 && (
                      <Badge variant="secondary" className="mt-2">
                        +{word.meanings.length - 1} more meaning{word.meanings.length > 2 ? "s" : ""}
                      </Badge>
                    )}

                    {word.meanings[0]?.synonyms && word.meanings[0].synonyms.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs text-gray-500">Synonyms: </span>
                        <span className="text-xs text-gray-700">
                          {word.meanings[0].synonyms.slice(0, 3).join(", ")}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredWords.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No words found</h3>
              <p className="text-gray-500">Try selecting a different letter or adjusting your filter.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
