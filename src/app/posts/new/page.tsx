"use client"

import { useRouter } from "next/navigation"
import type { PostFormValues } from "@/types/postForm"
import PostForm from "@/components/PostForm"

const initialValues: PostFormValues = {
  title: "",
  imageUrl: "",
  rating: 1,
  reviewTarget: "MANGA",
  description: "",
  review: "",
}

export default function NewPostPage() {
  const router = useRouter()

  const handleSubmit = async (values: PostFormValues) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values)
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