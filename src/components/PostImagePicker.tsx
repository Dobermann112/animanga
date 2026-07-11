"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { ReviewTarget } from "@prisma/client"
import type { ImageSelection } from "@/types/postForm"
import type { MediaSearchResult, MediaType } from "@/types/media"
import {
  MAX_UPLOAD_BYTES,
  isAllowedExtension,
  isAllowedMime,
  sniffImageType,
} from "@/lib/fileValidation"

type Props = {
  value: ImageSelection
  onChange: (next: ImageSelection) => void
  reviewTarget: ReviewTarget
  onExternalSelectTitle?: (title: string) => void
  disabled?: boolean
}

export default function PostImagePicker({
  value,
  onChange,
  reviewTarget,
  onExternalSelectTitle,
  disabled = false,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<MediaType>("MANGA")
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [results, setResults] = useState<MediaSearchResult[] | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  const effectiveSearchType: MediaType =
    reviewTarget === "BOTH" ? searchType : (reviewTarget as MediaType)

  // アップロード済みプレビュー(blob URL)は選択が切り替わった/アンマウント時に解放する
  useEffect(() => {
    return () => {
      if (value.kind === "UPLOAD") {
        URL.revokeObjectURL(value.previewUrl)
      }
    }
  }, [value])

  const handleSearch = async () => {
    const q = searchQuery.trim()

    if (!q) {
      setSearchError("検索キーワードを入力してください")
      setResults(null)
      return
    }

    const requestId = ++requestIdRef.current
    setSearching(true)
    setSearchError(null)

    try {
      const res = await fetch(
        `/api/media-search?q=${encodeURIComponent(q)}&type=${effectiveSearchType}`
      )
      const data = await res.json()

      if (requestId !== requestIdRef.current) return

      if (!res.ok) {
        setSearchError(data.error ?? "検索に失敗しました")
        setResults(null)
        return
      }

      setResults(data.results)
    } catch {
      if (requestId !== requestIdRef.current) return
      setSearchError("通信エラーが発生しました。時間をおいて再度お試しください。")
      setResults(null)
    } finally {
      if (requestId === requestIdRef.current) setSearching(false)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (!searching) handleSearch()
    }
  }

  const handleSelectExternal = (result: MediaSearchResult) => {
    onChange({ kind: "EXTERNAL", url: result.imageUrl, source: "ANILIST" })
    onExternalSelectTitle?.(result.title)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""

    if (!file) return

    setUploadError(null)

    if (!isAllowedExtension(file.name) || !isAllowedMime(file.type)) {
      setUploadError("jpg, jpeg, png, webp のみアップロードできます")
      return
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError("ファイルサイズが上限(5MB)を超えています")
      return
    }

    const bytes = new Uint8Array(await file.arrayBuffer())

    if (!sniffImageType(bytes)) {
      setUploadError("画像ファイルとして認識できませんでした")
      return
    }

    const previewUrl = URL.createObjectURL(file)
    onChange({ kind: "UPLOAD", file, previewUrl })
  }

  const handleClear = () => {
    onChange({ kind: "NONE" })
  }

  const previewUrl =
    value.kind === "EXISTING" || value.kind === "EXTERNAL"
      ? value.url
      : value.kind === "UPLOAD"
        ? value.previewUrl
        : null

  const previewLabel =
    value.kind === "EXTERNAL"
      ? "外部API(AniList)から選択した画像です"
      : value.kind === "UPLOAD"
        ? "アップロード予定のローカル画像です(投稿時に保存されます)"
        : value.kind === "EXISTING"
          ? "現在保存されている画像です"
          : null

  return (
    <div className="mt-4">
      <label className="text-sm text-gray-800">作品画像(任意)</label>

      {/* 現在の選択プレビュー */}
      {previewUrl && (
        <div className="mt-2">
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="選択中の画像プレビュー"
              className="w-40 h-40 object-cover rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              aria-label="画像の選択を解除"
              className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-6 h-6 text-xs leading-none disabled:opacity-60"
            >
              ×
            </button>
          </div>
          {previewLabel && <p className="text-xs text-gray-500 mt-1">{previewLabel}</p>}
        </div>
      )}

      {/* 作品検索 */}
      <div className="mt-3 border rounded p-3">
        <p className="text-sm text-gray-800">作品検索</p>

        {reviewTarget === "BOTH" && (
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => setSearchType("MANGA")}
              className={
                effectiveSearchType === "MANGA"
                  ? "bg-orange-500 text-white px-3 py-1 rounded text-sm"
                  : "border px-3 py-1 rounded text-sm text-black"
              }
            >
              漫画
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => setSearchType("ANIME")}
              className={
                effectiveSearchType === "ANIME"
                  ? "bg-orange-500 text-white px-3 py-1 rounded text-sm"
                  : "border px-3 py-1 rounded text-sm text-black"
              }
            >
              アニメ
            </button>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            disabled={disabled}
            placeholder="作品名で検索"
            aria-label="作品名で検索"
            className="flex-1 border rounded px-3 py-2 text-black placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={disabled || searching}
            className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-60 whitespace-nowrap"
          >
            {searching ? "検索中..." : "検索"}
          </button>
        </div>

        {searchError && <p className="text-sm text-red-600 mt-2">{searchError}</p>}

        {results !== null && results.length === 0 && !searchError && (
          <p className="text-sm text-gray-500 mt-2">
            該当する作品が見つかりませんでした。別のキーワードを試すか、下記からローカル画像をアップロードしてください。
          </p>
        )}

        {results !== null && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {results.map((result) => (
              <button
                key={result.id}
                type="button"
                disabled={disabled}
                onClick={() => handleSelectExternal(result)}
                className="text-left border rounded p-2 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
              >
                <Image
                  src={result.imageUrl}
                  alt={result.title}
                  width={200}
                  height={280}
                  className="w-full h-32 object-cover rounded"
                />
                <p className="text-xs font-bold mt-1 text-gray-800 line-clamp-2">
                  {result.title}
                </p>
                <p className="text-xs text-gray-500">
                  {result.type === "MANGA" ? "漫画" : "アニメ"}
                  {result.year ? ` ・ ${result.year}` : ""}
                </p>
                {result.titleJapanese && (
                  <p className="text-xs text-gray-400 truncate">{result.titleJapanese}</p>
                )}
                {result.titleEnglish && (
                  <p className="text-xs text-gray-400 truncate">{result.titleEnglish}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ローカルアップロード */}
      <div className="mt-3 border rounded p-3">
        <label htmlFor="localImage" className="text-sm text-gray-800">
          ローカル画像をアップロード(jpg, jpeg, png, webp / 最大5MB)
        </label>
        <input
          id="localImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={disabled}
          className="block w-full text-sm text-black mt-1"
        />
        {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
        <p className="text-xs text-gray-500 mt-2">
          ご自身が使用する権利を持つ画像、または利用が許可されている画像を選択してください。第三者の著作権など権利を侵害する画像や、不適切な画像はアップロードしないでください。
        </p>
      </div>
    </div>
  )
}
