import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import PostCard from "@/components/PostCard"
import NewPostButton from "@/components/NewPostButton"
import PostListControls from "@/components/PostListControls"
import { prisma } from "@/lib/prisma"
import { PostWithCounts } from "@/types/post"
import { ReviewTarget } from "@prisma/client"
import TargetFilter from "@/components/TargetFilter"

type Props = {
  searchParams: Promise<{
    sort?: string
    filter?: string
    target?: string
  }>
}

export default async function Home({ searchParams }: Props) {
  const session = await getServerSession(authOptions)

  const { sort, filter, target } = await searchParams

  const userId = session?.user?.id ? Number(session.user.id) : -1

  const isSavedFilter = filter === "saved"
  const isPopularSort = sort === "popular"
  const selectedTarget: ReviewTarget | undefined =
    target === ReviewTarget.MANGA
      ? ReviewTarget.MANGA
      : target === ReviewTarget.ANIME
        ? ReviewTarget.ANIME
        : undefined

  const emptyMessage = isSavedFilter
  ? "保存済みの投稿がまだありません"
  : "投稿がまだありません"

  const where = {
    ...(isSavedFilter && {
      bookmarks: {
        some: {
          userId,
        },
      },
    }),
    ...(selectedTarget && {
      reviewTarget: {
        in:
          selectedTarget === ReviewTarget.MANGA
            ? [ReviewTarget.MANGA, ReviewTarget.BOTH]
            : [ReviewTarget.ANIME, ReviewTarget.BOTH],
      },
    }),
  }

  const posts: PostWithCounts[] = await prisma.post.findMany({
    where,
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
      <div className="flex justify-between gap-2 mb-4">
        <TargetFilter currentTarget={selectedTarget} currentSort={sort} currentFilter={filter} />
        <PostListControls currentSort={sort} currentFilter={filter} currentTarget={selectedTarget} />
      </div>

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