import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import PostCard from "@/components/PostCard"
import NewPostButton from "@/components/NewPostButton"
import { prisma } from "@/lib/prisma"
import { PostWithCounts } from "@/types/post"

export default async function Home() {
  const session = await getServerSession(authOptions)

  const userId = session?.user?.id ? Number(session.user.id) : -1

  const posts: PostWithCounts[] = await prisma.post.findMany({
    include: {
      _count: {
        select: {
          likes: true,
          bookmarks: true,
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
      createdAt: "desc",
    },
  })
  return (
    <>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">投稿がまだありません</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}

      <NewPostButton isLoggedIn={!!session?.user} />
    </>
  )
}