import React, { Component, createContext } from 'react'
import sortBy from 'lodash/sortBy'

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

      if (decrypted.startsWith('stats|')) {
        const decryptedPayload = JSON.parse(decrypted.replace('stats|', ''))
        const payload = {
          serverId: evt.server_id,
          commandId: evt.command_id,
          stats: decryptedPayload.stats,
          collectedAt: new Date(decryptedPayload.collected_at_ms),
          type: 'stats'
        }

        const { collected } = this.state
        const oldData = collected[evt.application_name] || []
        const newData = sortBy([payload].concat(oldData), 'serverId')

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
