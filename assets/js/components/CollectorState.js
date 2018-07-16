import React, { Component, createContext } from 'react'
import sortBy from 'lodash/sortBy'
import { TimeEvent, TimeSeries } from "pondjs";

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
          const series = newChartData[label] || this.generateEmptyChartData(label)
          const newChartDataEntry = this.appendChartEntry(series, new TimeEvent(decryptedPayload.collected_at_ms, value))

          newChartData = {
            ...newChartData,
            [series.name()]: newChartDataEntry
          }
        })

        console.log('[new chart data]', newChartData)
        this.setState({ chartData: newChartData })
      }
    })
  }

  appendChartEntry(series, event) {
    return new TimeSeries({
      name: series.name(),
      columns: series.columns(),
      events: series._collection.addEvent(event)
    })
  }

  generateEmptyChartData(name) {
    return new TimeSeries({
      name,
      columns: ['time', 'value'],
      events: []
    })
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
