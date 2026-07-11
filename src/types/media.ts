export type MediaType = "ANIME" | "MANGA"

export type MediaSearchResult = {
  id: number
  title: string
  titleJapanese: string | null
  titleEnglish: string | null
  type: MediaType
  year: number | null
  imageUrl: string
}
