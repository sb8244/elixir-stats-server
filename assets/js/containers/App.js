import React, { Component } from 'react'

import ServerList from '../components/ServerList'
import ServerListState from '../components/ServerListState'
import CommandList from '../components/CommandList'
import ApplicationList from '../components/ApplicationList'
import Collector from '../components/Collector'
import CollectorState from '../components/CollectorState'
import CommandHistoryState from '../components/CommandHistoryState'

import '../../css/app.css'
import 'semantic-ui-css/semantic.min.css'

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
    const { channel } = this.props;
    const { selectedApplicationNames } = this.state;

    return (
      <div className="app-container">
        <CommandHistoryState>
          <CollectorState channel={channel}>
            <ServerListState channel={channel}>
              <div className="app-sidebar">
                <ServerList />
              </div>
              <div className="app-content">
                <ApplicationList channel={channel} setApplicationNames={this.setApplicationNames.bind(this)} />
                <CommandList channel={channel} selectedApplicationNames={selectedApplicationNames} />
                <Collector />
              </div>
            </ServerListState>
          </CollectorState>
        </CommandHistoryState>
      </div>
    )
  }
}
