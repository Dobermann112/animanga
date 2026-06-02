import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

export default async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-orange-500">
            <Link href="/">AniManga</Link>
          </h1>

          <p className="text-gray-600 mt-2">
            アニメ・漫画レビューサービス
          </p>
        </div>

        <div className="flex gap-3 text-sm">
          {session?.user ? (
            <>
              <span className="text-gray-700">
                {session.user.name} さん
              </span>
              <Link href="/logout" className="text-orange-500 font-bold">
                ログアウト
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-orange-500 font-bold">
                ログイン
              </Link>
              <Link href="/register" className="text-orange-500 font-bold">
                新規登録
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}