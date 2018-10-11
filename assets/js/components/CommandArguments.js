import React, { Component } from 'react'
import { Button, Form, Icon } from 'semantic-ui-react'

export class CommandArguments extends Component {
  addArgument() {
    const argumentList = this.getArgumentList()
    const { setArguments } = this.props
    const id = Math.random().toString(36).substring(2)

    setArguments([
      ...argumentList,
      { key: '', id, value: '' }
    ])
  }

  getArgumentList() {
    const { argumentList } = this.props
    return argumentList || []
  }

  removeArgument(id) {
    return () => {
      const argumentList = this.getArgumentList()
      const { setArguments } = this.props

      setArguments(argumentList.filter((arg) => arg.id !== id))
    }
  }

  updateArgument(id, field) {
    return (evt) => {
      const value = evt.target.value
      const argumentList = this.getArgumentList()
      const { setArguments } = this.props

      setArguments(argumentList.map((arg) => {
        if (arg.id === id) {
          return { ...arg, [field]: value }
        } else {
          return arg
        }
      }))
    }
  }

  render() {
    const argumentList = this.getArgumentList()

    return (
      <Form style={{ marginBottom: '5px' }}>
        {
          argumentList.map(({ key, id, value }) => (
            <Form.Group widths="equal" key={id} style={{ marginBottom: '5px' }}>
              <Form.Input fluid placeholder='Key' value={key} onChange={this.updateArgument(id, 'key')} />
              <Form.Input fluid placeholder='Value' value={value} onChange={this.updateArgument(id, 'value')} />
              <Button icon basic onClick={this.removeArgument(id)}>
                <Icon name='trash' />
              </Button>
            </Form.Group>)
          )
        }
        <Button fluid icon basic labelPosition='left' onClick={this.addArgument.bind(this)}>
          Add Argument
          <Icon name='add' />
        </Button>
      </Form>
    )
  }
}
