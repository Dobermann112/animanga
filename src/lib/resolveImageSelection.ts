import type { ImageSelection } from "@/types/postForm"

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ImageUploadError"
  }
}

export async function resolveImageSelection(
  selection: ImageSelection
): Promise<{ imageUrl: string | null; imageSource: string | null }> {
  switch (selection.kind) {
    case "NONE":
      return { imageUrl: null, imageSource: null }

    case "EXISTING":
      return { imageUrl: selection.url, imageSource: selection.source }

    case "EXTERNAL":
      return { imageUrl: selection.url, imageSource: selection.source }

    case "UPLOAD": {
      const formData = new FormData()
      formData.append("file", selection.file)

      let res: Response

      try {
        res = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        })
      } catch {
        throw new ImageUploadError("画像のアップロードに失敗しました(通信エラー)。もう一度お試しください。")
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new ImageUploadError(data?.error ?? "画像のアップロードに失敗しました。もう一度お試しください。")
      }

      const data = await res.json()
      return { imageUrl: data.url, imageSource: null }
    }
  }
}
