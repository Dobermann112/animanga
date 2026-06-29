import type { ReviewTarget } from "@prisma/client";

export type PostFormValues = {
  title: string
  imageUrl: string
  rating: number
  reviewTarget: ReviewTarget
  description: string
  review: string
}