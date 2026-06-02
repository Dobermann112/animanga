"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    })

    alert("ログアウトしました")
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-orange-500 font-bold"
    >
      ログアウト
    </button>
  )
}