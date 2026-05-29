import { ReviewTarget } from "@prisma/client"

type Props = {
  reviewTarget: ReviewTarget
}

export default function ReviewTargetTag({ reviewTarget }: Props) {
  if (reviewTarget === "ANIME") {
    return (
      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded mr-2">
        アニメ
      </span>
    )
  }
  if (reviewTarget === "MANGA") {
    return (
      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded mr-2">
        漫画
      </span>
    )
  }
  return (
    <>
      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded mr-2">
        漫画
      </span>
      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
        アニメ
      </span>
    </>
  )
}