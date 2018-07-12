import React, { Component } from 'react'
import sortBy from 'lodash/sortBy'

import { ServerListStateContext } from './ServerListState'

export default () => (
  <ServerListStateContext.Consumer>
  {
    (servers) => (
      <div className="server-list-wrapper">
        <h1>Servers ({servers.length})</h1>
        <ul>
          {
            sortBy(servers, 'server_id').map(({ server_id }) => (
              <li key={server_id}>{server_id}</li>
            ))
          }
        </ul>
      </div>
    )
  }
  </ServerListStateContext.Consumer>
)
