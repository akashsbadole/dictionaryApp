import { type NextRequest, NextResponse } from "next/server"
import { wordsetDictionary } from "@/lib/wordset-data"

// Mock function - In real implementation, this would call Google Gemini 2.0 Flash API
async function searchWordWithGemini(word: string) {
  // This would be the actual API call to Google Gemini 2.0 Flash
  // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     contents: [{
  //       parts: [{
  //         text: `Please provide a comprehensive definition for the word "${word}" including pronunciation, part of speech, definitions, examples, synonyms, and antonyms in JSON format.`
  //       }]
  //     }]
  //   })
  // })

  // Mock response for demonstration
  return {
    word: word,
    pronunciation: `/ˈwɜːrd/`,
    definitions: [
      {
        partOfSpeech: "noun",
        definition: `A single distinct meaningful element of speech or writing, used with others to form sentences.`,
        examples: [`The word 'example' has seven letters.`],
        synonyms: ["term", "expression", "vocable"],
        antonyms: [],
      },
    ],
    etymology: `From Old English 'word', from Proto-Germanic 'wurdan'.`,
    source: "Gemini 2.0 Flash API",
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    // First, try to find the word in the local WordSet dictionary
    const localResults = await wordsetDictionary.searchWords(query, 1)

    if (localResults && localResults.length > 0) {
      return NextResponse.json({
        query,
        source: "WordSet Dictionary",
        results: localResults,
        fallback: false,
      })
    }

    // If not found locally, search using Gemini 2.0 Flash API
    console.log(`Word "${query}" not found in local dictionary, searching with Gemini...`)
    const geminiResult = await searchWordWithGemini(query)

    return NextResponse.json({
      query,
      source: "Gemini 2.0 Flash API",
      results: [geminiResult],
      fallback: true,
    })
  } catch (error) {
    console.error("Dictionary search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
