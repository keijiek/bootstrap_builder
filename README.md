# Wordpress の自作テーマのための Bootstrap ビルダー

[Bootstrap and Vite](https://getbootstrap.jp/docs/5.3/getting-started/vite/)をベースに、package 追加、bootstrap カスタマイズ用ファイル追加、出力ファイル名の固定、などを行いました。

操作に bun.js を使います。  
インストールしていない場合は、末尾の「Bun.js のインストール」を見てインストールしてください。  
node を使う方はコマンドを読みかえて下さい。

## 使い方

### パッケージのインストール

このディレクトリ(このREADME.mdがあるディレクトリ)で次を実行し、パッケージをインストール。

```bash
bun i
```

### カスタマイズ

src/scss/_custom_variables.scss を編集し、次を実行。

```bash
bun run build
```

dist/ 下に js と css が出力されるので、それを enqueue する。

### カスタマイズの結果をお試し

下記を実行するとローカルのウェブサーバーが動くので、それをブラウザで開く。
src/index.html を編集しながら試すことができる。scss や js の変更も反映される。

```bash
bun run dev
```

### ビルドが終わったらパッケージを削除

ビルドが終わったら下記のようにパッケージを削除する。

```bash
rm -rf node_modules

# powershell の場合
Remove-Item -Recurse -Force node_modules
# 短縮
rm -r -fo node_modules

# cmd の場合
rmdir /s /q node_modules
```

以上。

---

## この環境を準備する手順(実行済み)

### install packages

```bash
bun i -D vite sass autoprefixer
bun i bootstrap @popperjs/core
```

### フォルダとファイルを作成

```bash
mkdir {src,src/js,src/scss}
touch src/index.html src/js/main.js src/scss/styles.scss vite.config.mjs
```

### main.js

```javascript
import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';
```

### vite.config.mjs

```javascript
import { defineConfig } from 'vite'
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    minify: true,
    manifest: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "src/js/main.js"),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  server: {
    port: 8080
  }
})
```

### styles.scss

```scss
@import "./custom_variables";
@import "bootstrap/scss/bootstrap";
```

### _custom_variables.scss

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";

/**
色テーマの追加。様々なコンポーネントに自動的に適用される。
*/
$custom-colors: (
  "test-main": #99fe99,
  "test-sub": #393,
  "test-txt": #630,
);
$theme-colors: map-merge($theme-colors, $custom-colors);

/**
余白のスケールを変更。様々な余白に適用される。bootstrap の余白は段階が足りないので。
*/
$spacer: 1rem;
$spacers: (
  0: 0,
  1: $spacer * .25,
  2: $spacer * .5,
  3: $spacer,
  4: $spacer * 1.5,
  5: $spacer * 3,
  6: $spacer * 4.5,
  7: $spacer * 6,
  8: $spacer * 7.5,
  9: $spacer * 9,
);

```

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap w/ Vite</title>
    <script type="module" src="./js/main.js"></script>
  </head>
  <body>
    <div class="container py-4 px-3 mx-auto">
      <h1>Hello, Bootstrap and Vite!</h1>
      <button class="btn btn-primary">Primary button</button>
    </div>
  </body>
</html>
```

### package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  // 略
}
```

---

## Bun か Node か

bun.js は新しく、処理が早い。バージョン管理は無し。  
node.js は古いが、そのぶん情報は多い。バージョン管理を使うのでインストールに手間を要するが volta を使えば簡単。  
コマンドを読み替えればどちらでも使える。

## install Bun.js

[Bun.js公式サイト](https://bun.sh/)の冒頭に、OSに応じたインストールコマンドが書いてあるので、それを使う。  

アップグレードは次のコマンド。

```bash
bun upgrade

# 確認
bun -v
```

以上。

---

## install Node.js

通常、Node.js は下記の手順でインストールする。  
特定バージョンの Node.js を単体でインストールすることはあまり無い。

1. バージョン管理ツール(今回は **volta** )をインストール
2. バージョン管理ツールで複数バージョンの **node** をインストール

### 1. install volta

[volta 公式>Getting Started](https://docs.volta.sh/guide/getting-started) を参照

#### unix 系は次のように

```bash
# 存在確認。無ければ次へ
which volta

# インストール。変わる可能性があるので https://docs.volta.sh/guide/getting-started を参照。
curl https://get.volta.sh | bash

# 確認。バージョンが出ないならシェル再起動
volta -v
```

#### windows は次のように

```pwsh
# 存在確認。無ければ次へ進む。
Get-Command volta

# パッケージマネージャでインストール
winget Volta.Volta

# 確認。ダメならシェルを再起動。
volta -v
```

### 2. install Node.js

```bash
volta install node

# 確認
node -v
npm -v
```

---
