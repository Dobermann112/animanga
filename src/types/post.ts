export type ReviewTarget = "MANGA" | "ANIME" | "BOTH"

export type Post = {
  id: string
  title: string
  imageUrl: string
  comment: string
  review?: string
  rating: number
  reviewTarget: ReviewTarget
}