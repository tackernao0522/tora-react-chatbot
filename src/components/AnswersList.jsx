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
