import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import { Chat } from '.'

const useStyles = makeStyles(() =>
  createStyles({
    chats: {
      height: 400,
      padding: '0',
      overflow: 'auto',
    },
  }),
)

const Chats = (props) => {
  const { chats } = props

  const classes = useStyles()

  return (
    <List className={classes.chats} id={'scroll-area'}>
      {chats.map((chat, index) => (
        <Chat key={index.toString()} text={chat.text} type={chat.type} />
      ))}
    </List>
  )
}

export default Chats
