import type { ReviewTarget } from "@prisma/client";

export type ImageSelection =
  | { kind: "NONE" }
  | { kind: "EXISTING"; url: string; source: string | null }
  | { kind: "EXTERNAL"; url: string; source: "ANILIST" }
  | { kind: "UPLOAD"; file: File; previewUrl: string }

export type PostFormValues = {
  title: string
  image: ImageSelection
  rating: number
  reviewTarget: ReviewTarget
  description: string
  review: string
}