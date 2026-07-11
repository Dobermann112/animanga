import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { searchMedia, AniListError, type AniListErrorKind } from "@/lib/anilist"
import type { MediaType } from "@/types/media"

const STATUS_BY_ERROR_KIND: Record<AniListErrorKind, number> = {
  TIMEOUT: 504,
  RATE_LIMIT: 429,
  NETWORK: 502,
  BAD_RESPONSE: 502,
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")?.trim() ?? ""
    const type = searchParams.get("type")

    if (!q) {
      return NextResponse.json({ error: "検索キーワードを入力してください" }, { status: 400 })
    }

    if (type !== "ANIME" && type !== "MANGA") {
      return NextResponse.json({ error: "type must be ANIME or MANGA" }, { status: 400 })
    }

    const results = await searchMedia(q, type as MediaType)

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    if (error instanceof AniListError) {
      return NextResponse.json(
        { error: "作品検索に失敗しました" },
        { status: STATUS_BY_ERROR_KIND[error.kind] }
      )
    }

    console.error("MEDIA SEARCH ERROR", error)

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
