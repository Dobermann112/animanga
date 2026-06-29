"use client"

import { useRouter } from "next/navigation"
import type { Post } from "@/types/post"
import PostForm from "@/components/PostForm"
import type { PostFormValues } from "@/types/postForm"

type Props = {
  post: Post
}

export default function EditPostForm({ post }: Props) {
  const router = useRouter()

  const initialValues: PostFormValues = {
    title: post.title,
    imageUrl: post.imageUrl ?? "",
    rating: post.rating,
    reviewTarget: post.reviewTarget,
    description: post.description,
    review: post.review ?? "",
  }

  const handleSubmit = async (values: PostFormValues) => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values)
    })

    if(!res.ok) {
      alert("更新に失敗しました")
      return
    }

    router.push(`/posts/${post.id}`)
  }

  return (
    <PostForm
      title="投稿を編集"
      initialValues={initialValues}
      submitLabel="更新する"
      loadingLabel="更新中"
      onSubmit={handleSubmit}
    />
  )
}