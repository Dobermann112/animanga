import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "posts")

export async function saveUploadedImage(bytes: Uint8Array, extension: string): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true })

  const filename = `${randomUUID()}.${extension}`
  await writeFile(path.join(UPLOAD_DIR, filename), bytes)

  return `/uploads/posts/${filename}`
}
