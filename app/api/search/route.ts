import { type NextRequest, NextResponse } from "next/server"
import { wordsetDictionary } from "@/lib/wordset-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const results = await wordsetDictionary.searchWords(query, limit)

    return NextResponse.json({
      query,
      results: results.length,
      data: results,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
