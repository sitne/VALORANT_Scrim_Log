# Valorant Scrim Log

<div align="center">

**Valorantのカスタムゲーム（スクリム）試合データを自動保存するツール**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

</div>

## 特徴

- ✅ カスタムゲームの詳細データを自動取得
- ✅ プレイヤー統計（キル、デス、アシスト、スコア等）
- ✅ ラウンド別詳細（経済状況、武器購入、アビリティ使用等）
- ✅ JSON形式で保存
- ✅ リアルタイムでゲーム状態を監視

## 必要要件

- **OS**: Windows 10/11
- **Node.js**: v18.0.0 以上
- **Valorant**: インストール済み

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/sitne/VALORANT_Scrim_Log.git

# プロジェクトフォルダに移動
cd VALORANT_Scrim_Log

# 依存関係をインストール
npm install
```

## 使い方

### 方法1: npm start（推奨）

```bash
npm start
```

### 方法2: run.bat（Windows）

`run.bat`をダブルクリックで起動

### 実行手順

1. **Valorantを起動**
2. **アプリを起動**（上記いずれかの方法）
3. **カスタムゲームに参加**（プレイヤースロット推奨）
4. **ゲームをプレイして終了**
5. **データ確認**: `output/` フォルダに `{matchId}.json` が保存されます

## ⚠️ 重要な注意事項

### コーチスロットでの制限

**コーチスロットで実行している場合、試合終了後のマッチ詳細を取得できません。**

- Riot APIの仕様上、`/match-details/v1/matches/{matchId}` エンドポイントはプレイヤー参加者のみアクセス可能
- コーチは観戦者扱いのため、`NONSELF_OPERATION` (403) エラーが返されます

**推奨:** プレイヤースロットで実行してください

### カスタムゲーム設定

"Do not record match history" 設定のカスタムゲームでも動作しますが、一部APIでは取得できない可能性があります。

## 出力データ形式

`output/{matchId}.json` に以下の情報が含まれます：

```json
{
  "matchInfo": {
    "matchId": "...",
    "mapId": "...",
    "gameMode": "...",
    "gameLengthMillis": 12345
  },
  "players": ["..."],
  "teams": ["..."],
  "roundResults": ["..."]
}
```

詳細なデータ構造については、実際の出力ファイルを参照してください。

## トラブルシューティング

### `Failed to connect. Is Valorant running?`

- Valorantが起動していることを確認してください
- Valorantのローカルクライアントサービスが実行中であることを確認してください

### `Request failed with status code 403`

- **コーチスロットではなく、プレイヤースロットで実行してください**
- 試合に実際に参加していることを確認してください

### その他の問題

[Issues](https://github.com/sitne/VALORANT_Scrim_Log/issues)で報告してください。

## 技術スタック

- **言語**: TypeScript
- **ランタイム**: Node.js
- **主要ライブラリ**:
  - [`@tqman/valorant-api-client`](https://www.npmjs.com/package/@tqman/valorant-api-client) - Valorant API クライアント
  - [`rxjs`](https://rxjs.dev/) - リアクティブプログラミング
  - [`ora`](https://www.npmjs.com/package/ora) - ターミナルスピナー

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## ライセンス

[MIT](LICENSE)

## 免責事項

このツールは非公式のツールです。Riot Gamesによって承認されたものではありません。Valorantおよび関連する全ての商標はRiot Games, Inc.に帰属します。

## 関連リンク

- [Valorant API ドキュメント](https://valapidocs.techchrism.me/)
- [Riot Games Developer Portal](https://developer.riotgames.com/)

---

<div align="center">

**作成者: sitne**

もしこのプロジェクトが役立ったら、⭐️をつけてください！

</div>
