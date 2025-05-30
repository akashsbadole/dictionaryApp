import { type NextRequest, NextResponse } from "next/server"
import { wordsetDictionary } from "@/lib/wordset-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const count = Number.parseInt(searchParams.get("count") || "5")

  try {
    const randomWords = await wordsetDictionary.getRandomWords(count)

    return NextResponse.json({
      count: randomWords.length,
      data: randomWords,
    })
  } catch (error) {
    console.error("Random words API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
