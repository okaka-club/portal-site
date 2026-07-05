# 2026-07-04 独自ドメイン移行に伴うドキュメント修正

## 何を

- `.claude/CLAUDE.md`: 公開URL・baseパス・開発サーバーURL・パス規約を独自ドメイン（okakaclub.com、base `/`）に合わせて修正。ハーネス変更履歴（このディレクトリ）への導線を追加
- `README.md`: 公開URL（5行目付近）、開発サーバーURL、サービス追加例のサムネイルパスを修正

## なぜ

`astro.config.mjs` は独自ドメインに移行済み（site: https://okakaclub.com、base: "/"）なのに、ドキュメントが旧GitHub Pages時代（github.io/portal-site、`/portal-site/` プレフィックス必須）のままだった。古い指示を信じてサービス追加するとリンク切れを作るため。

ソースコード（src/ 配下）はすべて新パスに統一済みであることを `grep -rn "portal-site" src/` で確認した（該当0件）。

## 検証

- 修正後に `grep` で旧URL・旧プレフィックスの残存がないことを確認（README のディレクトリ構成図にある `portal-site/` はリポジトリ名なので対象外）
- ドキュメントのみの変更で、ビルド成果物には影響しない

## 戻し方

このリポジトリはgit管理なので、該当コミット（Refs: #29）を `git revert` すれば戻る。バックアップファイルは不要。
