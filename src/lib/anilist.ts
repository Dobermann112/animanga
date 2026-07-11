import type { MediaSearchResult, MediaType } from "@/types/media"

const ANILIST_ENDPOINT = "https://graphql.anilist.co"
const REQUEST_TIMEOUT_MS = 8000

export type AniListErrorKind = "TIMEOUT" | "NETWORK" | "RATE_LIMIT" | "BAD_RESPONSE"

export class AniListError extends Error {
  kind: AniListErrorKind

  constructor(kind: AniListErrorKind, message: string) {
    super(message)
    this.name = "AniListError"
    this.kind = kind
  }
}

const SEARCH_QUERY = `
  query ($search: String, $type: MediaType) {
    Page(perPage: 10) {
      media(search: $search, type: $type) {
        id
        type
        format
        startDate {
          year
        }
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
      }
    }
  }
`

type AniListMedia = {
  id: number
  type: MediaType
  format: string | null
  startDate: { year: number | null } | null
  title: {
    romaji: string | null
    english: string | null
    native: string | null
  }
  coverImage: {
    large: string | null
  } | null
}

type AniListResponse = {
  data?: {
    Page?: {
      media?: AniListMedia[]
    }
  }
  errors?: { message: string }[]
}

function mapMedia(media: AniListMedia): MediaSearchResult | null {
  const title = media.title.romaji ?? media.title.english ?? media.title.native
  const imageUrl = media.coverImage?.large

  if (!title || !imageUrl) {
    return null
  }

  return {
    id: media.id,
    title,
    titleJapanese: media.title.native,
    titleEnglish: media.title.english,
    type: media.type,
    year: media.startDate?.year ?? null,
    imageUrl,
  }
}

export async function searchMedia(query: string, type: MediaType): Promise<MediaSearchResult[]> {
  let response: Response

  try {
    response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: { search: query, type },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new AniListError("TIMEOUT", "AniList API request timed out")
    }
    throw new AniListError("NETWORK", "Failed to reach AniList API")
  }

  if (response.status === 429) {
    throw new AniListError("RATE_LIMIT", "AniList API rate limit exceeded")
  }

  if (!response.ok) {
    throw new AniListError("BAD_RESPONSE", `AniList API returned status ${response.status}`)
  }

  let json: AniListResponse

  try {
    json = await response.json()
  } catch {
    throw new AniListError("BAD_RESPONSE", "AniList API returned invalid JSON")
  }

  if (json.errors && json.errors.length > 0) {
    throw new AniListError("BAD_RESPONSE", json.errors[0].message)
  }

  const media = json.data?.Page?.media

  if (!media) {
    throw new AniListError("BAD_RESPONSE", "AniList API response missing media list")
  }

  return media
    .map(mapMedia)
    .filter((result): result is MediaSearchResult => result !== null)
}
