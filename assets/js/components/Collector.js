import React, { Component } from 'react'

import { CollectorStateContext } from './CollectorState'
import { ServerListStateContext } from './ServerListState'

import ChartContainer from './Collector/ChartContainer'
import TextsContainer from './Collector/TextsContainer'

const CHART_TAB = 'charts'
const TEXTS_TAB = 'texts'

export default class Collector extends Component {
  state = {
    selectedTab: CHART_TAB
  }

  render() {
    const { selectedTab } = this.state

    return (
      <div>
        <div className="collector-header">
          <button onClick={() => this.setState({ selectedTab: CHART_TAB })}>Charts</button>
          <button onClick={() => this.setState({ selectedTab: TEXTS_TAB })}>Text Outputs</button>
        </div>
        <div className="collector-view-wrap">
          <ServerListStateContext.Consumer>
          {
            ({ getColor }) => (
              <CollectorStateContext.Consumer>
              {
                ({ chartData, plainTextLogs }) => {
                  if (selectedTab === CHART_TAB) {
                    return <ChartContainer getColor={getColor} chartData={chartData} />
                  } else if (selectedTab === TEXTS_TAB) {
                    return <TextsContainer getColor={getColor} plainTextLogs={plainTextLogs} />
                  }
                }
              }
              </CollectorStateContext.Consumer>
            )
          }
          </ServerListStateContext.Consumer>
        </div>
      </div>
    )
  }
}
