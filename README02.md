## 02 環境構築

+ `$ npx create-react-app YOUR_PROJECT_NAME`<br>

+ Material-UI `$ npm install --save @material-ui/core @material-ui/icons @material-ui/system`を実行<br>

+ `public/index.html`を編集<br>

```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="Web site created using create-react-app" />
  <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <title>React App</title>
</head>

<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>

</html>
```

## 03 Firebaseプロジェクトの作成と初回デプロイ

### デプロイまでの流れ

1. プロジェクトの作成<br>

2. リソースロケーションの設定<br>

3. Firebaseのモード変更<br>

4. パッケージのインストール `$ npm install -g firebase-tools`<br>

5. パッケージのインストール `$ npm install --save firebase`<br>

6. firebase login `$ firebase login`<br>

7. firebase init `$ firebase init`<br>

8. `firestore.rules`を編集<br>

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read;
      allow write: if request.auth.uid != null;
    }
  }
}
```

9. `$ npm run build`

10. `functions/src/index.ts`を編集<br>

```
// import * as functions from "firebase-functions"; // コメントアウトしておく

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
```

11. firebase deploy `$ firebase deploy`<br>

## 04 stateの設計とクラスコンポーネントの作成

#### データモデル設計の始め方

`Model`->`View`->`Controller`->`User`<br>

+ データモデルはViewから設計する<br>

+ なのでまずはViewを書いてみる (いわゆるワイヤーフレーム)<br>

+ ワイヤーフレームは手書きでもOK<br>

#### ルートで管理するstate

```
constructor(props) {
  super(props);
  this.state = {
    answers: [],       // 回答コンポーネントに表示するデータ
    chats: [],         // チャットコンポーネントに表示するデータ
    currentId: "init", // 現在の質問ID
    dataset: {},       // 質問と回答のデータセット
    open: false        // 問い合わせフォーム用モーダルの開閉を管理
  };
}
```

#### データモデルの設計

+ `chats:[{key: value}, {key: value}...]`<br>

+ `currentId: string`<br>

+ `snswers: [{key: value}, {key: value}...]`<br>

```
chat: {
  text: string, // チャット本文
  type: string  // 質問か回答か
}

answer: {
  content: string, // 回答内容
  nextId: string   // 次の質問
}
```

+ `open: boolean`<br>

```
const defaultDataset = {
  "init": {
    answers: [
      {contenst: "仕事を依頼したい", nextId: "job_offer"},
      {content: "エンジニアのキャリアについて相談したい", nextId: "consultant"},
      {content: "学習コミュニティについて知りたい", nextId: "community"},
      {content: "お付き合いしたい", nextId: "dating"},
    ],
    question: "こんにちは! 🐯トラハックへのご用件はなんでしょうか？",
  },
}
:
:
:
```

+ `src/dataset.js`ファイルを作成<br>

```
const defaultDataset = {
  "init": {
    answers: [
      { content: "仕事を依頼したい", nextId: "job_offer" },
      { content: "エンジニアのキャリアについて相談したい", nextId: "consultant" },
      { content: "学習コミュニティについて知りたい", nextId: "community" },
      { content: "お付き合いしたい", nextId: "dating" },
    ],
    question: "こんにちは！🐯トラハックへのご用件はなんでしょうか？",
  },
  "job_offer": {
    answers: [
      { content: "Webサイトを制作してほしい", nextId: "website" },
      { content: "Webアプリを開発してほしい", nextId: "webapp" },
      { content: "自動化ツールを作ってほしい", nextId: "automation_tool" },
      { content: "その他", nextId: "other_jobs" }
    ],
    question: "どのようなお仕事でしょうか？",
  },
  "website": {
    answers: [
      { content: "問い合わせる", nextId: "contact" },
      { content: "最初の質問に戻る", nextId: "init" }
    ],
    question: "Webサイト細作についてですね。コチラからお問い合わせできます。",
  },
  "webapp": {
    answers: [
      { content: "問い合わせる", nextId: "contact" },
      { content: "最初の質問に戻る", nextId: "init" }
    ],
    question: "Webアプリ開発についてですね。コチラからお問い合わせできます。",
  },
  "automation_tool": {
    answers: [
      { content: "問い合わせる", nextId: "contact" },
      { content: "最初の質問に戻る", nextId: "init" }
    ],
    question: "自動化ツール開発についてですね。コチラからお問い合わせできます。",
  },
  "other_jobs": {
    answers: [
      { content: "問い合わせる", nextId: "contact" },
      { content: "最初の質問に戻る", nextId: "init" }
    ],
    question: "その他についてですね。コチラからお問い合わせできます。",
  },
  "consultant": {
    answers: [
      { content: "YouTubeで動画を見る", nextId: "https://www.youtube.com/channel/UC-bOAxx-YOsviSmqh8COR0w" },
      { content: "学習コミュニティについて知りたい", nextId: "community" },
      { content: "最初の質問に戻る", nextId: "init" }
    ],
    question: "トラハックは普段からYouTubeでキャリアについて発信しています。また、僕が運営するエンジニア向け学習コミュニティ内でも相談に乗っていますよ。",
  },
  "community": {
    answers: [
      { content: "どんな活動をしているの？", nextId: "community_activity" },
      { content: "コミュニティに参加したい", nextId: "https://torahack.web.app/community/" },
      { content: "最初の質問に戻る", nextId: "init" }
    ],
    question: "2020年3月から学習コミュニティを始めました！🎉Webエンジニアへの転職を目指す人向けに、プログラミングを教えたりキャリアの相談に乗っています。",
  },
  "community_activity": {
    answers: [
      { content: "さらに詳細を知りたい", nextId: "https://youtu.be/tIzE7hUDbBM" },
      { content: "コミュニティに参加したい", nextId: "https://torahack.web.app/community/" },
      { content: "最初の質問に戻る", nextId: "init" }
    ],
    question: "フロントエンド向けの教材の提供、キャリアや勉強法に関するメルマガの配信、週1のオンライン作業会などを開催しています！\n詳細はYouTube動画で紹介しています。",
  },
  "dating": {
    answers: [
      { content: "DMする", nextId: "https://twitter.com/torahack_" },
      { content: "最初の質問に戻る", nextId: "init" }
    ],
    question: "まずは一緒にランチでもいかがですか？DMしてください😘",
  },
}

export default defaultDataset
```

+ `src/assets`ディレクトリを作成<br>

+ `src/assets/styles`ディレクトリを作成<br>

+ `src/assets/styles/style.css`ファイルを作成<br>

```
.c-section {
  position: relative;
  height: 100vh;
  width: 100%;
}

.c-box {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  box-sizing: border-box;
  height: 592px;
  max-width: 432px;
  padding: 0 1rem;
  width: 100%;

  /* Vertical and horizontal center alignment */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.c-grid__answer {
  display: flex;
  flex-flow: column;
  justify-content: flex-end;
  height: 192px;
}

.p-chat__bubble {
  background: #41b6e6;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  padding: 0.5rem;
  margin-right: 1rem;
  max-width: 80%;
  width: auto;
}

.p-chat__row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-right: 0 !important;
}

.p-chat__reverse {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  padding-right: 0 !important;
}

.p-question__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.p-question__description {
  font-size: 1rem;
  letter-spacing: 0.125rem;
  line-height: 1.7;
}
```

+ `App.css`を削除<br>

+ `src/index.css`ファイルを`src/assets/styles`ディレクトリに移動する<br>

+ `src/assets/styles/index.css`を編集<br>

```
body {
  margin: 0;
  font-family: '游ゴシック体', YuGothic, '游ゴシック', 'Yu Gothic', 'メイリオ',
    'Hiragino Kaku Gothic ProN', 'Hiragino Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

+ `src/index.js`ファイルを編集<br>

```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/styles/index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

+ `App.js`ファイルを`App.jsx`に変更<br>

+ `src/App.jsx`を編集<br>

```
import React, { Component } from 'react'
import defaultDataset from './dataset'
import './assets/styles/style.css'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      answers: [],
      chats: [],
      currentId: 'init',
      dataset: defaultDataset,
      open: false,
    }
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">{this.state.currentId}</div>
      </section>
    )
  }
}
```
