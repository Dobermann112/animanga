export type ReviewTarget = "MANGA" | "ANIME" | "BOTH"

export type Post = {
  id: number
  userId: number
  title: string
  imageUrl: string | null
  comment: string
  review: string | null
  rating: number
  reviewTarget: ReviewTarget
  createdAt: Date
  updatedAt: Date
}