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

  const baseClass = "px-4 py-2 rounded-full text-sm font-bold transition"
  const activeClass = "bg-gray-800 text-white"
  const inactiveClass = "bg-gray-100 text-gray-600 hover:bg-gray-200"

  return (
    <>
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
    </>
  )
}