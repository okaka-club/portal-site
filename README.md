# おかかくらぶ ポータルサイト

おかかくらぶのミニゲーム・診断サービスへの入り口となるポータルサイト。

- 公開URL: https://okakaclub.com/

## 技術スタック

| 項目 | 選択 |
|---|---|
| フレームワーク | [Astro](https://astro.build/) v5（静的サイト生成） |
| スタイリング | [Tailwind CSS](https://tailwindcss.com/) v4 |
| フォント | Mamelon（woff2） |
| ホスティング | GitHub Pages |

## ローカル起動手順

```bash
npm install
npm run dev
# → http://localhost:4321/ で確認
```

## ビルド

```bash
npm run build
# → dist/ に出力される
```

## ディレクトリ構成

```
portal-site/
├── .github/workflows/
│   ├── deploy.yml              # mainへのpushで自動デプロイ
│   └── create-release-pr.yml  # develop→mainのリリースPR作成（手動実行）
├── public/
│   ├── logo.png
│   ├── fonts/                  # Mamelonフォント
│   └── thumbnails/             # 各サービスのサムネイル
├── src/
│   ├── data/
│   │   └── services.ts         # ★サービス追加はここだけ編集
│   ├── styles/
│   │   └── global.css          # グローバルCSS・フォント定義
│   ├── layouts/
│   │   └── BaseLayout.astro    # 全ページ共通レイアウト
│   ├── components/
│   │   ├── Header.astro        # ロゴ・キャッチコピー
│   │   └── ServiceCard.astro   # サービスカード
│   └── pages/
│       └── index.astro         # トップページ
└── astro.config.mjs
```

## サービスを追加するには

`src/data/services.ts` の `services` 配列にオブジェクトを1つ追加するだけ。

```typescript
{
  id: "new-service",          // 一意なID（URL用）
  name: "新しいサービス",
  description: "サービスの説明文",
  thumbnail: "/thumbnails/new-service.png",
  tags: ["タグ1", "タグ2"],
  url: "https://example.okaka-club.com/",
  isExternal: true,
}
```

サムネイル画像は `public/thumbnails/` に配置してください。

## デプロイ方法

### 自動デプロイ（通常の開発フロー）

1. `issues/チケット番号` ブランチで開発
2. `develop` へPRを出してマージ
3. リリース時は GitHub Actions の「リリースPR作成」を手動実行
4. 作成されたPRをレビューして `main` にマージ → 自動デプロイ

### リリースPR作成

GitHub リポジトリの Actions タブ →「リリースPR作成」→「Run workflow」

- `dry_run` にチェックを入れると、PR作成前に含まれる変更を確認できます
