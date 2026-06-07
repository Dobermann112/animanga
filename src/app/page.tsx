import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import PostCard from "@/components/PostCard"
import NewPostButton from "@/components/NewPostButton"
import PostListControls from "@/components/PostListControls"
import { prisma } from "@/lib/prisma"
import { PostWithCounts } from "@/types/post"

type Props = {
  searchParams: Promise<{
    sort?: string
    filter?: string
  }>
}

export default async function Home({ searchParams }: Props) {
  const session = await getServerSession(authOptions)

  const { sort, filter } = await searchParams

  const userId = session?.user?.id ? Number(session.user.id) : -1

  const isSavedFilter = filter === "saved"
  const isPopularSort = sort === "popular"

  const emptyMessage = isSavedFilter
  ? "保存済みの投稿がまだありません"
  : "投稿がまだありません"

  const posts: PostWithCounts[] = await prisma.post.findMany({
    where: isSavedFilter
      ? {
        bookmarks: {
          some: {
            userId,
          },
        },
      }
      : undefined,
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
    orderBy: isPopularSort
      ? {
          likes: {
            _count: "desc",
          },
        }
      : {
          createdAt: "desc",
        },
  })
  return (
    <>
      <PostListControls currentSort={sort} currentFilter={filter} />

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">{emptyMessage}</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}

      <NewPostButton isLoggedIn={!!session?.user} />
    </>
  )
}