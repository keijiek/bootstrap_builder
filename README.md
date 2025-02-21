# Wordpress の自作テーマのための Bootstrap ビルダー

[Bootstrap and Vite](https://getbootstrap.jp/docs/5.3/getting-started/vite/)をベースに、package 追加、bootstrap カスタマイズ用ファイル追加、出力ファイル名の固定、などを行いました。

操作に bun.js か node.js を使います。  
インストールしていない場合は、末尾の 「[BunかNodeか](#bun-か-node-か)」のセクションを見てインストールしてください。  

また、下記の操作は、wsl の ubuntu の bash で試しました。  
一応、powershell や cmd の方法も気づいた範囲で載せていますが、  
windows なら wsl の ubuntu を簡単に導入できるので、ぜひそれを使ってください。  
そちらの方が、むしろ学習用の情報は多いはずです。

[WSL を使用して Windows に Linux をインストールする方法](https://learn.microsoft.com/ja-jp/windows/wsl/install)

wordpress 以外にも使えると思いますが  
それ以外の状況で bootstrap を使う理由は無いようにも思います。  

---

## 使い方

### WordPress の自作テーマディレクトリ内の好きな所に配置

```bash
# 自作テーマディレクトリ内の、インストールしたい場所に移動。
cd /path/to/wordpress/wp-content/themes/your-theme/assets/

# git pull でインストール
git clone git@github.com:keijiek/bootstrap_builder.git

# インストールされたディレクトリに移動
cd bootstrap_builder

# 必要なパッケージをインストール
bun i

# bun ではなく node を使うなら
npm i
```

もしも git が無いなら「[git インストール](#git-インストール)」を見てインストールしてください。

### カスタマイズとビルド

src/scss/_custom_variables.scss を編集し、次を実行してビルド

```bash
# bun
bun run build

# node
npm run build
```

dist/ の下に js と css が出力されるので、それぞれを wordpress から enqueue する。

```php
wp_enqueue_style(
  'bootstrap',
  get_template_directory_uri() . '/assets/bootstrap_builder/dist/index.css',
  [],
  filemtime(get_theme_file_path('assets/bootstrap_builder/dist/index.css'));
);

wp_enqueue_script(
  'bootstrap',
  get_template_directory_uri() . '/assets/bootstrap_builder/dist/index.js',
  [],// 'jquery' を依存対象に入れた方が良いかも。正常に動かない場合は試してください。
  filemtime(get_theme_file_path('assets/bootstrap_builder/dist/index.js'));
  []
);
```

### カスタマイズの結果をお試し

下記を実行するとローカルのウェブサーバーが動くので、それをブラウザで開く。
src/index.html を編集しながら表示を試すことができる。scss や js の変更も反映される。  
ビルドとテストの繰り返しは時間を食うので、この手順で試すのが良い。

```bash
# bun
bun run dev

# node
npm run dev

# ctrl + c で終了
```

### ビルドが終わったらパッケージを削除

ビルドが終わったら下記のようにパッケージを削除する。

```bash
rm -rf node_modules

# powershell の場合
Remove-Item -Recurse -Force node_modules

# 上記の短縮形
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
touch src/index.html src/js/main.js src/scss/styles.scss src/scss/_cistom_variables.scss vite.config.mjs
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

bun.js は新しく、処理が早い。  
node.js は古いうえに長らくデファクトスタンダードだったので、学習用の情報が多い。バージョン管理ツールを使ったインストール方法がややこしいものの、 volta を使えばコンフィグ無しですぐインストールできる。  
コマンドを読み替えればどちらでも使える。情報の多い node で学習し、慣れたら bun へ移行する、という学種順序が良いのかも。

## Bun.js インストール

[Bun.js公式サイト](https://bun.sh/)の冒頭に、OSに応じたインストールコマンドが書いてあるので、それを使う。  

アップグレードは次のコマンド。

```bash
bun upgrade

# 確認
bun -v
```

以上。

---

## Node.js インストール

通常、Node.js は下記の手順でインストールする。  
特定バージョンの Node.js を単体でインストールすることはあまり無い。

1. バージョン管理ツール(今回は **volta** )をインストール
2. バージョン管理ツールで任意のバージョンの **node** をインストール

### 1. volta インストール

[volta 公式>Getting Started](https://docs.volta.sh/guide/getting-started) を参照

#### unix 系は次のように

```bash
# 存在確認。あれば node インストールへ進む
which volta

# インストール。変わる可能性があるので https://docs.volta.sh/guide/getting-started を参照。
curl https://get.volta.sh | bash

# curl が command not found な人は、ubuntuの場合は次のようにインストール。そのうえで上記を再実行。
sudo apt update
sudo apt install -y curl

# 確認。バージョンが出ないならシェル再起動して再確認
volta -v
```

#### windows は次のように

```pwsh
# 存在確認(powershell)。あれば node インストールへ進む
Get-Command volta

# cmd の場合
where volta

# パッケージマネージャ winget でインストール
winget Volta.Volta

# 確認。ダメならシェルを再起動して再確認
volta -v
```

### 2. Node.js インストール

```bash
volta install node

# メジャーバージョン(例はv22系)を指定したインストール
volta install node@22

# 確認
node -v
npm -v
```

たまに `volta install node`を打てば、いつでも最新版を得られる。

以上。

---

## git インストール

もしも git が無いなら、下記の様にインストール

### ubuntu

```bash
# パッケージの確認
sudo apt list git

# インストール
sudo apt install -y git
```

### windows

```bash
# パッケージの確認(git.git を探す)
winget search git

# インストール
winget install Git.Git
```
