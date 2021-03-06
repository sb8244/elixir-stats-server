import React, { Component, createContext } from 'react'
import sortBy from 'lodash/sortBy'
import { TimeEvent, TimeSeries } from "pondjs";

import { decryptPayload } from '../encryption'

export const CollectorStateContext = createContext({})

export default class CollectorState extends Component {
  state = {
    chartData: {},
    plainTextLogs: {}
  }

  componentDidMount() {
    const { channel } = this.props
    channel.on('collect_results', (evt) => {
      const decrypted = decryptPayload(evt.encrypted_response);

      if (decrypted.startsWith('stats|')) {
        this.collectStats(decrypted, evt)
      } else if (decrypted.startsWith('text|')) {
        this.collectTextLog(decrypted, evt)
      }
    })
  }

  collectStats(decrypted, evt) {
    const decryptedPayload = JSON.parse(decrypted.replace('stats|', ''))
    let newChartData = this.state.chartData

    decryptedPayload.stats.forEach(({ label, value }) => {
      const seriesContainer = newChartData[label] || {}
      const series = seriesContainer[evt.server_id] || this.generateEmptyChartData(label)
      const newSeries = this.appendChartEntry(series, new TimeEvent(decryptedPayload.collected_at_ms, value))

      newChartData = {
        ...newChartData,
        [label]: {
          ...seriesContainer,
          [evt.server_id]: newSeries
        }
      }
    })

    this.setState({ chartData: newChartData })
  }

  collectTextLog(decrypted, evt) {
    const plainText = decrypted.replace('text|', '')
    const plainTextLogs = this.state.plainTextLogs
    const logsContainer = plainTextLogs[evt.server_id] || []
    const newLog = {
      collectedAtMs: evt.collected_at_ms,
      serverId: evt.server_id,
      text: plainText
    }
    const newLogsContainer = [newLog].concat(logsContainer)

    const newPlainTextLogs = {
      ...plainTextLogs,
      [evt.server_id]: newLogsContainer
    }

    this.setState({ plainTextLogs: newPlainTextLogs })
  }

  clearData() {
    this.setState({
      chartData: {}
    })
  }

  clearPlainTextLogs() {
    this.setState({
      plainTextLogs: {}
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
    const value = {
      ...this.state,
      clearData: this.clearData.bind(this),
      clearPlainTextLogs: this.clearPlainTextLogs.bind(this)
    }

    return (
      <CollectorStateContext.Provider value={value}>
        {this.props.children}
      </CollectorStateContext.Provider>
    )
  }
}
