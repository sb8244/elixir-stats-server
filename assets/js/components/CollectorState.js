import React, { Component, createContext } from 'react'

import { decryptPayload } from '../encryption'

export const CollectorStateContext = createContext({})

export default class CollectorState extends Component {
  constructor(props) {
    super(props)

    const { channel } = props;

    this.state = {
      collected: {}
    }

    channel.on('collect_results', (evt) => {
      const decrypted = decryptPayload(evt.encrypted_response);
      let payload;

      if (decrypted.startsWith('stats|')) {
        payload = JSON.parse(decrypted.replace('stats|', ''))
        const { collected } = this.state
        const oldData = collected[evt.application_name] || []
        const newData = oldData.concat([payload])

        this.setState({
          collected: {
            ...collected,
            [evt.application_name]: newData
          }
        })
      }
    })
  }

  componentWillUnmount() {
    this.props.channel.off('collect_results')
  }

  render() {
    const { collected } = this.state

    return (
      <CollectorStateContext.Provider value={collected}>
        {this.props.children}
      </CollectorStateContext.Provider>
    )
  }
}
