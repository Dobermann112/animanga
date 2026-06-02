import Link from "next/link";

type Props = {
  isLoggedIn: boolean
}

export default function NewPostButton({ isLoggedIn }: Props) {
  return (
    <div>
      <Link
        href={isLoggedIn ? "/posts/new" : "/register"}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-3xl text-white shadow-lg"
        title={isLoggedIn ? "投稿する" : "投稿するには新規登録が必要です"}
      >
        +
      </Link>
    </div>
  )
}