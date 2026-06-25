import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import LogoutButton from "./LogoutButton"
import { prisma } from "@/lib/prisma"

export default async function Header() {
  const session = await getServerSession(authOptions)

  const currentUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: {
          id: Number(session.user.id),
        },
        select: {
          name: true,
        },
      })
    : null

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
              <Link
                href="/mypage"
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-gray-100 transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {currentUser?.name.slice(0, 1)}
                </div>

                <span className="font-medium text-black">
                  {currentUser?.name}
                </span>
              </Link>

              <LogoutButton />
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