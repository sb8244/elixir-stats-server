import React, { Component } from 'react'
import { throttle } from 'frame-throttle';

import CombinedLineChart from './CombinedLineChart'
import SeriesAggregates from './SeriesAggregates'

function getTimeSeries(chartData) {
  return Object.keys(chartData).map((key) => {
    const seriesContainer = chartData[key]
    return {
      id: key,
      seriesContainer
    }
  })
}

export default class ChartContainer extends Component {
  state = {
    timerange: null,
    tracker: null,
  }

  constructor(props) {
    super(props)

    this.handleTrackerChanged = throttle(this.handleTrackerChanged)
  }

  componentWillUnmount() {
    this.handleTrackerChanged.cancel()
  }

  handleTrackerChanged = (tracker, scale) => {
    if (tracker) {
      this.setState({ tracker })
    } else {
      this.setState({ tracker: null })
    }
  }

  render() {
    const { chartData, getColor } = this.props
    const timeSeries = getTimeSeries(chartData)
    const { tracker } = this.state

    return timeSeries.map(({ id, seriesContainer }) => (
      <div className="chart-container" key={id}>
        <CombinedLineChart
          seriesContainer={seriesContainer}
          title={id}
          getColor={getColor}

          tracker={tracker}
          handleTrackerChanged={this.handleTrackerChanged}

          onTimeRangeChanged={(timerange) => this.setState({ timerange })}
          timeRange={this.state.timerange}
          clearTimeRange={() => this.setState({ timerange: null })}
        />
        <SeriesAggregates
          seriesContainer={seriesContainer}
          getColor={getColor}
          tracker={tracker}
          timeRange={this.state.timerange}
        />
      </div>
    ))
  }
}
