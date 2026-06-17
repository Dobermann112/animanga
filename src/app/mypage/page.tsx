import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import PostCard from "@/components/PostCard"

type MyPageProps = {
  searchParams: Promise<{
    tab?: string
  }>
}

export default async function MyPage({ searchParams }: MyPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = Number(session.user.id)

  const params = await searchParams
  const currentTab =
    params.tab === "liked" || params.tab === "saved" || params.tab === "posts"
      ? params.tab
      : "posts"

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
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

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

  const posts = await prisma.post.findMany({
    where: postWhere,
    include: {
      _count: {
        select: {
          likes: true,
          bookmarks: true,
          comments: true,
        },
      },
      likes: {
        where: {
          userId,
        },
      },
      bookmarks: {
        where: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc"
    },
  })

  return (
    <main className="mx-auto max-w-4xl px-4 py-2 text-black">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">My Page</p>

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
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">
          {currentTab === "liked" ? "いいねした投稿" : currentTab === "saved" ? "保存した投稿" : "自分の投稿"}
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-600">
            {currentTab === "liked" ? "まだいいねした投稿がありません" : currentTab === "saved" ? "まだ保存した投稿がありません" : "まだ投稿がありません"}
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (<PostCard key={post.id} post={post} />))}
          </div>
        )}
      </div>
    </main>
  )
}