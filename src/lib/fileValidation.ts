export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5MB

export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const

export type SniffedImageType = "jpeg" | "png" | "webp"

export function getFileExtension(filename: string): string | null {
  const parts = filename.split(".")
  if (parts.length < 2) return null
  return parts[parts.length - 1].toLowerCase()
}

export function isAllowedExtension(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ext !== null && (ALLOWED_EXTENSIONS as readonly string[]).includes(ext)
}

export function isAllowedMime(mime: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime)
}

// クライアントの申告(拡張子・MIME)を信用せず、実際のバイト列(マジックナンバー)から画像形式を判定する
export function sniffImageType(bytes: Uint8Array): SniffedImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg"
  }

  if (
    bytes.length >= 4 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png"
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp"
  }

  return null
}

export function extensionForSniffedType(type: SniffedImageType): string {
  return type === "jpeg" ? "jpg" : type
}
