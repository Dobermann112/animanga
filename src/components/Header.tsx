import Link from "next/link"

export default function Header() {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-orange-500">
        <Link href="/">AniManga</Link>
      </h1>

      <p className="text-gray-600 mt-2">
        アニメ・漫画レビューサービス
      </p>
    </div>
  )
}