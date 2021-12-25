## 05 繰り返し再利用できる関数コンポーネントを作成(回答を表示)

+ `src/components`ディレクトリを作成<br>

+ `src/components/AnswersList.jsx`コンポーネントを作成<br>

+ `src/components/index.js`ファイルを作成<br>

```
export {default as AnswersList} from './AnswersList'
```

+ `src/App.jsx`を編集<br>

```
import React, { Component } from 'react'
import defaultDataset from './dataset'
import './assets/styles/style.css'
import { AnswersList } from './components/index'

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
        <div className="c-box">
          <AnswersList />
        </div>
      </section>
    )
  }
}
```

+ `src/components/Answer.jsx`コンポーネントを作成<br>

+ `src/components/index.js`を編集<br>

```
export {default as AnswersList} from './AnswersList'
export {default as Answer} from './Answer'
```

+ `src/components/AnswersList.jsx`を編集<br>

```
import React from 'react'
import { Answer } from './index'

const AnswersList = () => {
  return (
    <div className="c-grid__answer">
      <Answer />
      <Answer />
      <Answer />
      <Answer />
    </div>
  )
}

export default AnswersList
```

+ `src/components/Answer.jsx`を編集<br>

```
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {},
}))

const Answer = (props) => {
  const { content } = props
  // const classes = useStyles();

  return (
    <Button variant="contained" color="primary">
      {content}
    </Button>
  )
}

export default Answer
```

+ `src/App.jsx`を編集<br>

```
import React, { Component } from 'react'
import defaultDataset from './dataset'
import './assets/styles/style.css'
import { AnswersList } from './components/index'

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

  initAnswer = () => {
    const initDataset = this.state.dataset[this.state.currentId]
    const initAnswers = initDataset.answers
    this.setState({
      answers: initAnswers,
    })
  }

  componentDidMount() {
    this.initAnswer()
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <AnswersList answers={this.state.answers} />
        </div>
      </section>
    )
  }
}
```

+ `src/components/AnswersList.jsx`を編集<br>

```
import React from 'react'
import { Answer } from './index'

const AnswersList = (props) => {
  const { answers } = props
  return (
    <div className="c-grid__answer">
      {answers.map((value, index) => (
        <Answer key={index.toString()} content={value.content} />
      ))}
    </div>
  )
}

export default AnswersList
```

## 06 条件分岐とコールバック関数のbind

+ `src/components/Chats.jsx`コンポーネントを作成<br>

+ `src/components/Chat.jsx`コンポーネントを作成<br>

+ `src/components/index.js`を編集<br>

```
export {default as AnswersList} from './AnswersList'
export {default as Answer} from './Answer'
export {default as Chats} from './Chats'
export {default as Chat} from './Chat'
```

+ `src/App.jsx`を編集<br>

```
import React, { Component } from 'react'
import defaultDataset from './dataset'
import './assets/styles/style.css'
import { AnswersList, Chats } from './components/index' // 編集

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

  initAnswer = () => {
    const initDataset = this.state.dataset[this.state.currentId]
    const initAnswers = initDataset.answers
    this.setState({
      answers: initAnswers,
    })
  }

  componentDidMount() {
    this.initAnswer()
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats /> // 追記
          <AnswersList answers={this.state.answers} />
        </div>
      </section>
    )
  }
}
```

+ `src/components/Chats.jsx`を編集<br>

```
import React from 'react'
import { makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import { Chat } from '.'


const useStyles = makeStyles((theme) => ({
  root: {
    with: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
}))

const Chats = () => {
  const classes = useStyles()

  return (
    <List className={classes.root}>
      <Chat />
      <Chat />
      <Chat />
      <Chat />
    </List>
  )
}

export default Chats
```

+ `src/components/Chat.jsx`を編集<br>

```
import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

const Chat = () => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt="icon" src="/static/images/avatar/1.png" />
      </ListItemAvatar>
      <div className="p-chat__bubble">ダミーテキスト</div>
    </ListItem>
  )
}

export default Chat
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
  }

  initAnswer = () => {
    const initDataset = this.state.dataset[this.state.currentId]
    const initAnswers = initDataset.answers
    this.setState({
      answers: initAnswers,
    })
  }

  initChats = () => {
    const initDataset = this.state.dataset[this.state.currentId]
    const chat = {
      text: initDataset.question,
      type: 'question'
    }

    const chats = this.state.chats
    chats.push(chat)

    this.setState({
      chats: chats,
    })
  }

  componentDidMount() {
    this.initChats()
    this.initAnswer()
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList answers={this.state.answers} />
        </div>
      </section>
    )
  }
}
```

+ `src/components/Chats.jsx`を編集<br>

```
import React from 'react'
import { makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import { Chat } from '.'

const useStyles = makeStyles((theme) => ({
  root: {
    with: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
}))

const Chats = (props) => {
  const { chats } = props

  const classes = useStyles()

  return (
    <List className={classes.root}>
      {chats.map((chat, index) => (
        <Chat key={index.toString()} text={chat.text} type={chat.type} />
      ))}
    </List>
  )
}

export default Chats
```

+ `src/components/Chat.jsx`を編集<br>

```
import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

const Chat = (props) => {
  console.log(props)
  const { text, type } = props
  const isQuestion = (type === 'question')
  const classes = isQuestion ? 'p-chat__row' : 'p-chat__reverse'

  return (
    <ListItem className={classes}>
      <ListItemAvatar>
        <Avatar alt="icon" src="/static/images/avatar/1.png" />
      </ListItemAvatar>
      <div className="p-chat__bubble">{text}</div>
    </ListItem>
  )
}

export default Chat
```

+ `src/asstes/img`ディレクトリを作成<br>

+ `src/assets/img`ディレクトリに`no-profile.png`と`torahack.png`を配置<br>

## return内での条件分岐

+ {}内はJavaScriptの世界<br>
+ 最初に条件式を書く<br>
+ ()内に真(偽)の場合に返すJSXを記述<br>

`ifのみ`<br>

```
{(list.length === 0) && (
  <Loading />
)}
```

`if else`<br>

```
{isQuestion ? (
  <Avatar alt="icon" src={Torahack} />
) : (
  <Avatar="icon" src={NoProfile} />
)}
```

+ `src/components/Chat.jsx`を編集<br>

```
import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import NoProfile from '../assets/img/no-profile.png'
import Torahack from '../assets/img/torahack.png'

const Chat = (props) => {
  const { text, type } = props
  const isQuestion = type === 'question'
  const classes = isQuestion ? 'p-chat__row' : 'p-chat__reverse'

  return (
    <ListItem className={classes}>
      <ListItemAvatar>
        {isQuestion ? (
          <Avatar alt="icon" src={Torahack} />
        ) : (
          <Avatar alt="icon" src={NoProfile} />
        )}
      </ListItemAvatar>
      <div className="p-chat__bubble">{text}</div>
    </ListItem>
  )
}

export default Chat
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
    const initAnswer = ""
    this.selectAnswer(initAnswer, this.state.currentId)
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList answers={this.state.answers} />
        </div>
      </section>
    )
  }
}
```

## コールバック関数のbind()

```
constructor(props) {
  super(props);
  this.selectAnswer = this.slectAnswer.bind(this)
}

slectAnswer = (slectedAnswer, nextQuestionId) => {
  // 処理を記述
}

render() {
  return (
    <AnswerList
      answers={this.state.ansewers}
      select={this.selectAnswer}
    />
  )
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

+ `src/components/AnswersList.jsx`を編集<br>

```
import React from 'react'
import { Answer } from './index'

const AnswersList = (props) => {
  const { answers, select } = props
  return (
    <div className="c-grid__answer">
      {answers.map((value, index) => (
        <Answer key={index.toString()} nextId={value.nextId} content={value.content}  select={select}/>
      ))}
    </div>
  )
}

export default AnswersList
```

+ `src/components/Answer.jsx`を編集<br>

```
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {},
}))

const Answer = (props) => {
  const { content, select, nextId } = props
  // const classes = useStyles();

  return (
    <Button variant="contained" color="primary" onClick={() => select(content, nextId)}>
      {content}
    </Button>
  )
}

export default Answer
```
