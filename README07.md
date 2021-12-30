## 11 React Hooks (関数コンポーネントに書き換える) useCallbackでパフォーマンスを向上させる

#### useState()の使い方

1. useState関数をインポート<br>

```
import React, {useState} from 'react';
```

2. 宣言する<br>

```
const [isPublished, togglePublished] = useState(false);
// isPublisheの部分はstate変数名 togglePublishedの部分はstate変更関数名 falseの部分はstate初期値
```

3. JSX内で使う<br>

```
<input /** 中略 */ onClick={() => togglePublished(!isPublished)} />
```

#### useEffectの使い方①

+ `基本の形`<br>

+ `useEffect()内にCallback関数を書く`<br>

+ `Callbackはレンダー毎に呼ばれる`<br>

+ `returnするCallback関数はアンマウント時に呼ばれる(クリーンアップ関数)`<br>

```
useEffect(() => {
  console.log('Render!)
  return () => {
    console.log('Unmounting!')
  }
})
```

#### useEffectの使い方②

+ 第二引数の配列内の値を`前回レンダーと今回レンダーで比較`->変更があればCallback関数を実行<br>

+ 第二引数に空の配列を渡すを最初の1回（マウント時）のみ実行される<br>

```
useEffect(() => {
  console.log('Render!')
}, [])
```

#### useCallback()を使うメリット

`通常時`<br>
  コンポーネント内で宣言したコールバック関数はrender毎に生成されるx

`useCallback()を使うと...`<br>
  コールバック関数の再生成を抑止=普変値化◯<br>
  クラスコンポーネントのbind()と似た役割<br>

#### useCallback()の使い方

`文法`<br>
```
useCallback(() => {}, [hoge]);
// () => {}の部分はコールバック関数 [hoge]の部分は deps(再描画の条件)
```

`子コンポーネントにpropsで関数を渡す場合に使う`<br>
```
const handleClose = useCallback(() => {
  setOpen(false)
}, [setOpen]);
// 中略
<FormDialog
  open={open}
  handleClose={handleClose}
>
```

#### クラスコンポーネントとの比較

`関数コンポーネントでuseCallback()を使う`<br>
```
// 問い合わせフォーム用モーダルを閉じるCallback関数
const handleClose = useCallback(() => {
  setOpen(false)
}, [setOpen])
```

`クラスコンポーネント`<br>
```
this.handleClose = this.handleClose.bind(this)
// 中略
handleClose = () => {
  this.setState({open: false})
};
```

#### 実践

+ `src/App.jsx`を編集<br>

```
import React, { useCallback, useEffect, useState } from 'react'
import './assets/styles/style.css'
import { AnswersList, Chats } from './components/index'
import { FormDialog } from './components/Forms/FormDialog'
import { db } from './firebase'

const App = () => {
  const [answers, setAnswers] = useState([])
  const [chats, setChats] = useState([])
  const [currentId, setCurrentId] = useState('init')
  const [dataset, setDataset] = useState({})
  const [open, setOpen] = useState(false)

  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    addChats({
      text: nextDataset.question,
      type: 'question',
    })

    setAnswers(nextDataset.answers)
    setCurrentId(nextQuestionId)
  }

  const selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch (true) {
      case nextQuestionId === 'contact':
        handleClickOpen()
        break
      case /^https:*/.test(nextQuestionId):
        const a = document.createElement('a')
        a.href = nextQuestionId
        a.target = '_blank'
        a.click()
        break
      default:
        addChats({
          text: selectedAnswer,
          type: 'answer',
        })

        setTimeout(
          () => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]),
          1000,
        )
        break
    }
  }

  const addChats = (chat) => {
    setChats((prevChats) => {
      return [...prevChats, chat]
    })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    ;(async () => {
      const initDataset = {}

      await db
        .collection('questions')
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            initDataset[id] = data
          })
        })
      setDataset(initDataset)
      displayNextQuestion(currentId, initDataset[currentId])
    })()
  }, [])

  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  })

  return (
    <section className="c-section">
      <div className="c-box">
        <Chats chats={chats} />
        <AnswersList answers={answers} select={selectAnswer} />
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  )
}

export default App
```

+ `src/components/index.js`を編集<br>

```
export {default as AnswersList} from './AnswersList'
export {default as Answer} from './Answer'
export {default as Chats} from './Chats'
export {default as Chat} from './Chat'
export {default as FormDialog} from './Forms/FormDialog'
```

+ `src/App.jsx`を編集<br>

```
import React, { useCallback, useEffect, useState } from 'react'
import './assets/styles/style.css'
import { AnswersList, Chats, FormDialog } from './components/index'
import { db } from './firebase'

const App = () => {
  const [answers, setAnswers] = useState([])
  const [chats, setChats] = useState([])
  const [currentId, setCurrentId] = useState('init')
  const [dataset, setDataset] = useState({})
  const [open, setOpen] = useState(false)

  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    addChats({
      text: nextDataset.question,
      type: 'question',
    })

    setAnswers(nextDataset.answers)
    setCurrentId(nextQuestionId)
  }

  const selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch (true) {
      case nextQuestionId === 'contact':
        handleClickOpen()
        break
      case /^https:*/.test(nextQuestionId):
        const a = document.createElement('a')
        a.href = nextQuestionId
        a.target = '_blank'
        a.click()
        break
      default:
        addChats({
          text: selectedAnswer,
          type: 'answer',
        })

        setTimeout(
          () => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]),
          1000,
        )
        break
    }
  }

  const addChats = (chat) => {
    setChats((prevChats) => {
      return [...prevChats, chat]
    })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    ;(async () => {
      const initDataset = {}

      await db
        .collection('questions')
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            initDataset[id] = data
          })
        })
      setDataset(initDataset)
      displayNextQuestion(currentId, initDataset[currentId])
    })()
  }, [])

  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  })

  return (
    <section className="c-section">
      <div className="c-box">
        <Chats chats={chats} />
        <AnswersList answers={answers} select={selectAnswer} />
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  )
}

export default App
```

+ `src/components/Forms/FormDialog.jsx`を編集<br>

```
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import React, { useCallback, useState } from 'react'
import TextInput from './TextInput'

const FormDialog = (props) => {
  const { open, handleClose } = props
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')

  const inputName = useCallback(
    (event) => {
      setName(event.target.value)
    },
    [setName],
  )

  const inputEmail = useCallback(
    (event) => {
      setEmail(event.target.value)
    },
    [setEmail],
  )

  const inputDescription = useCallback(
    (event) => {
      setDescription(event.target.value)
    },
    [setDescription],
  )

  const validateEmailFormat = (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return regex.test(email)
  }

  const validateRequiredInput = (...args) => {
    let isBlank = false
    for (let i = 0; i < args.length; i = (i + 1) | 0) {
      if (args[i] === '') {
        isBlank = true
      }
    }
    return isBlank
  }

  const submitForm = () => {
    const isBlank = validateRequiredInput(name, email, description)
    const isValidEmail = validateEmailFormat(email)

    if (isBlank) {
      alert('必須入力欄が空白です。')
      return false
    } else if (!isValidEmail) {
      alert('メールアドレスの書式が異なります。')
      return false
    } else {
      const payload = {
        text:
          'お問い合わせがありました\n' +
          'お名前: ' +
          name +
          '\n' +
          'メールアドレス: ' +
          email +
          '\n' +
          '【問い合わせ内容】\n' +
          description,
      }
      // fetchメソッドでフォームの内容をSlackのIncoming Webhook URLに送信する
      const url =
        'https://hooks.slack.com/services/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'
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      }).then(() => {
        alert('送信が完了しました。追って連絡いたします🙌')
        setName('')
        setEmail('')
        setDescription('')
        return handleClose()
      })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">お問い合わせフォーム</DialogTitle>
      <DialogContent>
        <TextInput
          label={'お名前(必須)'}
          multiline={false}
          rows={1}
          value={name}
          type={'text'}
          onChange={inputName}
        />
        <TextInput
          label={'メールアドレス(必須)'}
          multiline={false}
          rows={1}
          value={email}
          type={'email'}
          onChange={inputEmail}
        />
        <TextInput
          label={'お問い合わせ内容(必須)'}
          multiline={true}
          rows={5}
          value={description}
          type={'email'}
          onChange={inputDescription}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          キャンセル
        </Button>
        <Button onClick={submitForm} color="primary" autoFocus>
          送信する
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FormDialog
```
