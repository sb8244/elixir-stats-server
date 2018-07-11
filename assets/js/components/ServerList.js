import React, { Component } from 'react'

import { ServerListStateContext } from './ServerListState'

export default () => (
  <ServerListStateContext.Consumer>
  {
    (servers) => (
      <div>
        <h1>Servers ({servers.length})</h1>
        <ul>
          {
            servers.map(({ server_id }) => (
              <li key={server_id}>{server_id}</li>
            ))
          }
        </ul>
      </div>
    )
  }
  </ServerListStateContext.Consumer>
)
