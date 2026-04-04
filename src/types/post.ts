export type ReviewTarget = "manga" | "anime" | "both"

export type Post = {
  id: string
  title: string
  image_url: string
  comment: string
  review?: string
  rating: number
  review_target: ReviewTarget
}