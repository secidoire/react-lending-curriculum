# 公開 explainer のセキュリティ確認（2026-10-25）

## 範囲と配備の確認

- 対象は `secidoire/react-lending-curriculum`。React Observatory および他サービスは対象外。
- 調査開始時の main と配備版は `1ac3f19c0089cff080621ebd085c92ebf4d43cdb`。新規 clone は clean、既存の open PR は検索時点でなし。隔離ブランチ `security/explainer-review-20261025` で作業。
- [配備 run 37814778212](https://github.com/secidoire/react-lending-curriculum/actions/runs/37814778212) は成功。[deploy job](https://github.com/secidoire/react-lending-curriculum/actions/runs/37814778212/job/113440651660) の `Evaluated environment url` で [公開 URL](https://secidoire.github.io/react-lending-curriculum/) を確認。
- `.github/workflows/pages.yml` が配備するのは `explainer/dist` のみ。現 checkout に handson 実装はなく `docs/advanced-handson-spec.md` がある。handson のローカル教材案を公開 API の脆弱性として計上しない。
- `.agents/skills` / `AGENTS.md` は現 checkout になし。`CLAUDE.md` の教材方針・検証要件を確認。

## 発見と修正

| 対象 | 根拠・実際の影響 | 対応 |
| --- | --- | --- |
| 本番依存 Zod 4.6.5 | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) は `<4.6.6` が対象。過大な collection 検証のメモリ消費。現コードは object/string/date/custom を使用し、該当 collection schema・ネットワーク入力経路は確認せず。公開サイトが遠隔 DoS 可能とは判定しない。 | root の開発用宣言と explainer の本番用宣言・lockfile を 4.6.6 に更新。 |
| 開発依存 Vitest 5.0.3 系 | [GHSA-p458-7748-mcp3](https://github.com/advisories/GHSA-p458-7748-mcp3) は Browser Mode と `test.projects` のファイル拒否設定に関係する。本リポジトリの browser test 構成が該当。テストサーバー稼働中の開発機が対象で、静的配備物の脆弱性ではない。 | Vitest / browser-playwright と関連推移依存を 5.0.5 に統一。 |
| サンプル import の解決 | `specifier in LIBRARIES` が継承プロパティまでライブラリ扱いする。これは許可されたライブラリ名の判定不備であり、任意コード実行を新たに可能にする問題とは扱わない。 | `Object.hasOwn` に限定。`constructor` / `toString` / `__proto__` の拒否を回帰検証。 |
| コード入力の信頼境界 | `runSandbox.ts` の `new Function` は意図した教材機能。初期コードは repository の `?raw`、編集値は CodeMirror と React state から渡る。URL・API・保存データ・メッセージからコードを取り込む経路なし。貼り付けたコードはページと同じ権限で動く。 | 編集欄に自動実行・信頼できるコードのみ・秘密情報を入力しない旨を表示。教材の自動実行と意図的な悪い例は維持。 |
| 検証の不足 | 既存 workflow は main の Pages 配備のみで PR 検証なし。 | read-only の `pull_request` CI に型・lint・node/browser test・build・本番/全依存監査を追加。配備・権限変更を含まない。 |

## 依存以外の確認

- 認証・認可：静的教材で、アカウント、認証 cookie、サーバー、DB、公開アプリ API は見当たらない。教材の貸出データはブラウザー内の例。実在しない認証機能を評価項目に追加しない。
- 入力：第3回のフォーム境界は Zod の object/string/date と期間順序の検証。初期回や bad-examples の意図的な業務検証不足は学習目的として維持。これらを実システムの認可として流用しない。
- XSS / injection：`innerHTML` は固定テンプレート。通常フォーム入力は `textContent` または React children 経由。第0-2回の良い例・悪い例すべてで HTML を含む入力が文字列として表示されるブラウザー回帰テストを追加。miniReact は一般的な HTML sanitizer ではなく、現行サンプルではタグ・属性を外部入力から組み立てていない。
- URL：hash はページ ID と表示モードとして使用し、repository 内の MDX 一覧から解決する。動的 import や eval に hash を渡さない。外部資料リンクは固定値で `rel="noreferrer"` を使用。
- 秘密情報：tracked source の限定パターン検査で秘密鍵・代表的 token 形式は検出せず。環境の秘密情報の抽出や更新、過去履歴全体の保証は行わない。ビルドに環境変数を取り込む箇所は確認せず。
- セキュリティ設定：通常 GET で公開ページの HTTP 200、HTTPS、HSTS を確認。CSP は応答ヘッダー・HTML とも未設定。`new Function` を使うため単純に eval を禁じる CSP を足すと教材が停止する。ホスティング設定は変更しない。
- 検証中に既存 `Steps.tsx` と `steps.ts` が Windows の import 解決で衝突した。補助関数ファイルを `stepLogic.ts` に改名し、動作を変えずに検証可能にした。

## 検証と残余リスク

lockfile を使った `npm ci --ignore-scripts`、型検査、lint、node test（18ファイル / 73件）、Chromium browser test（19ファイル / 142件）、build が成功。本番 build の localhost preview で全8ページの読む・発表モード（16通り）を開き、ページ・sandbox の実行時エラーがないことを確認。本番および全依存の `npm audit` も成功。監査開始時は全依存5件（moderate 4 / high 1）、本番1件（high）。更新後は両方0件。advisory が存在しない未知の問題まで保証する結果ではない。

独立した内部エージェントがソース・入力経路・影響範囲と修正差分を読取り確認し、修正必須の指摘なし。レビュー担当によるテスト再実行は未実施。外部 AI サービスへの送信なし。最終 SHA の CI 結果は PR で確認する。

初回の Windows 検証では上記 import 名衝突と CRLF のため教材コードの文字列置換テスト4件が失敗。補助ファイルの改名と `.gitattributes` の LF 規約で修正し、全 browser test を再実行して成功。build の大きい bundle 警告は残るが、サイズ制限を緩めて隠す対応はしていない。

コード実行はセキュリティ隔離された sandbox ではない。本人が入力した JavaScript は同一 origin の DOM・ストレージへアクセス可能で、無限ループでタブを停止させることもできる。現在はコードの共有・永続化・外部取り込みがないため自己実行の残余リスクとして記録する。これらの入力経路を将来追加する前に、別 origin / opaque origin の実行領域と検証済みメッセージ境界を設計する必要がある。注意表示だけでこのリスクを解消したとは扱わない。

main push、マージ、本番配備、攻撃的スキャン、負荷試験、実データ変更、資格情報・クラウド権限・ホスティングのセキュリティ設定変更は行わない。既存 Pages workflow は main push / 手動実行のため、今回の PR・ブランチ push による自動本番反映経路はない。
