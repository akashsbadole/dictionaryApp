"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, BookOpen, Volume2, Filter, TrendingUp, Clock, Loader2, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { wordsetDictionary, transformWordSetEntry, type WordSetEntry } from "@/lib/wordset-data"

export default function HomePage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("search") || "")
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [user, setUser] = useState(null)
  const [searchResults, setSearchResults] = useState<WordSetEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [dictionaryLoaded, setDictionaryLoaded] = useState(false)
  const [stats, setStats] = useState({ totalWords: 0, totalDefinitions: 0, isLoaded: false })
  const [featuredWords, setFeaturedWords] = useState<WordSetEntry[]>([])

  // Load dictionary on component mount
  useEffect(() => {
    const loadDictionary = async () => {
      setLoading(true)
      try {
        console.log("Initializing dictionary...")
        await wordsetDictionary.loadDictionary()

        const dictionaryStats = wordsetDictionary.getStats()
        setStats(dictionaryStats)
        setDictionaryLoaded(true)

        // Load featured words
        try {
          const randomWords = await wordsetDictionary.getRandomWords(6)
          setFeaturedWords(randomWords || [])
        } catch (error) {
          console.warn("Error loading featured words:", error)
          setFeaturedWords([])
        }

        // If there's a search term from URL, perform search
        if (searchTerm) {
          await performSearch(searchTerm)
        }
      } catch (error) {
        console.error("Error loading dictionary:", error)
        // Set some basic stats even if loading fails
        setStats({ totalWords: 0, totalDefinitions: 0, isLoaded: false })
        setDictionaryLoaded(false)
      } finally {
        setLoading(false)
      }
    }

    loadDictionary()
  }, []) // Remove searchTerm dependency to avoid infinite loops

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setSelectedEntry(null)
      return
    }

    setLoading(true)
    try {
      const results = await wordsetDictionary.searchWords(query, 50)
      setSearchResults(results || [])

      if (results && results.length > 0) {
        const transformedEntry = transformWordSetEntry(results[0])
        setSelectedEntry(transformedEntry)
      } else {
        setSelectedEntry(null)
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
      setSelectedEntry(null)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort search results
  const filteredEntries = useMemo(() => {
    let filtered = [...searchResults]

    // Apply filters
    if (filterBy !== "all") {
      filtered = filtered.filter((entry) => {
        return entry.meanings.some((meaning) => {
          if (filterBy === "noun") return meaning.speech_part === "noun"
          if (filterBy === "verb") return meaning.speech_part === "verb"
          if (filterBy === "adjective") return meaning.speech_part === "adjective"
          if (filterBy === "adverb") return meaning.speech_part === "adverb"
          return true
        })
      })
    }

    // Apply sorting
    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.word.localeCompare(b.word))
    } else if (sortBy === "length") {
      filtered.sort((a, b) => a.word.length - b.word.length)
    }
    // Default is relevance (already sorted by search)

    return filtered
  }, [searchResults, filterBy, sortBy])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await performSearch(searchTerm)
  }

  const handleEntrySelect = (entry: WordSetEntry) => {
    const transformedEntry = transformWordSetEntry(entry)
    setSelectedEntry(transformedEntry)
  }

  const playPronunciation = (word: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    } else {
      console.log(`Playing pronunciation for: ${word}`)
    }
  }

  const refreshDictionary = async () => {
    setLoading(true)
    try {
      // Force reload
      await wordsetDictionary.loadDictionary()
      const dictionaryStats = wordsetDictionary.getStats()
      setStats(dictionaryStats)

      // Refresh featured words
      const randomWords = await wordsetDictionary.getRandomWords(6)
      setFeaturedWords(randomWords)
    } catch (error) {
      console.error("Error refreshing dictionary:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">WordSet Dictionary</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore comprehensive word definitions powered by the open-source WordSet dictionary. Search through
            thousands of words with detailed meanings, examples, and relationships.
          </p>

          {/* Dictionary Status */}
          {!dictionaryLoaded && (
            <Alert className="max-w-2xl mx-auto mb-6">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Loading WordSet dictionary data... This may take a moment.</AlertDescription>
            </Alert>
          )}

          {/* Main Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for any word..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-indigo-500"
                disabled={loading}
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                disabled={loading || !dictionaryLoaded}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalWords.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalDefinitions.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Definitions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{searchResults.length}</div>
              <div className="text-sm text-gray-600">Search Results</div>
            </div>
            <div className="text-center">
              <Button variant="outline" size="sm" onClick={refreshDictionary} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
              <div className="text-sm text-gray-600 mt-1">Refresh</div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && dictionaryLoaded && (
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Words</SelectItem>
                  <SelectItem value="noun">Nouns</SelectItem>
                  <SelectItem value="verb">Verbs</SelectItem>
                  <SelectItem value="adjective">Adjectives</SelectItem>
                  <SelectItem value="adverb">Adverbs</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="length">Word Length</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Results List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Results ({filteredEntries.length})
                      {loading && <Loader2 className="h-4 w-4 animate-spin inline ml-2" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto">
                      {filteredEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedEntry?.headword === entry.word ? "bg-indigo-50 border-indigo-200" : ""
                          }`}
                          onClick={() => handleEntrySelect(entry)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{entry.word}</h3>
                              <p className="text-sm text-gray-500">
                                {entry.meanings.length} meaning{entry.meanings.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {entry.meanings.slice(0, 2).map((meaning, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {meaning.speech_part}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredEntries.length === 0 && !loading && (
                        <div className="p-8 text-center text-gray-500">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No words found matching your search.</p>
                          <p className="text-sm mt-2">Try different keywords or check spelling.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Word Details */}
              <div className="lg:col-span-2">
                {selectedEntry ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-3xl font-bold text-gray-900">{selectedEntry.headword}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" onClick={() => playPronunciation(selectedEntry.headword)}>
                              <Volume2 className="h-4 w-4 mr-2" />
                              Pronounce
                            </Button>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {selectedEntry.definitions.length} definition
                          {selectedEntry.definitions.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {selectedEntry.definitions.map((definition: any, index: number) => (
                          <div key={index} className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Badge variant="outline" className="mt-1">
                                {definition.part_of_speech.abbreviation}
                              </Badge>
                              <div className="flex-1">
                                <p className="text-gray-900 font-medium mb-3">{definition.definition_text}</p>

                                {definition.examples && definition.examples.length > 0 && (
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700">Examples:</h4>
                                    {definition.examples.map((example: any, exIndex: number) => (
                                      <p key={exIndex} className="text-gray-600 italic pl-4 border-l-2 border-gray-200">
                                        "{example.example_text}"
                                      </p>
                                    ))}
                                  </div>
                                )}

                                {definition.synonyms && definition.synonyms.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Synonyms:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {definition.synonyms.map((synonym: any, synIndex: number) => (
                                        <Badge key={synIndex} variant="secondary">
                                          {synonym.synonym_word}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {definition.antonyms && definition.antonyms.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Antonyms:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {definition.antonyms.map((antonym: any, antIndex: number) => (
                                        <Badge key={antIndex} variant="destructive">
                                          {antonym.antonym_word}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {definition.domain && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Domain:</h4>
                                    <Badge variant="outline">{definition.domain}</Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                            {index < selectedEntry.definitions.length - 1 && <hr className="border-gray-200" />}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-xl font-semibold mb-2">Select a word to view details</h3>
                      <p>Choose a word from the search results to see its definition and more.</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Featured Sections */}
        {!searchTerm && dictionaryLoaded && (
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Featured Words */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Featured Words</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredWords.slice(0, 3).map((entry) => (
                  <Card
                    key={entry.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleEntrySelect(entry)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{entry.word}</CardTitle>
                        <Badge variant="outline">{entry.meanings[0]?.speech_part}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 line-clamp-3">{entry.meanings[0]?.def}</p>
                      {entry.meanings[0]?.example && (
                        <p className="text-sm text-gray-500 italic mt-2 line-clamp-2">"{entry.meanings[0].example}"</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Random Words */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Discover Words</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredWords.slice(3, 5).map((entry) => (
                  <Card
                    key={entry.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleEntrySelect(entry)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{entry.word}</CardTitle>
                        <Badge variant="outline">{entry.meanings[0]?.speech_part}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 line-clamp-2">{entry.meanings[0]?.def}</p>
                      {entry.meanings[0]?.synonyms && entry.meanings[0].synonyms.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-600">Synonyms: </span>
                          <span className="text-sm text-gray-800">
                            {entry.meanings[0].synonyms.slice(0, 3).join(", ")}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
