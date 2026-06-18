import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import Pagination from "@/components/Pagination"
import PostCard from "@/components/PostCard"
import NewPostButton from "@/components/NewPostButton"
import PostListControls from "@/components/PostListControls"
import { prisma } from "@/lib/prisma"
import { PostWithCounts } from "@/types/post"
import { ReviewTarget } from "@prisma/client"
import TargetFilter from "@/components/TargetFilter"
import SearchBar from "@/components/SearchBar"

type Props = {
  searchParams: Promise<{
    sort?: string
    filter?: string
    target?: string
    q?: string
    page?: string
  }>
}

const PAGE_SIZE = 6

export default async function Home({ searchParams }: Props) {
  const session = await getServerSession(authOptions)

  const { sort, filter, target, q, page } = await searchParams

  const pageParam = Number(page ?? "1")
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  const skip = (currentPage - 1) * PAGE_SIZE

  const userId = session?.user?.id ? Number(session.user.id) : -1

  const isSavedFilter = filter === "saved"
  const isPopularSort = sort === "popular"
  const selectedTarget: ReviewTarget | undefined =
    target === ReviewTarget.MANGA
      ? ReviewTarget.MANGA
      : target === ReviewTarget.ANIME
        ? ReviewTarget.ANIME
        : undefined

  const keyword = q?.trim() || undefined

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
    ...(keyword && {
      title: {
        contains: keyword,
      },
    }),
  }

  const totalCount = await prisma.post.count({
    where,
  })

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const posts: PostWithCounts[] = await prisma.post.findMany({
    where,
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
    orderBy: isPopularSort
      ? {
          likes: {
            _count: "desc",
          },
        }
      : {
          createdAt: "desc",
        },
    skip,
    take: PAGE_SIZE,
  })
  return (
    <>
      <SearchBar key={q ?? ""} currentQuery={q} currentSort={sort} currentFilter={filter} currentTarget={selectedTarget} />

      <div className="flex items-center justify-between mb-4">
        <TargetFilter currentTarget={selectedTarget} currentSort={sort} currentFilter={filter} />
        <PostListControls currentSort={sort} currentFilter={filter} currentTarget={selectedTarget} />
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">{emptyMessage}</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}

      <NewPostButton isLoggedIn={!!session?.user} />
    </>
  )
}