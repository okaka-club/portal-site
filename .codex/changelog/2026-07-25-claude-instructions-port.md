# 2026-07-25 Claude Code指示のCodexへの移植

## 何を

- リポジトリルートに `AGENTS.md` を追加した。
- `.claude/CLAUDE.md` のプロジェクト概要、コマンド、コーディング規約、ブランチ運用をCodex向けに移植した。
- Claude Codeのプロジェクト記憶にあった作業開始時の確認手順を移植した。
- 実装前のタスク分割、Issue作成、Issueブランチへの移動を必須ルールとして追加した。
- ハーネス設定とアプリケーション実装を同じIssueへ混在させないルールを追加した。
- `package.json` に合わせ、Astroの記載をv7へ修正した。

## なぜ

CodexはClaude Code固有の `.claude/` のプロジェクト記憶を自動で参照しない。  
そのため、CodexがIssueを作成せずに複数のAdSense対応を直接実装し始めた。

リポジトリ内のどのハーネスを使っても、同じIssue駆動の作業手順になるようにするため。

## 検証

- Codex公式マニュアルで、リポジトリルートの `AGENTS.md` がプロジェクト共通の永続指示として自動読込されることを確認する。
- `AGENTS.md` と `.claude/CLAUDE.md` のIssue駆動ルールを比較する。
- 公開URL、baseパス、Astroのバージョン、ブランチ名に矛盾がないことを確認する。
- Issue #56以外のアプリケーション差分が作業ブランチへ混在していないことを確認する。

## 戻し方

Issue #56に対応するコミットを `git revert` する。  
手動で戻す場合は、`AGENTS.md` と本ファイルを削除し、`.claude/CLAUDE.md` と `README.md` の変更を元に戻す。
