import Link from "next/link"

type Props = {
  currentSort?: string
  currentFilter?: string
}

export default function PostListControls({ currentSort, currentFilter }: Props) {
  const isLatest = !currentSort && !currentFilter
  const isPopular = currentSort === "popular"
  const isSaved = currentFilter === "saved"

  const baseClass = "px-4 py-2 rounded-full text-sm font-bold transition"
  const activeClass = "bg-gray-800 text-white"
  const inactiveClass = "bg-gray-100 text-gray-600 hover:bg-gray-200"

  return (
    <div className="flex justify-end gap-2 mb-4">
      <Link
        href="/"
        className={`${baseClass} ${isLatest ? activeClass : inactiveClass}`}
      >
        新着
      </Link>

      <Link
        href="/?sort=popular"
        className={`${baseClass} ${isPopular ? activeClass : inactiveClass}`}
      >
        人気
      </Link>

      <Link
        href="/?filter=saved"
        className={`${baseClass} ${isSaved ? activeClass : inactiveClass}`}
      >
        保存済み
      </Link>
    </div>
  )
}