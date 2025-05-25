# 🏆 ClassMatchSystems

学校のクラス対抗スポーツ大会管理システム

## 🎯 機能

- **バスケットボール** - 男子・女子トーナメント管理
- **ソフトボール** - 7イニング制試合管理
- **卓球** - 5種目対戦形式
- **リアルタイム結果表示** - 試合結果の即座反映
- **順位管理** - 自動順位決定システム
- **統計情報** - 大会統計の表示

## 🚀 Vercelデプロイ手順

### 1. Vercelアカウント作成
1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでサインアップ

### 2. データベース設定
1. Vercelダッシュボードで「Storage」→「Create Database」
2. 「Postgres」を選択
3. データベース名を入力（例：`classmatch-db`）
4. リージョンを選択（Tokyo推奨）
5. 作成完了後、`DATABASE_URL`をコピー

### 3. プロジェクトデプロイ
1. GitHubにプロジェクトをプッシュ
2. Vercelで「New Project」をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定：
   - `DATABASE_URL`: コピーしたPostgreSQL URL
5. 「Deploy」をクリック

### 4. データベース初期化
デプロイ後、自動的にPrismaマイグレーションが実行されます。

## 🛠️ ローカル開発

### 必要な環境
- Node.js 18+
- npm または yarn

### セットアップ
```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

### データベース設定（ローカル）
```bash
# Prismaクライアント生成
npx prisma generate

# データベース初期化（SQLite）
npx prisma db push
```

## 📁 プロジェクト構造

```
app/
├── api/                 # APIエンドポイント
│   ├── basketball/      # バスケットボールAPI
│   ├── softball/        # ソフトボールAPI
│   └── tabletennis/     # 卓球API
├── edit/               # 編集ページ
├── results/            # 結果表示ページ
├── types/              # TypeScript型定義
└── components/         # 再利用可能コンポーネント
```

## 🎨 技術スタック

- **フレームワーク**: Next.js 15
- **言語**: TypeScript
- **データベース**: PostgreSQL (本番) / SQLite (開発)
- **ORM**: Prisma
- **スタイリング**: Tailwind CSS
- **デプロイ**: Vercel

## 📊 データベーススキーマ

### BasketballMatch
- 男子・女子別トーナメント管理
- 前半・後半・フリースロースコア
- 試合状態管理

### SoftballMatch
- 7イニング制試合
- じゃんけん決着対応
- 先行後攻管理

### TableTennisMatch
- 5種目対戦（男子シングルス、女子シングルス、男子ダブルス、女子ダブルス、ミックスダブルス）
- 11点3セットマッチ
- 種目別勝敗管理

## 🔧 環境変数

```env
DATABASE_URL="postgresql://..."
```

## 📝 ライセンス

MIT License 