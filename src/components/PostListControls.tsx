import Link from "next/link"

type Props = {
  currentSort?: string
  currentFilter?: string
  currentTarget?: string
}

export default function PostListControls({ currentSort, currentFilter, currentTarget }: Props) {
  const isLatest = !currentSort && !currentFilter
  const isPopular = currentSort === "popular"
  const isSaved = currentFilter === "saved"

  const baseClass = "px-3 py-1 rounded-full text-xs font-medium transition"
  const activeClass = "bg-gray-800 text-white"
  const inactiveClass = "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"

  return (
    <div className="flex items-center gap-2">
      <Link
        href={currentTarget ? `/?target=${currentTarget}` : "/"}
        className={`${baseClass} ${isLatest ? activeClass : inactiveClass}`}
      >
        新着順
      </Link>

      <Link
        href={currentTarget ? `/?sort=popular&target=${currentTarget}` : "/?sort=popular"}
        className={`${baseClass} ${isPopular ? activeClass : inactiveClass}`}
      >
        人気順
      </Link>

      <Link
        href={currentTarget ? `/?filter=saved&target=${currentTarget}` : "/?filter=saved"}
        className={`${baseClass} ${isSaved ? activeClass : inactiveClass}`}
      >
        保存済み
      </Link>
    </div>
  )
}