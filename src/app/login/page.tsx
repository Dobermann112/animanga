"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Invalid email or password")
      return
    }

    setError("")
    router.push("/")
  }
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
      <h1 className="text-xl font-bold text-gray-800">ログイン</h1>

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
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
            placeholder="パスワード"
            className="w-full border rounded px-3 py-2 mt-1 text-black placeholder:text-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded mt-6"
        >
          ログイン
        </button>
        <p className="mt-4 text-sm text-gray-600 text-center">
          アカウントをお持ちでない方は{" "}
          <Link href="/register" className="text-orange-500 font-bold">
            新規登録
          </Link>
        </p>
      </form>
    </div>
  )
}