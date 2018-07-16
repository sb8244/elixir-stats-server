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
      const e = this.props.series.atTime(tracker);

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
    const { series } = this.props

    const charts = [
      <LineChart key="line" axis="y" series={series} columns={['value']} style={style} />,
      <ScatterChart key="scatter" axis="y" series={series} columns={['value']} style={style} />,
    ]

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

  render() {
    const { series, title } = this.props
    const timeRange = new TimeRange([series.begin().getTime() - 30000, series.end().getTime() + 30000])

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
          <YAxis id="y" min={series.min() - (series.min() * .05)} max={series.max() + (series.max() * .05)} />
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
    const series = chartData[key]
    return {
      id: key,
      series
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

          return timeSeries.map(({ id, series }) => (
            <CombinedLineChart key={id} series={series} title={id} />
          ))
        }
      }
      </CollectorStateContext.Consumer>
    )
  }
  </CommandHistoryStateContext.Consumer>
)
