// WordSet Dictionary Data Integration
export interface WordSetEntry {
  id: string
  word: string
  wordset_id: string
  meanings: WordSetMeaning[]
}

export interface WordSetMeaning {
  id: string
  def: string
  example?: string
  speech_part: string
  labels?: string[]
  synonyms?: string[]
  antonyms?: string[]
}

// Transform WordSet data to our schema
export function transformWordSetEntry(wordsetEntry: WordSetEntry): any {
  return {
    id: wordsetEntry.id,
    headword: wordsetEntry.word,
    headword_normalized: wordsetEntry.word.toLowerCase(),
    frequency_category: "common", // Default, could be enhanced
    definitions: wordsetEntry.meanings.map((meaning, index) => ({
      id: meaning.id,
      definition_text: meaning.def,
      definition_order: index + 1,
      part_of_speech: {
        name: meaning.speech_part,
        abbreviation: getPartOfSpeechAbbreviation(meaning.speech_part),
      },
      domain: meaning.labels?.join(", ") || "",
      examples: meaning.example ? [{ example_text: meaning.example, example_order: 1 }] : [],
      synonyms: meaning.synonyms?.map((syn) => ({ synonym_word: syn })) || [],
      antonyms: meaning.antonyms?.map((ant) => ({ antonym_word: ant })) || [],
    })),
  }
}

function getPartOfSpeechAbbreviation(speechPart: string): string {
  const abbreviations: { [key: string]: string } = {
    noun: "n.",
    verb: "v.",
    adjective: "adj.",
    adverb: "adv.",
    pronoun: "pron.",
    preposition: "prep.",
    conjunction: "conj.",
    interjection: "interj.",
    determiner: "det.",
    exclamation: "excl.",
  }
  return abbreviations[speechPart.toLowerCase()] || speechPart
}

// WordSet Dictionary API Client
class WordSetDictionary {
  private baseUrl = "https://raw.githubusercontent.com/wordset/wordset-dictionary/master/data"
  private cache = new Map<string, WordSetEntry[]>()
  private allWords: WordSetEntry[] = []
  private isLoaded = false

  async loadDictionary(): Promise<void> {
    if (this.isLoaded) return

    try {
      console.log("Starting WordSet dictionary load...")

      // First try to load a small sample to test connectivity
      const testResponse = await fetch(`${this.baseUrl}/a.json`).catch(() => null)

      if (!testResponse || !testResponse.ok) {
        console.warn("Cannot access WordSet repository, using fallback data")
        this.loadSampleData()
        return
      }

      // Load dictionary data in smaller batches to avoid overwhelming
      const letters = "abcdefghijklmnopqrstuvwxyz".split("")
      const batchSize = 5
      let totalLoaded = 0

      for (let i = 0; i < letters.length; i += batchSize) {
        const batch = letters.slice(i, i + batchSize)
        const batchPromises = batch.map((letter) => this.loadLetterData(letter))

        const results = await Promise.allSettled(batchPromises)

        results.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value && Array.isArray(result.value)) {
            this.allWords.push(...result.value)
            totalLoaded += result.value.length
          } else {
            console.warn(`Failed to load data for letter ${batch[index]}`)
          }
        })

        // Add a small delay between batches
        if (i + batchSize < letters.length) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      }

      if (this.allWords.length === 0) {
        console.warn("No words loaded from WordSet, using fallback data")
        this.loadSampleData()
      } else {
        this.isLoaded = true
        console.log(`Successfully loaded ${this.allWords.length} words from WordSet dictionary`)
      }
    } catch (error) {
      console.error("Error loading WordSet dictionary:", error)
      this.loadSampleData()
    }
  }

  private async loadLetterData(letter: string): Promise<WordSetEntry[] | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${letter}.json`, {
        headers: {
          Accept: "application/json",
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle different data structures
      let words: WordSetEntry[] = []

      if (Array.isArray(data)) {
        words = data
      } else if (typeof data === "object" && data !== null) {
        // If it's an object, try to extract words from various possible structures
        if (data.words && Array.isArray(data.words)) {
          words = data.words
        } else if (data.entries && Array.isArray(data.entries)) {
          words = data.entries
        } else {
          // Convert object values to array
          words = Object.values(data).filter((item) => item && typeof item === "object" && item.word) as WordSetEntry[]
        }
      }

      // Validate and clean the data
      const validWords = words
        .filter(
          (word) =>
            word &&
            typeof word === "object" &&
            word.word &&
            typeof word.word === "string" &&
            word.meanings &&
            Array.isArray(word.meanings) &&
            word.meanings.length > 0,
        )
        .map((word) => ({
          ...word,
          id: word.id || `${word.word}_${Date.now()}_${Math.random()}`,
          wordset_id: word.wordset_id || word.id || word.word,
        }))

      return validWords.length > 0 ? validWords : null
    } catch (error) {
      console.warn(`Failed to load ${letter}.json:`, error.message)
      return null
    }
  }

  private loadSampleData(): void {
    console.log("Loading fallback sample data...")

    // Comprehensive fallback sample data in WordSet format
    this.allWords = [
      {
        id: "1",
        word: "algorithm",
        wordset_id: "algorithm_1",
        meanings: [
          {
            id: "alg_1",
            def: "A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.",
            example: "The search algorithm quickly found the relevant results.",
            speech_part: "noun",
            labels: ["computer science"],
            synonyms: ["procedure", "method", "process"],
            antonyms: [],
          },
        ],
      },
      {
        id: "2",
        word: "beautiful",
        wordset_id: "beautiful_1",
        meanings: [
          {
            id: "bea_1",
            def: "Pleasing the senses or mind aesthetically.",
            example: "The sunset was beautiful tonight.",
            speech_part: "adjective",
            synonyms: ["lovely", "attractive", "gorgeous", "stunning"],
            antonyms: ["ugly", "hideous", "unattractive"],
          },
        ],
      },
      {
        id: "3",
        word: "computer",
        wordset_id: "computer_1",
        meanings: [
          {
            id: "comp_1",
            def: "An electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program.",
            example: "She used her computer to write the report.",
            speech_part: "noun",
            labels: ["technology"],
            synonyms: ["machine", "device", "processor"],
            antonyms: [],
          },
        ],
      },
      {
        id: "4",
        word: "dictionary",
        wordset_id: "dictionary_1",
        meanings: [
          {
            id: "dict_1",
            def: "A book or electronic resource that lists the words of a language typically in alphabetical order and gives their meaning.",
            example: "Look up the word in the dictionary.",
            speech_part: "noun",
            labels: ["reference"],
            synonyms: ["lexicon", "glossary", "vocabulary"],
            antonyms: [],
          },
        ],
      },
      {
        id: "5",
        word: "example",
        wordset_id: "example_1",
        meanings: [
          {
            id: "ex_1",
            def: "A thing characteristic of its kind or illustrating a general rule.",
            example: "This is a good example of modern architecture.",
            speech_part: "noun",
            synonyms: ["instance", "case", "illustration", "sample"],
            antonyms: [],
          },
        ],
      },
      {
        id: "6",
        word: "function",
        wordset_id: "function_1",
        meanings: [
          {
            id: "func_1",
            def: "An activity or purpose natural to or intended for a person or thing.",
            example: "The function of the heart is to pump blood.",
            speech_part: "noun",
            synonyms: ["purpose", "role", "job", "duty"],
            antonyms: [],
          },
          {
            id: "func_2",
            def: "Work or operate in a proper or particular way.",
            example: "The machine functions perfectly.",
            speech_part: "verb",
            synonyms: ["operate", "work", "run", "perform"],
            antonyms: ["malfunction", "break"],
          },
        ],
      },
      {
        id: "7",
        word: "happy",
        wordset_id: "happy_1",
        meanings: [
          {
            id: "hap_1",
            def: "Feeling or showing pleasure or contentment.",
            example: "She was happy to see her old friend.",
            speech_part: "adjective",
            synonyms: ["joyful", "cheerful", "content", "pleased"],
            antonyms: ["sad", "unhappy", "miserable"],
          },
        ],
      },
      {
        id: "8",
        word: "important",
        wordset_id: "important_1",
        meanings: [
          {
            id: "imp_1",
            def: "Of great significance or value; likely to have a profound effect on success, survival, or well-being.",
            example: "It's important to eat healthy food.",
            speech_part: "adjective",
            synonyms: ["significant", "crucial", "vital", "essential"],
            antonyms: ["unimportant", "trivial", "insignificant"],
          },
        ],
      },
      {
        id: "9",
        word: "language",
        wordset_id: "language_1",
        meanings: [
          {
            id: "lang_1",
            def: "The method of human communication, either spoken or written, consisting of the use of words in a structured and conventional way.",
            example: "English is a widely spoken language.",
            speech_part: "noun",
            synonyms: ["tongue", "speech", "communication"],
            antonyms: [],
          },
        ],
      },
      {
        id: "10",
        word: "learn",
        wordset_id: "learn_1",
        meanings: [
          {
            id: "learn_1",
            def: "Acquire knowledge of or skill in something by study, experience, or being taught.",
            example: "She learned to speak French fluently.",
            speech_part: "verb",
            synonyms: ["study", "master", "acquire", "absorb"],
            antonyms: ["forget", "unlearn"],
          },
        ],
      },
      {
        id: "11",
        word: "quickly",
        wordset_id: "quickly_1",
        meanings: [
          {
            id: "qui_1",
            def: "At a fast speed; rapidly.",
            example: "She quickly finished her homework.",
            speech_part: "adverb",
            synonyms: ["rapidly", "swiftly", "speedily", "fast"],
            antonyms: ["slowly", "gradually"],
          },
        ],
      },
      {
        id: "12",
        word: "search",
        wordset_id: "search_1",
        meanings: [
          {
            id: "search_1",
            def: "Try to find something by looking or otherwise seeking carefully and thoroughly.",
            example: "She searched for her keys everywhere.",
            speech_part: "verb",
            synonyms: ["look", "seek", "hunt", "explore"],
            antonyms: ["find", "discover"],
          },
          {
            id: "search_2",
            def: "An act of searching for someone or something.",
            example: "The search for the missing person continued.",
            speech_part: "noun",
            synonyms: ["hunt", "quest", "investigation"],
            antonyms: [],
          },
        ],
      },
    ]

    this.isLoaded = true
    console.log(`Loaded ${this.allWords.length} sample words as fallback`)
  }

  async searchWords(query: string, limit = 20): Promise<WordSetEntry[]> {
    await this.loadDictionary()

    if (!query || !query.trim()) {
      return this.allWords.slice(0, limit)
    }

    const searchTerm = query.toLowerCase().trim()

    try {
      const results = this.allWords.filter((entry) => {
        if (!entry || !entry.word || !entry.meanings) return false

        // Search in word
        if (entry.word.toLowerCase().includes(searchTerm)) return true

        // Search in definitions
        return entry.meanings.some((meaning) => {
          if (!meaning || !meaning.def) return false

          return (
            meaning.def.toLowerCase().includes(searchTerm) ||
            (meaning.example && meaning.example.toLowerCase().includes(searchTerm))
          )
        })
      })

      // Sort by relevance (exact matches first, then starts with, then contains)
      results.sort((a, b) => {
        const aWord = a.word.toLowerCase()
        const bWord = b.word.toLowerCase()

        if (aWord === searchTerm) return -1
        if (bWord === searchTerm) return 1
        if (aWord.startsWith(searchTerm)) return -1
        if (bWord.startsWith(searchTerm)) return 1
        return 0
      })

      return results.slice(0, limit)
    } catch (error) {
      console.error("Error in searchWords:", error)
      return []
    }
  }

  async getWordById(id: string): Promise<WordSetEntry | null> {
    await this.loadDictionary()
    return this.allWords.find((entry) => entry.id === id) || null
  }

  async getRandomWords(count = 5): Promise<WordSetEntry[]> {
    await this.loadDictionary()

    if (this.allWords.length === 0) {
      return []
    }

    try {
      const shuffled = [...this.allWords].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, Math.min(count, this.allWords.length))
    } catch (error) {
      console.error("Error getting random words:", error)
      return this.allWords.slice(0, Math.min(count, this.allWords.length))
    }
  }

  async getWordsByLetter(letter: string): Promise<WordSetEntry[]> {
    await this.loadDictionary()
    return this.allWords.filter((entry) => entry.word.toLowerCase().startsWith(letter.toLowerCase()))
  }

  getStats() {
    return {
      totalWords: this.allWords.length,
      totalDefinitions: this.allWords.reduce((sum, entry) => sum + entry.meanings.length, 0),
      isLoaded: this.isLoaded,
    }
  }
}

// Export singleton instance
export const wordsetDictionary = new WordSetDictionary()
