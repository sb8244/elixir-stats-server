import React from 'react'

import { CollectorStateContext } from './CollectorState'

export default () => (
  <CollectorStateContext.Consumer>
  {
    (collected) => (
      <div>
        {JSON.stringify(collected)}
      </div>
    )
  }
  </CollectorStateContext.Consumer>
)
