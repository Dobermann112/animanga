import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import {
  MAX_UPLOAD_BYTES,
  isAllowedExtension,
  isAllowedMime,
  sniffImageType,
  extensionForSniffedType,
} from "@/lib/fileValidation"
import { saveUploadedImage } from "@/lib/imageStorage"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 })
    }

    let formData: FormData

    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json(
        { error: "リクエストの解析に失敗しました", code: "NO_FILE" },
        { status: 400 }
      )
    }

    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "画像ファイルが選択されていません", code: "NO_FILE" },
        { status: 400 }
      )
    }

    if (!isAllowedExtension(file.name)) {
      return NextResponse.json(
        { error: "jpg, jpeg, png, webp のみアップロードできます", code: "BAD_EXTENSION" },
        { status: 400 }
      )
    }

    if (!isAllowedMime(file.type)) {
      return NextResponse.json(
        { error: "jpg, jpeg, png, webp のみアップロードできます", code: "BAD_MIME" },
        { status: 400 }
      )
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "ファイルサイズが上限(5MB)を超えています", code: "TOO_LARGE" },
        { status: 400 }
      )
    }

    const bytes = new Uint8Array(await file.arrayBuffer())
    const sniffed = sniffImageType(bytes)

    if (!sniffed) {
      return NextResponse.json(
        { error: "画像ファイルとして認識できませんでした", code: "NOT_AN_IMAGE" },
        { status: 400 }
      )
    }

    const url = await saveUploadedImage(bytes, extensionForSniffedType(sniffed))

    return NextResponse.json({ url }, { status: 201 })
  } catch (error) {
    console.error("UPLOAD ERROR", error)

    return NextResponse.json(
      { error: "画像の保存に失敗しました", code: "STORAGE_FAILURE" },
      { status: 500 }
    )
  }
}
