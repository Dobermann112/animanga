"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

type PaginationProps = {
  currentPage: number
  totalPages: number
  basePath?: string
}

export default function Pagination({ currentPage, totalPages, basePath = "/" }: PaginationProps) {
  const searchParams = useSearchParams()

  const pages: number[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  const createPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("page", String(page))

    return `${basePath}?${params.toString()}`
  }

  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {hasPreviousPage ? (
        <Link
          href={createPageHref(currentPage - 1)}
          className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-100"
        >
          前へ
        </Link>
      ) : (
        <span className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-300">
          前へ
        </span>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={createPageHref(page)}
          className={
            page === currentPage
              ? "rounded-full bg-gray-900 px-3 py-1 text-sm font-medium text-white"
              : "rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-100"
          }
        >
          {page}
        </Link>
      ))}

      {hasNextPage ? (
        <Link
          href={createPageHref(currentPage + 1)}
          className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-100"
        >
          次へ
        </Link>
      ) : (
        <span className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-300">
          次へ
        </span>
      )}
    </div>
  )
}