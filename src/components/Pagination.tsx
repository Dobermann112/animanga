"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

type PaginationProps = {
  currentPage: number
  totalPages: number
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const searchParams = useSearchParams()

  const pages: number[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  const createPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("page", String(page))

    return `/?${params.toString()}`
  }

  return (
    <div className="flex justify-center gap-2">
      {pages.map((page) => (
        <Link
          key={page}
          href={createPageHref(page)}
          className={
            page === currentPage
              ? "rounded-full bg-black px-3 py-1 text-sm text-white"
              : "rounded-full bg-white px-3 py-1 text-sm text-black"
          }
        >
          {page}
        </Link>
      ))}
    </div>
  )
}