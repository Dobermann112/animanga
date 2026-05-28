import Link from "next/link";

export default function NewPostPage() {
  return (
    <div>
      <Link
        href="posts/new"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-3xl text-white shadow-lg"
      >
        +
      </Link>
    </div>
  )
}