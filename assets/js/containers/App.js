import React, { Component } from 'react'
import ServerList from '../components/ServerList'
import ServerListState from '../components/ServerListState'
import CommandList from '../components/CommandList'
import ApplicationList from '../components/ApplicationList'

import Collector from '../components/Collector'
import CollectorState from '../components/CollectorState'

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
      <div>
        <ServerListState channel={channel}>
          <ServerList />
        </ServerListState>

        <ApplicationList channel={channel} setApplicationNames={this.setApplicationNames.bind(this)} />
        <CommandList channel={channel} selectedApplicationNames={selectedApplicationNames} />

        <CollectorState channel={channel}>
          <Collector />
        </CollectorState>
      </div>
    )
  }
}
