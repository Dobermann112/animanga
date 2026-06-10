import Link from "next/link"

type Props = {
  currentTarget?: string
  currentSort? : string
  currentFilter? : string
  currentQuery? :string
}

export default function TargetFilter({ currentTarget, currentSort, currentFilter, currentQuery }: Props) {
  const baseClass = "px-3 py-1 rounded-full text-xs font-medium transition"
  const activeClass = "bg-gray-800 text-white"
  const inactiveClass = "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"

  const createHref = (target?: string) => {
    const params = new URLSearchParams()

    if (currentSort) {
      params.set("sort", currentSort)
    }

    if (currentFilter) {
      params.set("filter", currentFilter)
    }

    if (target) {
      params.set("target", target)
    }

    if (currentQuery) {
      params.set("q", currentQuery)
    }

    const queryString = params.toString()

    return queryString ? `/?${queryString}` : "/"
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={createHref()}
        className={`${baseClass} ${!currentTarget ? activeClass : inactiveClass}`}
      >
        すべて
      </Link>

      <Link
        href={createHref("MANGA")}
        className={`${baseClass} ${currentTarget === "MANGA" ? activeClass : inactiveClass}`}
      >
        漫画
      </Link>

      <Link
        href={createHref("ANIME")}
        className={`${baseClass} ${currentTarget === "ANIME" ? activeClass : inactiveClass}`}
      >
        アニメ
      </Link>
    </div>
  )
}