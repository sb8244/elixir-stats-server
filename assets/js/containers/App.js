import React, { Component } from 'react'
import ServerList from '../components/ServerList'
import ServerListState from '../components/ServerListState'

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: true
    }
  }

  render() {
    return (
      <div>
        <ServerListState channel={this.props.channel}>
          <ServerList />
        </ServerListState>
      </div>
    )
  }
}
