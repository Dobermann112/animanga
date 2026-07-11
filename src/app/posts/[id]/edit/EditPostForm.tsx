"use client"

import { useRouter } from "next/navigation"
import type { Post } from "@/types/post"
import PostForm from "@/components/PostForm"
import type { PostFormValues } from "@/types/postForm"
import { resolveImageSelection, ImageUploadError } from "@/lib/resolveImageSelection"

type Props = {
  post: Post
}

export default function EditPostForm({ post }: Props) {
  const router = useRouter()

  const initialValues: PostFormValues = {
    title: post.title,
    image: post.imageUrl
      ? { kind: "EXISTING", url: post.imageUrl, source: post.imageSource }
      : { kind: "NONE" },
    rating: post.rating,
    reviewTarget: post.reviewTarget,
    description: post.description,
    review: post.review ?? "",
  }

  const handleSubmit = async (values: PostFormValues) => {
    let imageUrl: string | null
    let imageSource: string | null

    try {
      const resolved = await resolveImageSelection(values.image)
      imageUrl = resolved.imageUrl
      imageSource = resolved.imageSource
    } catch (error) {
      alert(error instanceof ImageUploadError ? error.message : "更新に失敗しました")
      return
    }

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, imageUrl, imageSource })
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