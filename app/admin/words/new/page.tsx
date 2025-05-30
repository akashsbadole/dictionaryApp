"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Plus, Trash2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const adminUser = { email: "admin@opendict.com", role: "admin" }

interface Definition {
  id: string
  text: string
  partOfSpeech: string
  domain: string
  register: string
  examples: string[]
  synonyms: string[]
  antonyms: string[]
}

export default function NewWordPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // Form state
  const [headword, setHeadword] = useState("")
  const [pronunciation, setPronunciation] = useState("")
  const [phonetic, setPhonetic] = useState("")
  const [etymology, setEtymology] = useState("")
  const [usageNotes, setUsageNotes] = useState("")
  const [frequencyCategory, setFrequencyCategory] = useState("common")
  const [definitions, setDefinitions] = useState<Definition[]>([
    {
      id: "1",
      text: "",
      partOfSpeech: "",
      domain: "",
      register: "",
      examples: [""],
      synonyms: [""],
      antonyms: [""],
    },
  ])

  const addDefinition = () => {
    const newDefinition: Definition = {
      id: Date.now().toString(),
      text: "",
      partOfSpeech: "",
      domain: "",
      register: "",
      examples: [""],
      synonyms: [""],
      antonyms: [""],
    }
    setDefinitions([...definitions, newDefinition])
  }

  const removeDefinition = (id: string) => {
    if (definitions.length > 1) {
      setDefinitions(definitions.filter((def) => def.id !== id))
    }
  }

  const updateDefinition = (id: string, field: keyof Definition, value: any) => {
    setDefinitions(definitions.map((def) => (def.id === id ? { ...def, [field]: value } : def)))
  }

  const addArrayItem = (defId: string, field: "examples" | "synonyms" | "antonyms") => {
    setDefinitions(definitions.map((def) => (def.id === defId ? { ...def, [field]: [...def[field], ""] } : def)))
  }

  const removeArrayItem = (defId: string, field: "examples" | "synonyms" | "antonyms", index: number) => {
    setDefinitions(
      definitions.map((def) =>
        def.id === defId
          ? {
              ...def,
              [field]: def[field].filter((_, i) => i !== index),
            }
          : def,
      ),
    )
  }

  const updateArrayItem = (
    defId: string,
    field: "examples" | "synonyms" | "antonyms",
    index: number,
    value: string,
  ) => {
    setDefinitions(
      definitions.map((def) =>
        def.id === defId
          ? {
              ...def,
              [field]: def[field].map((item, i) => (i === index ? value : item)),
            }
          : def,
      ),
    )
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      // Validate required fields
      if (!headword.trim()) {
        alert("Headword is required")
        return
      }

      if (definitions.some((def) => !def.text.trim())) {
        alert("All definitions must have text")
        return
      }

      // Prepare data for saving
      const wordData = {
        headword: headword.trim(),
        pronunciation: pronunciation.trim(),
        phonetic: phonetic.trim(),
        etymology: etymology.trim(),
        usage_notes: usageNotes.trim(),
        frequency_category: frequencyCategory,
        definitions: definitions.map((def) => ({
          definition_text: def.text.trim(),
          part_of_speech: def.partOfSpeech,
          domain: def.domain.trim(),
          register: def.register.trim(),
          examples: def.examples.filter((ex) => ex.trim()).map((ex) => ex.trim()),
          synonyms: def.synonyms.filter((syn) => syn.trim()).map((syn) => syn.trim()),
          antonyms: def.antonyms.filter((ant) => ant.trim()).map((ant) => ant.trim()),
        })),
      }

      console.log("Saving word:", wordData)

      // Here you would save to database
      // await createDictionaryEntry(wordData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Word saved successfully!")
      router.push("/admin/words")
    } catch (error) {
      console.error("Error saving word:", error)
      alert("Error saving word. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const playPronunciation = () => {
    console.log("Playing pronunciation for:", headword)
    // In real app, use Web Speech API or audio files
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={adminUser} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Word</h1>
              <p className="text-gray-600">Create a new dictionary entry with definitions and examples</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Word"}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="headword">Headword *</Label>
                    <Input
                      id="headword"
                      value={headword}
                      onChange={(e) => setHeadword(e.target.value)}
                      placeholder="Enter the word"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Frequency Category</Label>
                    <Select value={frequencyCategory} onValueChange={setFrequencyCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">Common</SelectItem>
                        <SelectItem value="uncommon">Uncommon</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pronunciation">Pronunciation (IPA)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="pronunciation"
                        value={pronunciation}
                        onChange={(e) => setPronunciation(e.target.value)}
                        placeholder="/ˈwɜːrd/"
                      />
                      <Button variant="outline" size="sm" onClick={playPronunciation}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phonetic">Phonetic Spelling</Label>
                    <Input
                      id="phonetic"
                      value={phonetic}
                      onChange={(e) => setPhonetic(e.target.value)}
                      placeholder="Alternative phonetic representation"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="etymology">Etymology</Label>
                  <Textarea
                    id="etymology"
                    value={etymology}
                    onChange={(e) => setEtymology(e.target.value)}
                    placeholder="Word origin and historical development"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="usage-notes">Usage Notes</Label>
                  <Textarea
                    id="usage-notes"
                    value={usageNotes}
                    onChange={(e) => setUsageNotes(e.target.value)}
                    placeholder="Context, register, and usage information"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Definitions */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Definitions</CardTitle>
                  <Button onClick={addDefinition} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Definition
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {definitions.map((definition, defIndex) => (
                  <div key={definition.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">Definition {defIndex + 1}</Badge>
                      {definitions.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeDefinition(definition.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label>Definition Text *</Label>
                      <Textarea
                        value={definition.text}
                        onChange={(e) => updateDefinition(definition.id, "text", e.target.value)}
                        placeholder="Enter the definition"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Part of Speech</Label>
                        <Select
                          value={definition.partOfSpeech}
                          onValueChange={(value) => updateDefinition(definition.id, "partOfSpeech", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="noun">Noun</SelectItem>
                            <SelectItem value="verb">Verb</SelectItem>
                            <SelectItem value="adjective">Adjective</SelectItem>
                            <SelectItem value="adverb">Adverb</SelectItem>
                            <SelectItem value="pronoun">Pronoun</SelectItem>
                            <SelectItem value="preposition">Preposition</SelectItem>
                            <SelectItem value="conjunction">Conjunction</SelectItem>
                            <SelectItem value="interjection">Interjection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Domain</Label>
                        <Input
                          value={definition.domain}
                          onChange={(e) => updateDefinition(definition.id, "domain", e.target.value)}
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                      <div>
                        <Label>Register</Label>
                        <Select
                          value={definition.register}
                          onValueChange={(value) => updateDefinition(definition.id, "register", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="informal">Informal</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="colloquial">Colloquial</SelectItem>
                            <SelectItem value="archaic">Archaic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Examples</Label>
                        <Button variant="ghost" size="sm" onClick={() => addArrayItem(definition.id, "examples")}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {definition.examples.map((example, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={example}
                              onChange={(e) => updateArrayItem(definition.id, "examples", index, e.target.value)}
                              placeholder="Example sentence"
                            />
                            {definition.examples.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem(definition.id, "examples", index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Synonyms */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Synonyms</Label>
                        <Button variant="ghost" size="sm" onClick={() => addArrayItem(definition.id, "synonyms")}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {definition.synonyms.map((synonym, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={synonym}
                              onChange={(e) => updateArrayItem(definition.id, "synonyms", index, e.target.value)}
                              placeholder="Synonym"
                            />
                            {definition.synonyms.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem(definition.id, "synonyms", index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Antonyms */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Antonyms</Label>
                        <Button variant="ghost" size="sm" onClick={() => addArrayItem(definition.id, "antonyms")}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {definition.antonyms.map((antonym, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={antonym}
                              onChange={(e) => updateArrayItem(definition.id, "antonyms", index, e.target.value)}
                              placeholder="Antonym"
                            />
                            {definition.antonyms.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem(definition.id, "antonyms", index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
