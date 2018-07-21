import React, { Component } from 'react'
import sortBy from 'lodash/sortBy'

import { ServerListStateContext } from './ServerListState'

export default () => (
  <ServerListStateContext.Consumer>
  {
    ({ getColor, servers }) => (
      <div className="server-list-wrapper">
        <h1>Servers ({servers.length})</h1>
        <ul>
          {
            sortBy(servers, 'server_id').map(({ server_id }) => (
              <li key={server_id}>
                <span className="color-legend-block" style={{background: getColor(server_id)}} title={server_id} />
                <span>{server_id}</span>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
  </ServerListStateContext.Consumer>
)
