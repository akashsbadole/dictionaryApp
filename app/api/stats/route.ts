import { NextResponse } from "next/server"
import { wordsetDictionary } from "@/lib/wordset-data"

export async function GET() {
  try {
    const stats = wordsetDictionary.getStats()

    return NextResponse.json({
      totalWords: stats.totalWords,
      totalDefinitions: stats.totalDefinitions,
      isLoaded: stats.isLoaded,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
