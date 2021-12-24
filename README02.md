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



