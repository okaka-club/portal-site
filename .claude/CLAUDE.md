# おかかくらぶ ポータルサイト - Claude Code 指示書

## プロジェクト概要

複数のミニゲーム・診断サービスへの入り口となるポータルサイト。
Astro v5（静的サイト生成）+ Tailwind CSS v4 + GitHub Pages。

- 公開URL: https://okaka-club.github.io/portal-site/
- `base` パス: `/portal-site`

## よく使うコマンド

```bash
npm run dev    # 開発サーバー起動（http://localhost:4321/portal-site/）
npm run build  # 本番ビルド（dist/ に出力）
```

## コーディング規約

### Tailwind CSS v4
- `tailwind.config.mjs` は存在しない（v4はCSS設定方式）
- カスタム色・フォントは `src/styles/global.css` の `@theme {}` ブロックで定義
- クラス名はTailwindのユーティリティクラスを直接使用

### パスの書き方
- **すべての静的ファイルのパスに `/portal-site/` プレフィックスが必要**
  - 例: `/portal-site/logo.png`、`/portal-site/fonts/Mamelon-3-Hi-Regular.woff2`
  - Astroの `Astro.site` / `Astro.base` は使わず、直接ハードコードで問題ない

### Astroコンポーネント
- `src/layouts/BaseLayout.astro`: 全ページで使う共通レイアウト（`<html>` 〜 `</html>`）
- `src/components/`: 再利用コンポーネント
- `src/pages/`: ページファイル（ここに置くと自動でルーティング）

## サービス追加手順

`src/data/services.ts` の `services` 配列にオブジェクトを1つ追加するだけ。
サムネイル画像は `public/thumbnails/` に配置。

## ブランチ運用・コミット規約

### ブランチ
- `main`: 本番（pushで自動デプロイ）
- `develop`: 開発ベース
- `issues/チケット番号`: 作業ブランチ

### コミットメッセージ（Conventional Commits）
```
type: emoji 日本語の説明

body（必要なら）

Refs: #イシュー番号
```
- AI署名（Co-Authored-By）はつけない

## 関連プロジェクト

- one-night-jinroh: `/Users/kuniyuki/Project/one-night-jinroh/`
  - Mamelonフォントの取得元: `react/src/assets/fonts/`
- maru-batsu-shindan: `/Users/kuniyuki/Project/okaka-club/maru-batsu-shindan/`
  - GitHub Actions参考元
