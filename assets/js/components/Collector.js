import React, { Component } from 'react'
import { TimeRange } from "pondjs";
import { Charts, ChartContainer, ChartRow, EventMarker, YAxis, LineChart, ScatterChart, styler } from "react-timeseries-charts";

import { CollectorStateContext } from './CollectorState'
import { CommandHistoryStateContext } from './CommandHistoryState'

const style = styler([{ key: "value", color: "orange", width: 1 }]);

class CombinedLineChart extends Component {
  state = {
    tracker: null,
    trackerValue: null,
    trackerEvent: null
  }

  handleTrackerChanged = (tracker, scale) => {
    if (tracker) {
      const series = Object.values(this.props.seriesContainer)[0]
      const e = series.atTime(tracker);

      this.setState({
        tracker,
        trackerValue: e.get('value'),
        trackerEvent: e,
      })
    } else {
      this.setState({
        tracker: null,
        trackerValue: null,
        trackerEvent: null
      })
    }
  }

  renderCharts() {
    const { seriesContainer } = this.props

    const charts = Object.keys(seriesContainer).map((serverId) => {
      const series = seriesContainer[serverId]

      return [
        <LineChart key="line" axis="y" series={series} columns={['value']} style={style} />,
        <ScatterChart key="scatter" axis="y" series={series} columns={['value']} style={style} />,
      ]
    })

    if (this.state.tracker) {
      charts.push(this.renderMarker())
    }

    return charts
  }

  renderMarker() {
    const { tracker, trackerEvent, trackerValue } = this.state
    return (
      <EventMarker
        key="marker"
        type="flag"
        axis="y"
        event={this.state.trackerEvent}
        column="value"
        info={[{ label: "Value", value: `${trackerValue}` }]}
        infoWidth={120}
        markerRadius={2}
        markerStyle={{ fill: "black" }}
      />
    )
  }

  getSeriesAggregates() {
    return Object.values(this.props.seriesContainer).reduce((acc, series) => {
      return {
        begin: Math.min(series.begin().getTime(), acc.begin || Number.MAX_SAFE_INTEGER),
        end: Math.max(series.end().getTime(), acc.end || Number.MIN_SAFE_INTEGER),
        min: Math.min(series.min(), acc.min || Number.MAX_SAFE_INTEGER),
        max: Math.max(series.max(), acc.max || Number.MIN_SAFE_INTEGER)
      }
    }, {})
  }

  render() {
    const { title } = this.props
    const aggregates = this.getSeriesAggregates()
    const timeRange = new TimeRange([aggregates.begin - 30000, aggregates.end + 30000])

    return (
      <ChartContainer
        timeRange={timeRange}
        width={800}
        format="%H:%M:%S"
        title={title}
        timeAxisTickCount={5}
        onTrackerChanged={this.handleTrackerChanged}
        trackerPosition={this.state.tracker}
      >
        <ChartRow height="200">
          <YAxis id="y" min={aggregates.min - (aggregates.min * .05)} max={aggregates.max + (aggregates.max * .05)} />
          <Charts>
            {
              this.renderCharts()
            }
          </Charts>
        </ChartRow>
      </ChartContainer>
    )
  }
}

function getTimeSeries(chartData) {
  return Object.keys(chartData).map((key) => {
    const seriesContainer = chartData[key]
    return {
      id: key,
      seriesContainer
    }
  })
}

export default () => (
  <CommandHistoryStateContext.Consumer>
  {
    ({ getTitle }) => (
      <CollectorStateContext.Consumer>
      {
        ({ chartData }) => {
          const timeSeries = getTimeSeries(chartData)

          return timeSeries.map(({ id, seriesContainer }) => (
            <CombinedLineChart key={id} seriesContainer={seriesContainer} title={id} />
          ))
        }
      }
      </CollectorStateContext.Consumer>
    )
  }
  </CommandHistoryStateContext.Consumer>
)
