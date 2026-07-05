# おかかくらぶ ポータルサイト - Claude Code 指示書

## プロジェクト概要

複数のミニゲーム・診断サービスへの入り口となるポータルサイト。
Astro v5（静的サイト生成）+ Tailwind CSS v4 + GitHub Pages。

- 公開URL: https://okakaclub.com/
- `base` パス: `/`（独自ドメイン運用。旧 github.io/portal-site から移行済み）

## よく使うコマンド

```bash
npm run dev    # 開発サーバー起動（http://localhost:4321/）
npm run build  # 本番ビルド（dist/ に出力）
```

## コーディング規約

### Tailwind CSS v4
- `tailwind.config.mjs` は存在しない（v4はCSS設定方式）
- カスタム色・フォントは `src/styles/global.css` の `@theme {}` ブロックで定義
- クラス名はTailwindのユーティリティクラスを直接使用

### パスの書き方
- 静的ファイルはルート相対パスで書く
  - 例: `/logo.png`、`/fonts/Mamelon-3-Hi-Regular.woff2`
  - 旧GitHub Pages時代の `/portal-site/` プレフィックスは不要（付けるとリンク切れになる）

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

## ハーネス変更履歴

この指示書や `.claude/` 配下を変更するとき、またはClaude Codeの挙動が不自然なときは、まず `.claude/changelog/` の記録を読むこと。変更したら同ディレクトリに日付ファイルで「何を・なぜ・戻し方」を残す。

## 関連プロジェクト

- one-night-jinroh: `/Users/kuniyuki/Project/one-night-jinroh/`
  - Mamelonフォントの取得元: `react/src/assets/fonts/`
- maru-batsu-shindan: `/Users/kuniyuki/Project/okaka-club/maru-batsu-shindan/`
  - GitHub Actions参考元
