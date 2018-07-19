import React, { Component } from 'react'
import { TimeRange } from "pondjs";
import { Charts, ChartContainer, ChartRow, EventMarker, Resizable, YAxis, LineChart, ScatterChart, styler } from "react-timeseries-charts";

import { CollectorStateContext } from './CollectorState'
import { ServerColorStateContext } from './ServerColorState'

class CombinedLineChart extends Component {
  state = {
    trackerValue: null,
    trackerEvent: null
  }

  renderCharts() {
    const { getColor, seriesContainer } = this.props

    const charts = Object.keys(seriesContainer).map((serverId, i) => {
      // TODO: Only include the chart if the serverId is in the selected list (or none selected)
      const series = seriesContainer[serverId]
      const color = getColor(serverId)
      const style = styler([{ key: "value", color: color, width: 1 }])

      return [
        <LineChart key="line" axis="y" series={series} columns={['value']} style={style} />,
        <ScatterChart key="scatter" axis="y" series={series} columns={['value']} style={style} />
      ]
    })

    if (this.props.tracker) {
      charts.push(this.renderMarker())
    }

    return charts
  }

  renderMarker() {
    const { seriesContainer, tracker } = this.props

    const series = Object.values(seriesContainer)[0]
    const trackerEvent = series.atTime(tracker)
    const trackerValue = trackerEvent.get('value')

    return (
      <EventMarker
        key="marker"
        type="flag"
        axis="y"
        event={trackerEvent}
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
    const { clearTimeRange, onTimeRangeChanged, timeRange, title } = this.props
    const aggregates = this.getSeriesAggregates()
    // TODO: Set a 2 minute maximum on how far back this can go
    const fullTimeRange = new TimeRange([aggregates.begin - 30000, aggregates.end + 30000])
    const usableTimeRange = timeRange || fullTimeRange

    return (
      <Resizable className="chart-container">
        <ChartContainer
          timeRange={timeRange}
          format="%H:%M:%S"
          title={title}
          timeAxisTickCount={5}

          /* Info box for currently hover point */
          onTrackerChanged={this.props.handleTrackerChanged}
          trackerPosition={this.props.tracker}

          /* Time range selection */
          enablePanZoom={false}
          enableDragZoom={true}
          onTimeRangeChanged={onTimeRangeChanged}
          timeRange={usableTimeRange}
          onBackgroundClick={clearTimeRange}
          maxTime={fullTimeRange.end()}
          minTime={fullTimeRange.begin()}
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
      </Resizable>
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

export default class Collector extends Component {
  state = {
    timerange: null,
    tracker: null,
  }

  handleTrackerChanged = (tracker, scale) => {
    requestAnimationFrame(() => {
      if (tracker) {
        this.setState({ tracker })
      } else {
        this.setState({ tracker: null })
      }
    })
  }

  render() {
    const { tracker } = this.state

    return (
      <div className="charts-wrapper">
        <ServerColorStateContext.Consumer>
        {
          ({ getColor }) => (
            <CollectorStateContext.Consumer>
            {
              ({ chartData }) => {
                const timeSeries = getTimeSeries(chartData)

                return timeSeries.map(({ id, seriesContainer }) => (
                  <CombinedLineChart
                    key={id}
                    seriesContainer={seriesContainer}
                    title={id}
                    getColor={getColor}

                    tracker={tracker}
                    handleTrackerChanged={this.handleTrackerChanged}

                    onTimeRangeChanged={(timerange) => this.setState({ timerange })}
                    timeRange={this.state.timerange}
                    clearTimeRange={() => this.setState({ timerange: null })}
                  />
                ))
              }
            }
            </CollectorStateContext.Consumer>
          )
        }
        </ServerColorStateContext.Consumer>
      </div>
    )
  }
}
