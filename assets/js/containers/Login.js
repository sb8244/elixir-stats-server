import React, { Component } from 'react'
import { Grid, Form, Segment, Button } from 'semantic-ui-react'

import { setCredentials } from '../credentials'

import '../../css/login.css'

export default class Login extends Component {
  state = {
    connectToken: "",
    encryptionSecret: ""
  }

  fieldChange(field) {
    return (evt) => {
      this.setState({
        [field]: evt.target.value
      })
    }
  }

  submitForm = () => {
    setCredentials({
      encryptionSecret: this.state.encryptionSecret,
      socketConnectSecret: this.state.connectToken
    })

    window.location.reload()
  }

  render() {
    const { connectToken, encryptionSecret } = this.state
    const disabled = !connectToken || !encryptionSecret

    return (
      <Grid className="login-wrapper middle aligned center aligned">
        <Grid.Column className="login-column">
          <h1>Configure Connection Credentials</h1>
          <Form className="login-form" onSubmit={this.submitForm}>
            <Segment>
              <p>
                If you enter incorrect information, you may not be able to connect or you
                may not be able to send commands until you clear your credentials. The stats
                server does not know your encryption secret.
              </p>
              <Form.Field required>
                <label>Client Socket Token</label>
                <input placeholder='Used to authenticate to the client socket' value={connectToken} onChange={this.fieldChange('connectToken')} />
              </Form.Field>
              <Form.Field required>
                <label>Encryption Secret</label>
                <input placeholder='Used to encrypt / decrypt the payload' value={encryptionSecret} onChange={this.fieldChange('encryptionSecret')} />
              </Form.Field>
              <Button disabled={disabled} type='submit' size="large" fluid color="blue">Configure</Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}
