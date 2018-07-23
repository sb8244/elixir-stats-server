import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

import { CollectorStateContext } from './CollectorState'
import { ServerListStateContext } from './ServerListState'

import ChartContainer from './Collector/ChartContainer'
import TextsContainer from './Collector/TextsContainer'

import observer from './observer'

export const CHART_TAB = 'charts'
export const TEXTS_TAB = 'texts'
const VALID_TABS = [CHART_TAB, TEXTS_TAB]

export default class Collector extends Component {
  state = {
    selectedTab: CHART_TAB
  }

  componentDidMount() {
    this.tabListener = observer.subscribe('collectorTabChange', (selectedTab) => {
      if (VALID_TABS.includes(selectedTab)) {
        this.setState({
          selectedTab
        })
      }
    })
  }

  componentWillUnmount() {
    this.tabListener.unsubscribe()
  }

  render() {
    const { selectedTab } = this.state

    return (
      <div>
        <Menu>
          <Menu.Item
            name='charts'
            active={selectedTab === CHART_TAB}
            onClick={() => this.setState({ selectedTab: CHART_TAB })}
          >
            Charts
          </Menu.Item>
          <Menu.Item
            name='texts'
            active={selectedTab === TEXTS_TAB}
            onClick={() => this.setState({ selectedTab: TEXTS_TAB })}
          >
            Text Logs
          </Menu.Item>
        </Menu>
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
