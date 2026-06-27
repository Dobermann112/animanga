import Link from "next/link";
import { User } from "lucide-react";

type Props = {
  username: string
  name: string
  variant?: "badge" | "text"
  className?: string
}

export default function UserLink({
  username,
  name,
  variant = "badge",
  className = "",
}: Props) {
  if (variant === "text") {
    return(
      <Link
        href={`/users/${username}`}
        className={`text-sm font-semibold text-gray-900 transition hover:text-orange-500 ${className}`}
      >
        {name}
      </Link>
    )
  }

  return (
    <Link
      href={`/users/${username}`}
      className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 transition ${className}`}
    >
      <User size={12} />
      {name}
    </Link>
  )
}