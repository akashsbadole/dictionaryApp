"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, AlertCircle, CheckCircle, Download, X, Database, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { wordsetDictionary } from "@/lib/wordset-data"

const adminUser = { email: "admin@opendict.com", role: "admin" }

interface ImportResult {
  success: number
  failed: number
  errors: string[]
  total: number
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [wordsetImporting, setWordsetImporting] = useState(false)
  const [wordList, setWordList] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setImportResult(null)
    } else {
      alert("Please select a valid CSV file")
    }
  }

  const handleCSVImport = async () => {
    if (!file) return

    setImporting(true)
    setProgress(0)

    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

      // Validate CSV format
      const requiredHeaders = ["headword", "definition", "part_of_speech"]
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
      }

      const results: ImportResult = {
        success: 0,
        failed: 0,
        errors: [],
        total: lines.length - 1,
      }

      // Process each row
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
        const rowData: any = {}

        headers.forEach((header, index) => {
          rowData[header] = values[index] || ""
        })

        try {
          // Validate required fields
          if (!rowData.headword || !rowData.definition) {
            throw new Error("Missing headword or definition")
          }

          // Here you would save to database
          console.log("Importing word:", rowData)

          results.success++
        } catch (error) {
          results.failed++
          results.errors.push(`Row ${i}: ${error.message}`)
        }

        setProgress((i / (lines.length - 1)) * 100)

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      setImportResult(results)
    } catch (error) {
      setImportResult({
        success: 0,
        failed: 1,
        errors: [error.message],
        total: 1,
      })
    } finally {
      setImporting(false)
      setProgress(100)
    }
  }

  const handleWordsetImport = async () => {
    setWordsetImporting(true)
    setProgress(0)

    try {
      // Force reload the WordSet dictionary
      await wordsetDictionary.loadDictionary()
      const stats = wordsetDictionary.getStats()

      setImportResult({
        success: stats.totalWords,
        failed: 0,
        errors: [],
        total: stats.totalWords,
      })

      setProgress(100)
    } catch (error) {
      setImportResult({
        success: 0,
        failed: 1,
        errors: [`WordSet import failed: ${error.message}`],
        total: 1,
      })
    } finally {
      setWordsetImporting(false)
    }
  }

  const handleBulkWordImport = async () => {
    if (!wordList.trim()) return

    setImporting(true)
    const words = wordList.split("\n").filter((word) => word.trim())

    const results: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      total: words.length,
    }

    for (let i = 0; i < words.length; i++) {
      const word = words[i].trim()

      try {
        // Search for the word in WordSet dictionary
        const searchResults = await wordsetDictionary.searchWords(word, 1)

        if (searchResults.length > 0) {
          console.log("Found word in WordSet:", searchResults[0])
          results.success++
        } else {
          throw new Error("Word not found in WordSet dictionary")
        }
      } catch (error) {
        results.failed++
        results.errors.push(`${word}: ${error.message}`)
      }

      setProgress(((i + 1) / words.length) * 100)

      // Small delay to prevent overwhelming
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setImportResult(results)
    setImporting(false)
  }

  const downloadSampleCSV = () => {
    const sampleData = [
      ["headword", "definition", "part_of_speech", "pronunciation", "etymology", "frequency_category"],
      ["example", "A representative form or pattern", "noun", "/ɪɡˈzæmpəl/", "From Latin exemplum", "common"],
      [
        "beautiful",
        "Pleasing the senses or mind aesthetically",
        "adjective",
        "/ˈbjuːtɪfʊl/",
        "From Old French bel",
        "common",
      ],
      ["quickly", "At a fast speed; rapidly", "adverb", "/ˈkwɪkli/", "From Old English cwic", "common"],
    ]

    const csvContent = sampleData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample_dictionary_import.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={adminUser} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Import Dictionary Data</h1>
            <p className="text-gray-600">
              Import words from various sources including WordSet dictionary and CSV files
            </p>
          </div>

          <Tabs defaultValue="wordset" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wordset">WordSet Dictionary</TabsTrigger>
              <TabsTrigger value="csv">CSV Import</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Word Search</TabsTrigger>
            </TabsList>

            <TabsContent value="wordset" className="space-y-6">
              {/* WordSet Import */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    WordSet Dictionary Import
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Alert>
                      <Globe className="h-4 w-4" />
                      <AlertDescription>
                        This will load the complete WordSet dictionary from GitHub. The dictionary contains thousands of
                        words with definitions, examples, synonyms, and antonyms.
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleWordsetImport}
                      disabled={wordsetImporting}
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <Database className="h-4 w-4" />
                      {wordsetImporting ? "Loading WordSet Dictionary..." : "Load WordSet Dictionary"}
                    </Button>
                  </div>

                  {/* Progress */}
                  {wordsetImporting && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Loading dictionary data...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Source:</strong> WordSet Dictionary (https://github.com/wordset/wordset-dictionary)
                      <br />
                      <strong>License:</strong> Open source dictionary data
                      <br />
                      <strong>Content:</strong> Comprehensive English dictionary with detailed definitions
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="csv" className="space-y-6">
              {/* CSV Import */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    CSV File Import
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Upload */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="csv-file">Select CSV File</Label>
                      <div className="mt-2">
                        <Input
                          id="csv-file"
                          type="file"
                          accept=".csv"
                          onChange={handleFileSelect}
                          ref={fileInputRef}
                          disabled={importing}
                        />
                      </div>
                    </div>

                    {file && (
                      <Alert>
                        <FileText className="h-4 w-4" />
                        <AlertDescription>
                          Selected file: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={handleCSVImport}
                        disabled={!file || importing}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {importing ? "Importing..." : "Import CSV"}
                      </Button>

                      <Button variant="outline" onClick={downloadSampleCSV} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Sample
                      </Button>
                    </div>
                  </div>

                  {/* Progress */}
                  {importing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Importing...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}

                  {/* CSV Format Info */}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Required CSV columns:</strong> headword, definition, part_of_speech
                      <br />
                      <strong>Optional columns:</strong> pronunciation, etymology, frequency_category, domain,
                      usage_notes
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-6">
              {/* Bulk Word Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Bulk Word Search in WordSet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="word-list">Word List (one word per line)</Label>
                      <textarea
                        id="word-list"
                        className="w-full h-32 p-3 border rounded-md resize-none"
                        placeholder="algorithm&#10;serendipity&#10;ubiquitous&#10;ephemeral&#10;paradigm"
                        value={wordList}
                        onChange={(e) => setWordList(e.target.value)}
                        disabled={importing}
                      />
                    </div>

                    <Button
                      onClick={handleBulkWordImport}
                      disabled={!wordList.trim() || importing}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {importing ? "Searching..." : "Search Words in WordSet"}
                    </Button>
                  </div>

                  {/* Progress */}
                  {importing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Searching words in WordSet dictionary...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This will search for each word in the loaded WordSet dictionary and report which words are found.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Import Results */}
          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {importResult.failed === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{importResult.success.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{importResult.failed.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{importResult.total.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-600">Errors:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {importResult.errors.slice(0, 10).map((error, index) => (
                        <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </div>
                      ))}
                      {importResult.errors.length > 10 && (
                        <div className="text-sm text-gray-500 p-2">
                          ... and {importResult.errors.length - 10} more errors
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <Badge variant={importResult.failed === 0 ? "default" : "secondary"}>
                    {importResult.failed === 0 ? "Import Completed Successfully" : "Import Completed with Errors"}
                  </Badge>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImportResult(null)
                      setFile(null)
                      setWordList("")
                      setProgress(0)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Results
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
