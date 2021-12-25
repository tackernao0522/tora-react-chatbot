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
