import React, { Component } from 'react'

import ServerList from '../components/ServerList'
import ServerListState from '../components/ServerListState'
import CommandList from '../components/CommandList'
import ApplicationList from '../components/ApplicationList'
import Collector from '../components/Collector'
import CollectorState from '../components/CollectorState'
import CommandHistoryState from '../components/CommandHistoryState'
import CommandArgumentState from '../components/CommandArgumentState'
import Socket from '../components/Socket'

import '../../css/app.css'

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedApplicationNames: []
    }
  }

  setApplicationNames(applicationNames) {
    this.setState({
      selectedApplicationNames: applicationNames
    })
  }

  render() {
    const { selectedApplicationNames } = this.state;

    return (
      <div className="app-container">
        <Socket render={({ channel }) => (
          <CommandArgumentState>
            <CommandHistoryState>
              <CollectorState channel={channel}>
                <ServerListState channel={channel}>
                  <div className="app-sidebar">
                    <ServerList />
                    <ApplicationList channel={channel} setApplicationNames={this.setApplicationNames.bind(this)} />
                    <CommandList channel={channel} selectedApplicationNames={selectedApplicationNames} />
                  </div>
                  <div className="app-content">
                    <Collector />
                  </div>
                </ServerListState>
              </CollectorState>
            </CommandHistoryState>
          </CommandArgumentState>
        )} />
      </div>
    )
  }
}
