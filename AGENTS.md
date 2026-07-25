# おかかくらぶ ポータルサイト - Codex指示書

## プロジェクト概要

複数のミニゲーム・診断サービスへの入り口となるポータルサイト。  
Astro v7（静的サイト生成）+ Tailwind CSS v4 + GitHub Pages。

- リポジトリ: `okaka-club/portal-site`
- 公開URL: https://okakaclub.com/
- `base` パス: `/`
- 開発ベースブランチ: `develop`

## 作業開始とIssue駆動

調査・回答・レビューだけを求められた場合を除き、実装前に以下を行う。

1. Open IssueとOpen PRを確認する。
2. 現在のブランチと作業ツリーを確認する。
3. ユーザーの依頼を、独立して完了・検証できる単位に分ける。
4. 各タスクに対応するIssueがあるか確認する。
5. Issueがなければ、ファイルを変更する前にIssueを作成する。
6. 対応するIssue番号のブランチへ移動してから実装する。

確認に使うコマンド:

```bash
gh issue list
gh pr list
git branch --show-current
git status
```

### タスク分割の基準

- 1つのIssueには原則として1つの目的だけを含める。
- 別々にリリース、検証、差し戻しできる変更はIssueを分ける。
- アプリケーション実装、ドキュメント整備、ハーネス設定は混在させない。
- 複数Issueの変更を同じブランチやコミットへ混在させない。
- 既存の未コミット変更がある場合は、所有者と対象Issueを確認する。無断で破棄しない。

### Issueを作成しない作業

- 読み取りのみの調査
- 状況確認や説明
- コードレビュー
- ユーザーが明示的にIssue化を不要とした作業

調査から実装へ移る場合は、実装前にIssueを作成する。

## よく使うコマンド

```bash
npm run dev    # 開発サーバー起動（http://localhost:4321/）
npm run build  # 本番ビルド（dist/ に出力）
```

## コーディング規約

### Tailwind CSS v4

- `tailwind.config.mjs` は存在しない。CSS設定方式を使う。
- カスタム色とフォントは `src/styles/global.css` の `@theme {}` で定義する。
- クラス名はTailwindのユーティリティクラスを直接使用する。

### パスの書き方

- 静的ファイルはルート相対パスで書く。
- 例: `/logo.png`、`/fonts/Mamelon-3-Hi-Regular.woff2`
- `/portal-site/` プレフィックスは付けない。

### Astroコンポーネント

- `src/layouts/BaseLayout.astro`: 全ページ共通レイアウト
- `src/components/`: 再利用コンポーネント
- `src/pages/`: ファイルベースルーティングのページ
- シンプルで読みやすい実装を優先する。
- 必要になる前の抽象化や、過度な拡張性を持たせない。

## サービス追加手順

1. `src/data/services.ts` の `services` 配列にサービスを追加する。
2. サムネイルを `public/thumbnails/` に配置する。
3. 紹介ページが必要な場合は `src/pages/games/` に追加する。
4. 外部URLと紹介ページの両方が正しく開くことを確認する。

## ブランチ運用・コミット規約

### ブランチ

- `main`: 本番。pushで自動デプロイする。
- `develop`: 開発ベース。
- `issues/チケット番号`: Issueごとの作業ブランチ。

`main` や `develop` へ直接実装しない。

### コミットメッセージ

Conventional Commitsを使用する。

```text
type: emoji 日本語の説明

body（必要なら）

Refs: #イシュー番号
```

- AI署名（`Co-Authored-By`）は付けない。
- コミット前に、対象Issue以外の差分が混ざっていないことを確認する。

## 検証

- コードを変更したら、原則として `npm run build` を実行する。
- UI変更はモバイル幅とデスクトップ幅を確認する。
- 外部リンク変更は公開URLの応答も確認する。
- 実行できなかった検証がある場合は、理由を報告する。

## ハーネス変更履歴

`AGENTS.md` や `.codex/` 配下を変更するときは、先に `.codex/changelog/` を読む。  
変更後は同ディレクトリへ日付ファイルを追加し、以下を記録する。

- 何を変更したか
- なぜ変更したか
- どう検証したか
- どう戻すか

`.claude/` 配下も変更する場合は、`.claude/changelog/` にも同じ形式で記録する。

## 関連プロジェクト

- `one-night-jinroh`: `/Users/kuniyuki/Project/one-night-jinroh/`
- `maru-batsu-shindan`: `/Users/kuniyuki/Project/okaka-club/maru-batsu-shindan/`
