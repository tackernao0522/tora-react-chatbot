## 07 Material-UIのスタイルをカスタマイズする

### Material-UIのスタイルの変更方法

1. `Hook API`<br>

   Material-UIのサンプルコードと同じ<br>

2. `Styled components API`<br>

  コンポーネントの`シンタックス`に直接スタイルを適用<br>

3. `Higher-order component API`<br>

  スタイルを当てたコンポーネントを返すコンポーネント<br>

### Hook APIの使い方

1. `インストール`<br>

`$ npm install --save @material-ui/styles`(初回時にインストール済)<br>

2. `import`<br>

```
import {createStyles, makeStyles} from "@material-ui/core/styles";
```

3. `関数を定義`<br>

```
const useStyles = makeStyles(() =>
  createStyles({
    "root": {
      padding: 0
    }
  })
)
```

### 記述ルール

1. json形式<br>

2. キャメルケース<br>

3. 数値はそのまま<br>

4. クォーテーションで文字列を囲む<br>

```
const useStyles = makeStyles(() =>
  createStyles({
    "button": {
      borderColor: "#FFB549",
      color: "#FFB549",
      fontWeight: 600,
      marginBottom: "8px",
      "&:hover": {
        backgroundColor: "#FFB549",
        color: "#fff"
      }
    }
  })
)
```

### 適用方法

1. コンポーネント内で宣言<br>

2. オブジェクト型として使える<br>

```
const Answer = (props) => {
  const classes = useStyles();

  return (
    <Button className={classes.button}>
      {props.answer.content}
    </Button>
  )
}
```

#### 実践

+ `src/components/Answer.jsx`を編集<br>

```
import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      borderColor: '#FFB549',
      color: '#FFB549',
      fontWeight: 600,
      marginBottom: '8px',
      '&:hover': {
        backgroundColor: '#FFB549',
        color: '#fff',
      },
    },
  }),
)

const Answer = (props) => {
  const { content, select, nextId } = props
  const classes = useStyles();

  return (
    <Button
      className={classes.button}
      variant="outlined"
      onClick={() => select(content, nextId)}
    >
      {content}
    </Button>
  )
}

export default Answer
```

+ `src/components/Chats.jsx`を編集<br>

```
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import { Chat } from '.'

const useStyles = makeStyles(() => (
  createStyles({
    "chats": {
      height: 400,
      padding: '0',
      overflow: 'auto'
    }
  })
))

const Chats = (props) => {
  const { chats } = props

  const classes = useStyles()

  return (
    <List className={classes.chats}>
      {chats.map((chat, index) => (
        <Chat key={index.toString()} text={chat.text} type={chat.type} />
      ))}
    </List>
  )
}

export default Chats
```


## 08 ライフサイクルの活用(自動スクロール)

### componentDidUpdate()

`App.jsx`<br>
```
// 最新のチャットが見えるように、スクロール位置の頂点をスクロール領域の最下部に設定する
componentDidUpdate(prevProps, prevState, snapshot) {
  const scrollArea = document.getElementById('scroll-area)
  if (scrollArea) {
    scrollArea.scrollTop = scrollArea.scrollHeight
  }
}
```

`Chats.jsx`<br>
```
return (
  <List id={"scroll-area"}>
    // 中略
  </List>
)
```

### 実践

+ `src/components/Chats.jsx`を編集<br>

```
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import { Chat } from '.'

const useStyles = makeStyles(() => (
  createStyles({
    "chats": {
      height: 400,
      padding: '0',
      overflow: 'auto'
    }
  })
))

const Chats = (props) => {
  const { chats } = props

  const classes = useStyles()

  return (
    <List className={classes.chats} id={"scroll-area"}>
      {chats.map((chat, index) => (
        <Chat key={index.toString()} text={chat.text} type={chat.type} />
      ))}
    </List>
  )
}

export default Chats
```

+ `src/App.jsx`を編集<br>

```
import React, { Component } from 'react'
import defaultDataset from './dataset'
import './assets/styles/style.css'
import { AnswersList, Chats } from './components/index'

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
    this.selectAnswer = this.selectAnswer.bind(this)
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
        this.displayNextQuestion(nextQuestionId)
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
        this.displayNextQuestion(nextQuestionId)
        break
    }
  }

  componentDidMount() {
    const initAnswer = ''
    this.selectAnswer(initAnswer, this.state.currentId)
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
        </div>
      </section>
    )
  }
}
```

### setTimeout()で遅延表示

`App.jsx`<br>
```
// コンポーネントの初期化時
case (nextQuestionId === 'init'):
  setTimeout(() => this.displayMextQuestion(nextQuestionId), 500);
  break;
```

### 実践

+ `src/App.jsx`を編集<br>

```
import React, { Component } from 'react'
import defaultDataset from './dataset'
import './assets/styles/style.css'
import { AnswersList, Chats } from './components/index'

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
    this.selectAnswer = this.selectAnswer.bind(this)
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

  componentDidMount() {
    const initAnswer = ''
    this.selectAnswer(initAnswer, this.state.currentId)
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
        </div>
      </section>
    )
  }
}
```

+ `src/App.jsx`を編集<br>

```
import React, { Component } from 'react'
import defaultDataset from './dataset'
import './assets/styles/style.css'
import { AnswersList, Chats } from './components/index'

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
    this.selectAnswer = this.selectAnswer.bind(this)
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

  componentDidMount() {
    const initAnswer = ''
    this.selectAnswer(initAnswer, this.state.currentId)
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
        </div>
      </section>
    )
  }
}
```
