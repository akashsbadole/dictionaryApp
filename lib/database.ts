// Database connection and query functions
import { createClient } from "@supabase/supabase-js"

// In a real app, these would come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "your-supabase-url"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-key"

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface DictionaryEntry {
  id: number
  headword: string
  headword_normalized: string
  pronunciation?: string
  phonetic?: string
  audio_url?: string
  frequency_rank?: number
  frequency_category: "common" | "uncommon" | "rare"
  etymology?: string
  usage_notes?: string
  created_at: string
  updated_at: string
  is_active: boolean
  definitions: Definition[]
  categories: Category[]
}

export interface Definition {
  id: number
  entry_id: number
  definition_text: string
  definition_order: number
  register?: string
  domain?: string
  part_of_speech: PartOfSpeech
  examples: Example[]
  synonyms: Synonym[]
  antonyms: Antonym[]
}

export interface Example {
  id: number
  definition_id: number
  example_text: string
  source?: string
  example_order: number
}

export interface Synonym {
  id: number
  definition_id: number
  synonym_word: string
}

export interface Antonym {
  id: number
  definition_id: number
  antonym_word: string
}

export interface PartOfSpeech {
  id: number
  name: string
  abbreviation: string
}

export interface Category {
  id: number
  name: string
  description?: string
}

export interface User {
  id: number
  email: string
  role: "user" | "admin"
  created_at: string
}

// Database query functions
export async function searchDictionaryEntries(searchTerm: string, limit = 20) {
  const { data, error } = await supabase
    .from("dictionary_entries")
    .select(`
      *,
      definitions (
        *,
        parts_of_speech (*),
        examples (*),
        synonyms (*),
        antonyms (*)
      ),
      entry_categories (
        categories (*)
      )
    `)
    .or(`headword_normalized.ilike.%${searchTerm.toLowerCase()}%,definitions.definition_text.ilike.%${searchTerm}%`)
    .eq("is_active", true)
    .order("frequency_rank", { ascending: true, nullsLast: true })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getDictionaryEntry(id: number) {
  const { data, error } = await supabase
    .from("dictionary_entries")
    .select(`
      *,
      definitions (
        *,
        parts_of_speech (*),
        examples (*),
        synonyms (*),
        antonyms (*)
      ),
      entry_categories (
        categories (*)
      )
    `)
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error) throw error
  return data
}

export async function getAllEntries(page = 1, limit = 50) {
  const offset = (page - 1) * limit

  const { data, error } = await supabase
    .from("dictionary_entries")
    .select(`
      *,
      definitions (
        *,
        parts_of_speech (*),
        examples (*),
        synonyms (*),
        antonyms (*)
      )
    `)
    .eq("is_active", true)
    .order("headword_normalized")
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function createDictionaryEntry(entry: Partial<DictionaryEntry>) {
  const { data, error } = await supabase
    .from("dictionary_entries")
    .insert([
      {
        ...entry,
        headword_normalized: entry.headword?.toLowerCase(),
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateDictionaryEntry(id: number, entry: Partial<DictionaryEntry>) {
  const { data, error } = await supabase
    .from("dictionary_entries")
    .update({
      ...entry,
      headword_normalized: entry.headword?.toLowerCase(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDictionaryEntry(id: number) {
  const { error } = await supabase.from("dictionary_entries").update({ is_active: false }).eq("id", id)

  if (error) throw error
}

export async function getPartsOfSpeech() {
  const { data, error } = await supabase.from("parts_of_speech").select("*").order("name")

  if (error) throw error
  return data
}

export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) throw error
  return data
}

// Open source dictionary API integration
export async function fetchFromOpenDictionary(word: string) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (!response.ok) throw new Error("Word not found")

    const data = await response.json()
    return data[0] // Return first result
  } catch (error) {
    console.error("Error fetching from open dictionary:", error)
    return null
  }
}

// Transform open dictionary data to our schema
export function transformOpenDictionaryData(apiData: any): Partial<DictionaryEntry> {
  return {
    headword: apiData.word,
    headword_normalized: apiData.word.toLowerCase(),
    pronunciation: apiData.phonetics?.[0]?.text,
    audio_url: apiData.phonetics?.[0]?.audio,
    frequency_category: "common" as const,
    definitions:
      apiData.meanings?.map((meaning: any, index: number) => ({
        definition_text: meaning.definitions[0]?.definition,
        definition_order: index + 1,
        part_of_speech: { name: meaning.partOfSpeech },
        examples: meaning.definitions[0]?.example
          ? [
              {
                example_text: meaning.definitions[0].example,
                example_order: 1,
              },
            ]
          : [],
        synonyms: meaning.synonyms?.map((syn: string) => ({ synonym_word: syn })) || [],
        antonyms: meaning.antonyms?.map((ant: string) => ({ antonym_word: ant })) || [],
      })) || [],
  }
}
