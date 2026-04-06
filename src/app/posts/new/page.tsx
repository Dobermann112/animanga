"use client"

import { useState } from "react"
import type { ReviewTarget } from "@/types/post"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [rating, setRating] = useState<number>(1)
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget>("manga")
  const [comment, setComment] = useState("")
  const [review, setReview] = useState("")

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const postData = {
      title,
      imageUrl,
      rating,
      reviewTarget,
      comment,
      review,
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    })

    const data = await res.json()

    console.log(data)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">投稿作成</h1>

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label htmlFor="title" className="text-sm text-gray-800">
                タイトル
              </label>
              <input
                id="title"
                type="text"
                placeholder="作品タイトル"
                className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="imageUrl" className="text-sm text-gray-800">
                画像URL
              </label>
              <input
                id="imageUrl"
                type="text"
                placeholder="画像URLを入力"
                className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="rating" className="text-sm text-gray-800">
                評価
              </label>
              <select
                id="rating"
                className="w-full border rounded px-3 py-2 mt-1 text-black"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value="1">★1</option>
                <option value="2">★2</option>
                <option value="3">★3</option>
                <option value="4">★4</option>
                <option value="5">★5</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-800">レビュー対象</label>
              <div className="flex gap-2 mt-2 text-black">
                <button
                  type="button"
                  onClick={() => setReviewTarget("manga")}
                  className={
                    reviewTarget === "manga"
                      ? "bg-orange-500 text-white px-3 py-1 rounded"
                      : "border px-3 py-1 rounded"
                  }
                >
                  漫画
                </button>
                <button
                  type="button"
                  onClick={() => setReviewTarget("anime")}
                  className={
                    reviewTarget === "anime"
                      ? "bg-orange-500 text-white px-3 py-1 rounded"
                      : "border px-3 py-1 rounded"
                  }
                >
                  アニメ
                </button>
                <button
                  type="button"
                  onClick={() => setReviewTarget("both")}
                  className={
                    reviewTarget === "both"
                      ? "bg-orange-500 text-white px-3 py-1 rounded"
                      : "border px-3 py-1 rounded"
                  }
                >
                  両方
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="comment" className="text-sm text-gray-800">
                コメント
              </label>
              <textarea
                id="comment"
                rows={3}
                placeholder="一言コメント"
                className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="review" className="text-sm text-gray-800">
                詳細レビュー（任意）
              </label>
              <textarea
                id="review"
                rows={5}
                placeholder="詳しいレビュー"
                className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded mt-6"
            >
              投稿する
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}