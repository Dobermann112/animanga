"use client"

import { useRouter } from "next/navigation"
import type { PostFormValues } from "@/types/postForm"
import PostForm from "@/components/PostForm"
import { resolveImageSelection, ImageUploadError } from "@/lib/resolveImageSelection"

const initialValues: PostFormValues = {
  title: "",
  image: { kind: "NONE" },
  rating: 1,
  reviewTarget: "MANGA",
  description: "",
  review: "",
}

export default function NewPostPage() {
  const router = useRouter()

  const handleSubmit = async (values: PostFormValues) => {
    let imageUrl: string | null
    let imageSource: string | null

    try {
      const resolved = await resolveImageSelection(values.image)
      imageUrl = resolved.imageUrl
      imageSource = resolved.imageSource
    } catch (error) {
      alert(error instanceof ImageUploadError ? error.message : "投稿に失敗しました")
      return
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, imageUrl, imageSource })
    })

    if(!res.ok) {
      alert("投稿に失敗しました")
      return
    }

    router.push("/")
  }

  return (
    <PostForm
      title="投稿作成"
      initialValues={initialValues}
      submitLabel="投稿する"
      loadingLabel="投稿中..."
      onSubmit={handleSubmit}
    />
  )
}