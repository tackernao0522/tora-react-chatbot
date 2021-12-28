import { TextField } from '@material-ui/core'
import React from 'react'

const TextInput = (props) => {
  const { label, multiline, rows, value, type, onChange } = props
  return (
    <TextField
      fullWidth={true}
      label={label}
      margin={'dense'}
      multiline={multiline}
      rows={rows}
      value={value}
      type={type}
      onChange={onChange}
    />
  )
}

export default TextInput
