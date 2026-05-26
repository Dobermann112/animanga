"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Post } from "@/types/post"

type Props = {
  post: Post
}

export default function EditPostForm({ post }: Props) {
  const router = useRouter()

  const [title, setTitle] = useState(post.title)
  const [imageUrl, setImageUrl] = useState(post.imageUrl ?? "")
  const [rating, setRating] = useState(post.rating)
  const [reviewTarget, setReviewTarget] = useState(post.reviewTarget)
  const [comment, setComment] = useState(post.comment)
  const [review, setReview] = useState(post.review ?? "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    const postData = {
      title,
      imageUrl,
      rating,
      reviewTarget,
      comment,
      review,
    }

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    })

    if(!res.ok) {
      alert("更新に失敗しました")
      setLoading(false)
      return
    }

    const data = await res.json()
    console.log(data)

    setLoading(false)
    router.push(`/posts/${post.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">

          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            投稿を編集
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">タイトル</label>
              <input className="w-full border rounded px-3 py-2 mt-2 text-black placeholder:text-gray-400"  placeholder="作品タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">画像URL</label>
              <input className="w-full border rounded px-3 py-2 mt-2 text-black placeholder:text-gray-400" placeholder="画像のURLを入力" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">評価</label>
              <select className="w-full border rounded px-3 py-2 mt-1 text-black" value={rating} onChange={(e) => setRating(Number(e.target.value))} >
                <option value="1">★1</option>
                <option value="2">★2</option>
                <option value="3">★3</option>
                <option value="4">★4</option>
                <option value="5">★5</option>
              </select>
            </div>

            <div className="flex gap-2 mt-2 text-black">
              <label className="text-sm font-medium text-gray-700">レビュー対象</label>
              <button
                type="button"
                onClick={() => setReviewTarget("MANGA")}
                className={
                  reviewTarget === "MANGA"
                    ? "bg-orange-500 text-white px-3 py-1 rounded"
                    : "border px-3 py-1 rounded"
                }
              >
                漫画
              </button>
              <button
                type="button"
                onClick={() => setReviewTarget("ANIME")}
                className={
                  reviewTarget === "ANIME"
                    ? "bg-orange-500 text-white px-3 py-1 rounded"
                    : "border px-3 py-1 rounded"
                }
              >
                アニメ
              </button>
              <button
                type="button"
                onClick={() => setReviewTarget("BOTH")}
                className={
                  reviewTarget === "BOTH"
                    ? "bg-orange-500 text-white px-3 py-1 rounded"
                    : "border px-3 py-1 rounded"
                }
              >
                両方
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">コメント</label>
              <textarea className="w-full border rounded px-3 py-2 mt-2 text-black placeholder:text-gray-400" placeholder="一言コメント" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">レビュー</label>
              <textarea className="w-full border rounded px-3 py-2 mt-2 text-black placeholder:text-gray-400" placeholder="詳しいレビュー" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded mt-6"
            >
              {loading ? "更新中..." : "更新する"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}