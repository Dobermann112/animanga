import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import PostCard from "@/components/PostCard"

type Props = {
  params: Promise<{
    username: string
  }>
}

export default async function UserDetailPage({ params }: Props) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id ? Number(session.user.id) : null

  if (currentUserId === user.id) {
    redirect("/mypage")
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
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
          userId: currentUserId ?? -1,
        },
      },
      bookmarks: {
        where: {
          userId: currentUserId ?? -1,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <main className="mx-auto max-w-4xl px04 py-2 text-black">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
            {user.name.slice(0, 1)}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              投稿 {user._count.posts}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">
          {user.name}さんの投稿
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-600">
            まだ投稿がありません
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}