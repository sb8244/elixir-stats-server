import React from 'react'

import { CollectorStateContext } from './CollectorState'
import { ServerListStateContext } from './ServerListState'

import ChartContainer from './Collector/ChartContainer'
import TextsContainer from './Collector/TextsContainer'

export default () => (
  <div className="charts-wrapper">
    <ServerListStateContext.Consumer>
    {
      ({ getColor }) => (
        <CollectorStateContext.Consumer>
        {
          ({ chartData, plainTextLogs }) => ([
            <ChartContainer key='chart-container' getColor={getColor} chartData={chartData} />,
            <TextsContainer key='texts-container' getColor={getColor} plainTextLogs={plainTextLogs} />,
          ])
        }
        </CollectorStateContext.Consumer>
      )
    }
    </ServerListStateContext.Consumer>
  </div>
)
