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
