"use client"

import { useState, useEffect } from "react"
import { Puzzle, Clock, Trophy, RotateCcw, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

interface WordSearchPuzzle {
  id: number
  title: string
  grid: string[][]
  words: string[]
  foundWords: string[]
  difficulty: string
}

interface CrosswordClue {
  number: number
  clue: string
  answer: string
  direction: "across" | "down"
  startRow: number
  startCol: number
}

interface CrosswordPuzzle {
  id: number
  title: string
  grid: (string | null)[][]
  clues: CrosswordClue[]
  userAnswers: { [key: string]: string }
  difficulty: string
}

const createWordSearchPuzzle = (): WordSearchPuzzle => {
  const words = ["ALGORITHM", "COMPUTER", "PROGRAM", "DATA", "CODE", "LOGIC", "ARRAY", "FUNCTION"]
  const size = 12
  const grid: string[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(""))

  // Place words randomly
  const placedWords: string[] = []
  words.forEach((word) => {
    let placed = false
    let attempts = 0
    while (!placed && attempts < 50) {
      const direction = Math.random() > 0.5 ? "horizontal" : "vertical"
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)

      if (canPlaceWord(grid, word, row, col, direction, size)) {
        placeWord(grid, word, row, col, direction)
        placedWords.push(word)
        placed = true
      }
      attempts++
    }
  })

  // Fill empty cells with random letters
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      }
    }
  }

  return {
    id: 1,
    title: "Computer Science Terms",
    grid,
    words: placedWords,
    foundWords: [],
    difficulty: "intermediate",
  }
}

const canPlaceWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: string,
  size: number,
): boolean => {
  if (direction === "horizontal") {
    if (col + word.length > size) return false
    for (let i = 0; i < word.length; i++) {
      if (grid[row][col + i] !== "" && grid[row][col + i] !== word[i]) return false
    }
  } else {
    if (row + word.length > size) return false
    for (let i = 0; i < word.length; i++) {
      if (grid[row + i][col] !== "" && grid[row + i][col] !== word[i]) return false
    }
  }
  return true
}

const placeWord = (grid: string[][], word: string, row: number, col: number, direction: string): void => {
  if (direction === "horizontal") {
    for (let i = 0; i < word.length; i++) {
      grid[row][col + i] = word[i]
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      grid[row + i][col] = word[i]
    }
  }
}

const createCrosswordPuzzle = (): CrosswordPuzzle => {
  const clues: CrosswordClue[] = [
    {
      number: 1,
      clue: "A step-by-step procedure for solving a problem",
      answer: "ALGORITHM",
      direction: "across",
      startRow: 2,
      startCol: 1,
    },
    {
      number: 2,
      clue: "Electronic device for processing data",
      answer: "COMPUTER",
      direction: "down",
      startRow: 1,
      startCol: 3,
    },
    {
      number: 3,
      clue: "Set of instructions for a computer",
      answer: "PROGRAM",
      direction: "across",
      startRow: 5,
      startCol: 2,
    },
    {
      number: 4,
      clue: "Information processed by a computer",
      answer: "DATA",
      direction: "down",
      startRow: 2,
      startCol: 7,
    },
  ]

  const grid: (string | null)[][] = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null))

  // Place answers in grid
  clues.forEach((clue) => {
    const { answer, direction, startRow, startCol } = clue
    for (let i = 0; i < answer.length; i++) {
      if (direction === "across") {
        grid[startRow][startCol + i] = answer[i]
      } else {
        grid[startRow + i][startCol] = answer[i]
      }
    }
  })

  return {
    id: 1,
    title: "Tech Terms Crossword",
    grid,
    clues,
    userAnswers: {},
    difficulty: "intermediate",
  }
}

export default function PuzzlesPage() {
  const [wordSearchPuzzle, setWordSearchPuzzle] = useState<WordSearchPuzzle | null>(null)
  const [crosswordPuzzle, setCrosswordPuzzle] = useState<CrosswordPuzzle | null>(null)
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([])
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [user] = useState(null)

  useEffect(() => {
    setWordSearchPuzzle(createWordSearchPuzzle())
    setCrosswordPuzzle(createCrosswordPuzzle())
    setStartTime(new Date())
  }, [])

  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [startTime])

  const handleWordSearchCellClick = (row: number, col: number) => {
    const cellIndex = selectedCells.findIndex((cell) => cell.row === row && cell.col === col)
    if (cellIndex > -1) {
      setSelectedCells(selectedCells.filter((_, index) => index !== cellIndex))
    } else {
      setSelectedCells([...selectedCells, { row, col }])
    }
  }

  const checkWordSearchSelection = () => {
    if (!wordSearchPuzzle || selectedCells.length === 0) return

    // Sort cells to form a line
    const sortedCells = [...selectedCells].sort((a, b) => {
      if (a.row === b.row) return a.col - b.col
      return a.row - b.row
    })

    // Check if selection forms a valid word
    const selectedWord = sortedCells.map((cell) => wordSearchPuzzle.grid[cell.row][cell.col]).join("")

    if (wordSearchPuzzle.words.includes(selectedWord) && !wordSearchPuzzle.foundWords.includes(selectedWord)) {
      setWordSearchPuzzle({
        ...wordSearchPuzzle,
        foundWords: [...wordSearchPuzzle.foundWords, selectedWord],
      })
      setSelectedCells([])
    } else {
      // Check reverse
      const reversedWord = selectedWord.split("").reverse().join("")
      if (wordSearchPuzzle.words.includes(reversedWord) && !wordSearchPuzzle.foundWords.includes(reversedWord)) {
        setWordSearchPuzzle({
          ...wordSearchPuzzle,
          foundWords: [...wordSearchPuzzle.foundWords, reversedWord],
        })
        setSelectedCells([])
      }
    }
  }

  const handleCrosswordInput = (clueNumber: number, value: string) => {
    if (!crosswordPuzzle) return

    setCrosswordPuzzle({
      ...crosswordPuzzle,
      userAnswers: {
        ...crosswordPuzzle.userAnswers,
        [clueNumber]: value.toUpperCase(),
      },
    })
  }

  const resetPuzzle = (type: "wordsearch" | "crossword") => {
    if (type === "wordsearch") {
      setWordSearchPuzzle(createWordSearchPuzzle())
      setSelectedCells([])
    } else {
      setCrosswordPuzzle(createCrosswordPuzzle())
    }
    setStartTime(new Date())
    setElapsedTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Word Puzzles</h1>
            <p className="text-gray-600">Challenge yourself with fun word games and puzzles</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{formatTime(elapsedTime)}</div>
                <div className="text-sm text-gray-600">Time Elapsed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {wordSearchPuzzle ? wordSearchPuzzle.foundWords.length : 0}
                </div>
                <div className="text-sm text-gray-600">Words Found</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Puzzle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-600">Puzzles Available</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="wordsearch" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wordsearch">Word Search</TabsTrigger>
              <TabsTrigger value="crossword">Crossword</TabsTrigger>
            </TabsList>

            <TabsContent value="wordsearch" className="space-y-6">
              {wordSearchPuzzle && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Puzzle Grid */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{wordSearchPuzzle.title}</CardTitle>
                            <Badge className={getDifficultyColor(wordSearchPuzzle.difficulty)}>
                              {wordSearchPuzzle.difficulty}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedCells([])}>
                              Clear Selection
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => resetPuzzle("wordsearch")}>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              New Puzzle
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-12 gap-1 max-w-lg mx-auto">
                          {wordSearchPuzzle.grid.map((row, rowIndex) =>
                            row.map((cell, colIndex) => {
                              const isSelected = selectedCells.some(
                                (selectedCell) => selectedCell.row === rowIndex && selectedCell.col === colIndex,
                              )
                              return (
                                <button
                                  key={`${rowIndex}-${colIndex}`}
                                  className={`w-8 h-8 text-sm font-mono border border-gray-300 hover:bg-gray-100 transition-colors ${
                                    isSelected ? "bg-blue-200 border-blue-400" : "bg-white"
                                  }`}
                                  onClick={() => handleWordSearchCellClick(rowIndex, colIndex)}
                                >
                                  {cell}
                                </button>
                              )
                            }),
                          )}
                        </div>
                        <div className="flex justify-center mt-4">
                          <Button onClick={checkWordSearchSelection} disabled={selectedCells.length === 0}>
                            Check Selection
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Word List */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>Find These Words</CardTitle>
                        <p className="text-sm text-gray-600">
                          {wordSearchPuzzle.foundWords.length} of {wordSearchPuzzle.words.length} found
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {wordSearchPuzzle.words.map((word) => (
                            <div
                              key={word}
                              className={`flex items-center gap-2 p-2 rounded ${
                                wordSearchPuzzle.foundWords.includes(word)
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-50"
                              }`}
                            >
                              {wordSearchPuzzle.foundWords.includes(word) && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                              <span className={wordSearchPuzzle.foundWords.includes(word) ? "line-through" : ""}>
                                {word}
                              </span>
                            </div>
                          ))}
                        </div>

                        {wordSearchPuzzle.foundWords.length === wordSearchPuzzle.words.length && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Congratulations!</h4>
                            <p className="text-green-700">You found all words in {formatTime(elapsedTime)}!</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="crossword" className="space-y-6">
              {crosswordPuzzle && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Crossword Grid */}
                  <div>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{crosswordPuzzle.title}</CardTitle>
                            <Badge className={getDifficultyColor(crosswordPuzzle.difficulty)}>
                              {crosswordPuzzle.difficulty}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => resetPuzzle("crossword")}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-10 gap-1 max-w-lg mx-auto">
                          {crosswordPuzzle.grid.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-8 h-8 border ${
                                  cell !== null ? "bg-white border-gray-400" : "bg-gray-800 border-gray-800"
                                }`}
                              >
                                {cell !== null && (
                                  <input
                                    type="text"
                                    maxLength={1}
                                    className="w-full h-full text-center text-sm font-mono border-none outline-none"
                                    value={cell}
                                    readOnly
                                  />
                                )}
                              </div>
                            )),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Clues */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Clues</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Across</h4>
                            <div className="space-y-3">
                              {crosswordPuzzle.clues
                                .filter((clue) => clue.direction === "across")
                                .map((clue) => (
                                  <div key={`across-${clue.number}`} className="space-y-2">
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">{clue.number}.</span> {clue.clue}
                                    </p>
                                    <Input
                                      placeholder="Your answer..."
                                      value={crosswordPuzzle.userAnswers[clue.number] || ""}
                                      onChange={(e) => handleCrosswordInput(clue.number, e.target.value)}
                                      className="text-sm"
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Down</h4>
                            <div className="space-y-3">
                              {crosswordPuzzle.clues
                                .filter((clue) => clue.direction === "down")
                                .map((clue) => (
                                  <div key={`down-${clue.number}`} className="space-y-2">
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">{clue.number}.</span> {clue.clue}
                                    </p>
                                    <Input
                                      placeholder="Your answer..."
                                      value={crosswordPuzzle.userAnswers[clue.number] || ""}
                                      onChange={(e) => handleCrosswordInput(clue.number, e.target.value)}
                                      className="text-sm"
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
