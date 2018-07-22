import React from 'react'

import { CollectorStateContext } from './CollectorState'
import { ServerListStateContext } from './ServerListState'

import ChartContainer from './Collector/ChartContainer'

export default () => (
  <div className="charts-wrapper">
    <ServerListStateContext.Consumer>
    {
      ({ getColor }) => (
        <CollectorStateContext.Consumer>
        {
          ({ chartData }) => ([
            <ChartContainer key='chart-container' getColor={getColor} chartData={chartData} />
          ])
        }
        </CollectorStateContext.Consumer>
      )
    }
    </ServerListStateContext.Consumer>
  </div>
)
