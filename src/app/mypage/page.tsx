import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { postCardInclude } from "@/lib/postQuery"
import Link from "next/link"
import Pagination from "@/components/Pagination"
import PostCard from "@/components/PostCard"
import { Pencil } from "lucide-react"

type MyPageProps = {
  searchParams: Promise<{
    tab?: string
    page?: string
  }>
}

const PAGE_SIZE = 6

export default async function MyPage({ searchParams }: MyPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = Number(session.user.id)

  const params = await searchParams
  const currentTab =
    params.tab === "liked" || params.tab === "saved" || params.tab === "posts" || params.tab === "following"
      ? params.tab
      : "posts"

  const pageParam = Number(params.page ?? "1")
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  const skip = (currentPage - 1) * PAGE_SIZE

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          posts: true,
          likes: true,
          bookmarks: true,
          followers: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  const followingUsers =
    currentTab === "following"
      ? await prisma.follow.findMany({
          where: { followerId: userId },
          include: {
            following: {
              select: {
                id: true,
                name: true,
                username: true,
                bio: true,
                _count: { select: { posts: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : []

  const postWhere =
    currentTab === "liked"
      ? {
          likes: {
            some: {
              userId,
            },
          },
        }
      : currentTab === "saved"
        ? {
            bookmarks: {
              some: {
                userId,
              },
            },
          }
        : {
            userId,
          }

  const totalCount = currentTab === "following" ? 0 : await prisma.post.count({
    where: postWhere,
  })

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const posts = currentTab === "following" ? [] : await prisma.post.findMany({
    where: postWhere,
    include: postCardInclude(userId),
    orderBy: {
      createdAt: "desc"
    },
    skip,
    take: PAGE_SIZE,
  })

  return (
    <main className="mx-auto max-w-4xl px-4 py-2 text-black">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">My Page</p>

          <Link
            href="/mypage/edit"
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <Pencil size={14} />
            編集
          </Link>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
            {user.name.slice(0, 1)}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {user.email}
            </p>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {user.bio || "自己紹介はまだ設定されていません。"}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-4 flex gap-3 text-sm">
        <Link
          href="/mypage?tab=posts"
          className={`rounded-full border px-4 py-2 font-medium ${
            currentTab === "posts"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          投稿 {user._count.posts}
        </Link>

        <Link
          href="/mypage?tab=liked"
          className={`rounded-full border px-4 py-2 font-medium ${
            currentTab === "liked"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          いいね {user._count.likes}
        </Link>

        <Link
          href="/mypage?tab=saved"
          className={`rounded-full border px-4 py-2 font-medium ${
            currentTab === "saved"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          保存 {user._count.bookmarks}
        </Link>

        <Link
          href="/mypage?tab=following"
          className={`rounded-full border px-4 py-2 font-medium ${
            currentTab === "following"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          フォロー {user._count.followers}
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">
          {currentTab === "liked"
            ? "いいねした投稿"
            : currentTab === "saved"
              ? "保存した投稿"
              : currentTab === "following"
                ? "フォロー中のユーザー"
                : "自分の投稿"}
        </h2>

        {currentTab === "following" ? (
          followingUsers.length === 0 ? (
            <p className="text-gray-600">まだフォローしているユーザーはいません</p>
          ) : (
            <div className="space-y-3">
              {followingUsers.map(({ following: u }) => (
                <Link
                  key={u.id}
                  href={`/users/${u.username}`}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                    {u.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">投稿 {u._count.posts}</p>
                    {u.bio && (
                      <p className="mt-1 truncate text-sm text-gray-600">{u.bio}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : posts.length === 0 ? (
          <p className="text-gray-600">
            {currentTab === "liked" ? "まだいいねした投稿がありません" : currentTab === "saved" ? "まだ保存した投稿がありません" : "まだ投稿がありません"}
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (<PostCard key={post.id} post={post} />))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/mypage"
        />
      )}

    </main>
  )
}