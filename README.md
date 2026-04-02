# AniManga

## ■ 概要

AniMangaは、ユーザーが「漫画・アニメ作品」をレビュー形式で投稿し、他ユーザーと共有できるサービスです。
従来のSNSとは異なり、作品単位での投稿に特化し、ユーザーがおすすめしたい作品を簡潔に発信・発見できる体験を提供します。

---

## ■ コンセプト

* 漫画・アニメに特化したレビューSNS
* 「作品 × 体験」を共有するプラットフォーム
* 投稿のハードルを下げつつ、質の高い情報共有を実現

---

## ■ 主な機能（MVP）

### 投稿機能

* 漫画・アニメ作品のレビュー投稿
* 一言コメント（必須）
* 評価（★1〜5）（必須）
* 詳細レビュー（任意）
* レビュー対象（漫画 / アニメ / 両方）

### タイムライン

* 投稿一覧表示（新着順）
* 人気順表示（いいね数ベース）

### ユーザーアクション

* いいね機能
* ブックマーク機能

### 外部リンク遷移

* 公式サイト
* Wikipedia
* 試し読みサイト
* 配信プラットフォーム

---

## ■ 技術スタック

### フロントエンド

* Next.js（App Router）
* TypeScript
* Tailwind CSS

### バックエンド

* Next.js API Routes（MVP）
  ※必要に応じてRails導入を検討

### その他

* ESLint

---

## ■ データ設計（MVP）

### Users

* id
* name
* email
* password_digest

### Posts

* id
* user_id
* work_id（外部APIの作品ID）
* title
* image_url
* comment
* review
* rating（1〜5）
* review_target（manga / anime / both）
* 各種外部リンク

### Likes

* user_id
* post_id

### Bookmarks

* user_id
* post_id

---

## ■ 設計方針

### 1. 作品データの扱い

作品情報は外部APIから取得し、投稿時点で必要な情報のみをDBに保存する。

### 2. シンプルなMVP設計

初期段階では機能を絞り、投稿機能の成立を最優先とする。

### 3. 拡張性を意識

将来的に以下の機能追加を想定：

* フォロー機能
* コメント機能
* レコメンド機能
* 作品マスタの導入

---

## ■ 今後の実装予定

* 投稿作成APIの実装
* 投稿一覧（タイムライン）の構築
* いいね / ブックマーク機能の実装
* 外部API連携（作品検索）

---

## ■ 開発方針

* 小さく作って改善する（MVP重視）
* フロントとバックの責務を明確にする
* 実務を意識した設計で実装する

---

## ■ セットアップ

```bash
git clone https://github.com/your-username/animanga.git
cd animanga
npm install
npm run dev
```

---

## ■ 今回の学習目的

* Next.js（App Router）の理解
* SSR / CSRの使い分け理解
* API設計・データ設計の習得
* フルスタック開発の基礎構築
