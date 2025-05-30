import { type NextRequest, NextResponse } from "next/server"
import { wordsetDictionary } from "@/lib/wordset-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const word = await wordsetDictionary.getWordById(id)

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 })
    }

    return NextResponse.json(word)
  } catch (error) {
    console.error("Word API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
