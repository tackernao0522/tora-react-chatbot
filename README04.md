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
