import React, { Component, createContext } from 'react'
import sortBy from 'lodash/sortBy'

import { decryptPayload } from '../encryption'

export const CollectorStateContext = createContext({})

export default class CollectorState extends Component {
  constructor(props) {
    super(props)

    const { channel } = props;

    this.state = {
      chartData: {}
    }

    channel.on('collect_results', (evt) => {
      const decrypted = decryptPayload(evt.encrypted_response);

      if (decrypted.startsWith('stats|')) {
        const decryptedPayload = JSON.parse(decrypted.replace('stats|', ''))
        let newChartData = this.state.chartData

        decryptedPayload.stats.forEach(({ label, value }) => {
          const chartDataEntry = newChartData[label] || this.generateEmptyChartData(label)
          const dataPoint = [
            decryptedPayload.collected_at_ms,
            value
          ]

          const newChartDataEntry = {
            ...chartDataEntry,
            points: chartDataEntry.points.concat([dataPoint])
          }

          newChartData = {
            ...newChartData,
            [chartDataEntry.name]: newChartDataEntry
          }
        })

        console.log('[new chart data]', newChartData)
        this.setState({ chartData: newChartData })
      }
    })
  }

  generateEmptyChartData(name) {
    return {
      name,
      columns: ['time', 'value'],
      points: []
    }
  }

  componentWillUnmount() {
    this.props.channel.off('collect_results')
  }

  render() {
    return (
      <CollectorStateContext.Provider value={this.state}>
        {this.props.children}
      </CollectorStateContext.Provider>
    )
  }
}
