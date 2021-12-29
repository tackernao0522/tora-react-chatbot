## 10 Cloud FunctionsでAPIを作ってFirestoreを利用する

#### REST APIを作る

1. dataset.jsをjsonファイルに変える<br>

2. Cloud Functionsでhttps関数の作成<br>

3. デプロイ<br>

4. curlコマンドでAPIを叩く<br>

+ `src/dataset.js`を`src/dataset.json`に変更<br>

+ `src/dataset.json`を編集<br>

```
{
  "init": {
    "answers": [
      { "content": "仕事を依頼したい", "nextId": "job_offer" },
      {
        "content": "エンジニアのキャリアについて相談したい",
        "nextId": "consultant"
      },
      { "content": "学習コミュニティについて知りたい", "nextId": "community" },
      { "content": "お付き合いしたい", "nextId": "dating" }
    ],
    "question": "こんにちは！🐯トラハックへのご用件はなんでしょうか？"
  },
  "job_offer": {
    "answers": [
      { "content": "Webサイトを制作してほしい", "nextId": "website" },
      { "content": "Webアプリを開発してほしい", "nextId": "webapp" },
      { "content": "自動化ツールを作ってほしい", "nextId": "automation_tool" },
      { "content": "その他", "nextId": "other_jobs" }
    ],
    "question": "どのようなお仕事でしょうか？"
  },
  "website": {
    "answers": [
      { "content": "問い合わせる", "nextId": "contact" },
      { "content": "最初の質問に戻る", "nextId": "init" }
    ],
    "question": "Webサイト細作についてですね。コチラからお問い合わせできます。"
  },
  "webapp": {
    "answers": [
      { "content": "問い合わせる", "nextId": "contact" },
      { "content": "最初の質問に戻る", "nextId": "init" }
    ],
    "question": "Webアプリ開発についてですね。コチラからお問い合わせできます。"
  },
  "automation_tool": {
    "answers": [
      { "content": "問い合わせる", "nextId": "contact" },
      { "content": "最初の質問に戻る", "nextId": "init" }
    ],
    "question": "自動化ツール開発についてですね。コチラからお問い合わせできます。"
  },
  "other_jobs": {
    "answers": [
      { "content": "問い合わせる", "nextId": "contact" },
      { "content": "最初の質問に戻る", "nextId": "init" }
    ],
    "question": "その他についてですね。コチラからお問い合わせできます。"
  },
  "consultant": {
    "answers": [
      {
        "content": "YouTubeで動画を見る",
        "nextId": "https://www.youtube.com/channel/UC-bOAxx-YOsviSmqh8COR0w"
      },
      { "content": "学習コミュニティについて知りたい", "nextId": "community" },
      { "content": "最初の質問に戻る", "nextId": "init" }
    ],
    "question": "トラハックは普段からYouTubeでキャリアについて発信しています。また、僕が運営するエンジニア向け学習コミュニティ内でも相談に乗っていますよ。"
  },
  "community": {
    "answers": [
      { "content": "どんな活動をしているの？", "nextId": "community_activity" },
      {
        "content": "コミュニティに参加したい",
        "nextId": "https://torahack.web.app/community/"
      },
      { "content": "最初の質問に戻る", "nextId": "init" }
    ],
    "question": "2020年3月から学習コミュニティを始めました！🎉Webエンジニアへの転職を目指す人向けに、プログラミングを教えたりキャリアの相談に乗っています。"
  },
  "community_activity": {
    "answers": [
      {
        "content": "さらに詳細を知りたい",
        "nextId": "https://youtu.be/tIzE7hUDbBM"
      },
      {
        "content": "コミュニティに参加したい",
        "nextId": "https://torahack.web.app/community/"
      },
      { "content": "最初の質問に戻る", "nextId": "init" }
    ],
    "question": "フロントエンド向けの教材の提供、キャリアや勉強法に関するメルマガの配信、週1のオンライン作業会などを開催しています！\n詳細はYouTube動画で紹介しています。"
  },
  "dating": {
    "answers": [
      { "content": "DMする", "nextId": "https://twitter.com/torahack_" },
      { "content": "最初の質問に戻る", "nextId": "init" }
    ],
    "question": "まずは一緒にランチでもいかがですか？DMしてください😘"
  }
}
```

#### Cloud Functionsでhttps関数の作成

+ `例`<br>

`import`<br>
```
import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();
```

`https.onRequestメソッドで関数作成`<br>
```
export const addDataset = functions.https.onRequest(async (req: any, res: any) => {
  // 処理を書く
})
```

+ `functions/src/index.ts`を編集<br>

```
import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

const sendResponse = (response: functions.Response, statusCode: number, body: any) => {
  response.send({
    statusCode,
    body: JSON.stringify(body)
  });
};

/**
 * Execute the following command in your Terminal app
 * curl -X POST https://YOUR_REGION-YOUR_PROJECT_NAME.cloudfunctions.net/addDataset -H "Content-Type:application/json" -d @dataset.json
*/

export const addDataset = functions.https.onRequest(async (req: any, res: any) => {
  if (req.method !== 'POST') {
    sendResponse(res, 405, { error: "Invalid Request" })
  } else {
    const dataset = req.body;
    for (const key of Object.keys(dataset)) {
      const data = dataset[key];
      await db.collection('questions').doc(key).set(data)
    }
    sendResponse(res, 200, { message: 'Successfully added dataset! WooHoo!' });
  }
});
```

+ デプロイをする `$ firebase deploy`<br>

+ `firebase.json`を編集<br>

```
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint", // 削除
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  },
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### curlでAPIを叩く

`例`<br>
```
curl -X POST -H "Content-Type: application/json" -d @dataset.json https://YOUR_REGION-YOUR_PROJECT_NAME.cloudfunctions.net/addDataset
```

+ `-x -> POSTメソッドを指定`<br>
+ `-H -> データ形式にJSONを指定`<br>
+ `-d -> 渡すデータを指定`<br>
+ `Cloud FunctionsのURLを指定`<br>

+ `src/ディレクトリに移動する`<br>

+ `$ curl -X POST https://us-central1-chatbot-demo-5be9a.cloudfunctions.net/addDataset -H "Content-Type:application/json" -d @dataset.json`を実行<br>

#### Firestoreを使う準備

1. Firestore Consoleからプロジェクトの設定値を取得<br>

2. config.jsに設定値を貼り付けてexport<br>

3. index.jsでさらにexport<br>

4. Firestoreを使うコンポーネントでimport<br>

5. componentDidMount()でデータセット<br>

+ `src/firebase`ディレクトリを作成<br>

+ `src/firebase/config.js`ファイルを作成<br>

+ firebaseコンソールの歯車マークの`プロジェクトの設定`をクリック<br>

+ SDKの設定と構成の`構成`を選択して生成されたオブジェクトをコピーして`src/firebase/config.js`にペーストする<br>

+ `src/firebase/config.js`を編集<br>

```
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_c0ZihamfdM62oxiD3s1Ex3O8Jt77oCU",
  authDomain: "chatbot-demo-5be9a.firebaseapp.com",
  projectId: "chatbot-demo-5be9a",
  storageBucket: "chatbot-demo-5be9a.appspot.com",
  messagingSenderId: "238509415288",
  appId: "1:238509415288:web:1730cccb49d153ee31c68d",
  measurementId: "G-FPNE8WL93F"
};

export default firebaseConfig
```

+ `src/firebase/index.js`ファイルを作成<br>

```
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from "./config";

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
```

### ライフサイクル内で非同期処理を制御

#### async付きの即時関数を使う!

`例`<br>
```
componentDidMount() {
  (async() => {
    // 非同期処理
    await db.collection('questions').get().then(snapshots => {
      snapshots.forEach(doc => {
        dataset[doc.id] = doc.data()
      })
    });
  })();
}
```

+ `src/App.jsx`を編集<br>

```
import React, { Component } from 'react'
import './assets/styles/style.css'
import { AnswersList, Chats } from './components/index'
import { FormDialog } from './components/Forms/FormDialog'
import { db } from './firebase'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      answers: [],
      chats: [],
      currentId: 'init',
      dataset: {},
      open: false,
    }
    this.selectAnswer = this.selectAnswer.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  displayNextQuestion = (nextQuestionId) => {
    const chats = this.state.chats
    chats.push({
      text: this.state.dataset[nextQuestionId].question,
      type: 'question',
    })

    this.setState({
      answers: this.state.dataset[nextQuestionId].answers,
      chats: chats,
      currentId: nextQuestionId,
    })
  }

  selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch (true) {
      case nextQuestionId === 'init':
        setTimeout(() => this.displayNextQuestion(nextQuestionId), 500)
        break
      case nextQuestionId === 'contact':
        this.handleClickOpen()
        break
      case /^https:*/.test(nextQuestionId):
        const a = document.createElement('a')
        a.href = nextQuestionId
        a.target = '_blank'
        a.click()
        break
      default:
        const chats = this.state.chats
        chats.push({
          text: selectedAnswer,
          type: 'answer',
        })

        this.setState({
          chats: chats,
        })
        setTimeout(() => this.displayNextQuestion(nextQuestionId), 1000)
        break
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  initDataset = (dataset) => {
    this.setState({ dataset: dataset })
  }

  componentDidMount() {
    (async () => {
      const dataset = this.state.dataset

      await db
        .collection('questions')
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            dataset[id] = data
          })
        })
      this.initDataset(dataset)
      const initAnswer = ''
      this.selectAnswer(initAnswer, this.state.currentId)
    })()
  }

  componentDidUpdate(preveProps, prevState, snapShot) {
    const scrollArea = document.getElementById('scroll-area')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList
            answers={this.state.answers}
            select={this.selectAnswer}
          />
          <FormDialog open={this.state.open} handleClose={this.handleClose} />
        </div>
      </section>
    )
  }
}
```
