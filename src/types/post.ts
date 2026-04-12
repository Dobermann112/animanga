export type ReviewTarget = "MANGA" | "ANIME" | "BOTH"

export type Post = {
  id: string
  title: string
  image_url: string
  comment: string
  review?: string
  rating: number
  review_target: ReviewTarget
}