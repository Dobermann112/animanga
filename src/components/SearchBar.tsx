"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
  currentQuery?: string
  currentSort?: string
  currentFilter?: string
  currentTarget?: string
}

export default function SearchBar({ currentQuery, currentSort, currentFilter, currentTarget }: Props) {
  const router = useRouter()
  const [keyword, setKeyword] = useState(currentQuery ?? "")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (currentSort) {
      params.set("sort", currentSort)
    }

    if (currentFilter) {
      params.set("filter", currentFilter)
    }

    if (currentTarget) {
      params.set("target", currentTarget)
    }

    const trimmedKeyword = keyword.trim()

    if (trimmedKeyword) {
      params.set("q", trimmedKeyword)
    }

    const queryString = params.toString()

    router.push(queryString ? `/?${queryString}` : "/")
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="タイトルで検索"
        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
      />

      <button
        type="submit"
        className="rounded-full bg-gray-800 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700"
      >
        検索
      </button>
    </form>
  )
}