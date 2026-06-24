import type { ReviewTarget } from "@prisma/client"

export type Post = {
  id: number
  userId: number
  title: string
  imageUrl: string | null
  description: string
  review: string | null
  rating: number
  reviewTarget: ReviewTarget
  createdAt: Date
  updatedAt: Date
}

export type PostWithCounts = Post & {
  user: {
    id: number
    name: string
    username: string | null
  }
  _count: {
    likes: number
    bookmarks: number
    comments: number
  }
  likes: {
    id: number
    userId: number
    postId: number
  }[]
  bookmarks: {
    id: number
    userId: number
    postId: number
  }[]
}