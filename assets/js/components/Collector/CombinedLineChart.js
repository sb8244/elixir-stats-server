import React, { Component } from 'react'
import { Charts, ChartContainer, ChartRow, Resizable, YAxis, LineChart, ScatterChart, styler } from "react-timeseries-charts";
import { TimeRange } from "pondjs";

export default class CombinedLineChart extends Component {
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
        <ScatterChart key="scatter" axis="y" series={series} columns={['value']} style={style} />,
      ]
    })

    return charts
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
      <Resizable>
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
