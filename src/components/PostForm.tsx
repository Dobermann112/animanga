"use client"

import { useState } from "react"
import type { PostFormValues } from "@/types/postForm"
import PostImagePicker from "@/components/PostImagePicker"

type Props = {
  title: string
  initialValues: PostFormValues
  submitLabel: string
  loadingLabel: string
  onSubmit: (value: PostFormValues) => Promise<void>
}

export default function PostForm({
  title,
  initialValues,
  submitLabel,
  loadingLabel,
  onSubmit,
}: Props) {
  const [formValues, setFormValues] = useState<PostFormValues>(initialValues)
  const [loading, setLoading] = useState(false)

  const handleChange = <K extends keyof PostFormValues>(
    field: K,
    value: PostFormValues[K]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    try {
      await onSubmit(formValues)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
      <h1 className="text-xl font-bold text-gray-800">
        {title}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="title" className="text-sm text-gray-800">
            タイトル
          </label>
          <input
            id="title"
            type="text"
            placeholder="作品タイトル"
            className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray-400"
            value={formValues.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <PostImagePicker
          value={formValues.image}
          onChange={(next) => handleChange("image", next)}
          reviewTarget={formValues.reviewTarget}
          onExternalSelectTitle={(t) => handleChange("title", t)}
          disabled={loading}
        />

        <div className="mt-4">
          <label htmlFor="rating" className="text-sm text-gray-800">
            評価
          </label>
          <select
            id="rating"
            className="w-full border rounded px-3 py-2 mt-1 text-black"
            value={formValues.rating}
            onChange={(e) => handleChange("rating", Number(e.target.value))}
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
              onClick={() => handleChange("reviewTarget", "MANGA")}
              className={
                formValues.reviewTarget === "MANGA"
                  ? "bg-orange-500 text-white px-3 py-1 rounded"
                  : "border px-3 py-1 rounded"
              }
            >
              漫画
            </button>

            <button
              type="button"
              onClick={() => handleChange("reviewTarget", "ANIME")}
              className={
                formValues.reviewTarget === "ANIME"
                  ? "bg-orange-500 text-white px-3 py-1 rounded"
                  : "border px-3 py-1 rounded"
              }
            >
              アニメ
            </button>

            <button
              type="button"
              onClick={() => handleChange("reviewTarget", "BOTH")}
              className={
                formValues.reviewTarget === "BOTH"
                  ? "bg-orange-500 text-white px-3 py-1 rounded"
                  : "border px-3 py-1 rounded"
              }
            >
              両方
            </button>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="description" className="text-sm text-gray-800">
            概要
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="作品概要"
            className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray-400"
            value={formValues.description}
            onChange={(e) => handleChange("description", e.target.value)}
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
            className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray-400"
            value={formValues.review}
            onChange={(e) => handleChange("review", e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded mt-6 disabled:opacity-60"
        >
          {loading ? loadingLabel : submitLabel}
        </button>
      </form>
    </div>
  )
}