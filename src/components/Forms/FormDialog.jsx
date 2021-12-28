import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import React, { Component } from 'react'
import TextInput from './TextInput'

export class FormDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      description: '',
    }
    this.inputName = this.inputName.bind(this)
    this.inputEmail = this.inputEmail.bind(this)
    this.inputDescription = this.inputDescription.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  inputName = (event) => {
    this.setState({ name: event.target.value })
  }

  inputEmail = (event) => {
    this.setState({ email: event.target.value })
  }

  inputDescription = (event) => {
    this.setState({ description: event.target.value })
  }

  validateEmailFormat = (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return regex.test(email)
  }

  validateRequiredInput = (...args) => {
    let isBlank = false
    for (let i = 0; i < args.length; i = (i + 1) | 0) {
      if (args[i] === '') {
        isBlank = true
      }
    }
    return isBlank
  }

  submitForm = () => {
    const name = this.state.name
    const email = this.state.email
    const description = this.state.description

    const isBlank = this.validateRequiredInput(name, email, description)
    const isValidEmail = this.validateEmailFormat(email)

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
        this.setState({
          name: '',
          email: '',
          description: '',
        })
        return this.handleClose()
      })
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">お問い合わせフォーム</DialogTitle>
        <DialogContent>
          <TextInput
            label={'お名前(必須)'}
            multiline={false}
            rows={1}
            value={this.state.name}
            type={'text'}
            onChange={this.inputName}
          />
          <TextInput
            label={'メールアドレス(必須)'}
            multiline={false}
            rows={1}
            value={this.state.email}
            type={'email'}
            onChange={this.inputEmail}
          />
          <TextInput
            label={'お問い合わせ内容(必須)'}
            multiline={true}
            rows={5}
            value={this.state.description}
            type={'email'}
            onChange={this.inputDescription}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            キャンセル
          </Button>
          <Button onClick={this.submitForm} color="primary" autoFocus>
            送信する
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
