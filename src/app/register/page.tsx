"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    setError("")
    alert("ユーザー登録が完了しました")
    router.push("/login")
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
      <h1 className="text-xl font-bold text-gray-800">新規登録</h1>

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="name" className="text-sm text-gray-800">
            ユーザー名
          </label>
          <input
            id="name"
            type="text"
            placeholder="ユーザー名"
            className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="text-sm text-gray-800">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@example.com"
            className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="text-sm text-gray-800">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            placeholder="8文字以上"
            className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded mt-6"
        >
          登録する
        </button>
        <p className="mt-4 text-sm text-gray-600 text-center">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-orange-500 font-bold">
            ログイン
          </Link>
        </p>
      </form>
    </div>
  )
}