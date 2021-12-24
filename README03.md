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
