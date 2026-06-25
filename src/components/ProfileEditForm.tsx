"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Props = {
  initialName: string
  initialBio: string | null
}

export default function ProfileEditForm({ initialName, initialBio }: Props) {
  const router = useRouter()

  const [name, setName] = useState(initialName)
  const [bio, setBio] = useState(initialBio ?? "")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("")
    setIsLoading(true)

    if (!name.trim()) {
      setError("表示名を入力してください。")
      setIsLoading(false)
      return
    }

    if (name.length > 50) {
      setError("表示名は50文字以内で入力してください。")
      setIsLoading(false)
      return
    }

    if (bio.length > 300) {
      setError("自己紹介は300文字以内で入力してください。")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          bio,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "プロフィールの更新に失敗しました。")
        return
      }

      router.push("/mypage")
      router.refresh()
    } catch {
      setError("通信エラーが発生しました。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          表示名
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          自己紹介
        </label>

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="好きな作品やジャンルなどを自由に書いてみましょう"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isLoading ? "保存中..." : "保存する"}
        </button>

        <Link
          href="/mypage"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
        >
          キャンセル
        </Link>
      </div>
    </form>
  )
}