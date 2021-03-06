import React, { Component } from 'react'
import { Checkbox } from 'semantic-ui-react'
import sortBy from 'lodash/sortBy'

import { ServerListStateContext } from './ServerListState'

export default () => (
  <ServerListStateContext.Consumer>
  {
    ({ getColor, selectedServerIds, servers, setServerSelected }) => (
      <div className="server-list-wrapper">
        <h2>Servers ({selectedServerIds.length || 'all'} / {servers.length})</h2>
        <ul>
          {
            sortBy(servers, 'server_id').map(({ server_id }) => (
              <li key={server_id}>
                <Checkbox
                  checked={selectedServerIds.includes(server_id)}
                  label={
                    <label>
                      <span className="color-legend-block" style={{background: getColor(server_id)}} title={server_id} />
                      {server_id}
                    </label>
                  }
                  onChange={(evt, { checked }) => setServerSelected(server_id, checked)}
                />
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
  </ServerListStateContext.Consumer>
)
