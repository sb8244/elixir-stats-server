import React, { Component } from 'react'
import { Checkbox } from 'semantic-ui-react'

export default class ApplicationList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      applications: [],
      selected: []
    }
  }

  componentDidMount() {
    const { channel } = this.props

    channel.push("application_names", {})
      .receive('ok', (data) => this.setState({ applications: data.application_names }))
  }

  handleSelection(name) {
    return () => {
      const { selected } = this.state
      let newSelected

      if (selected.includes(name)) {
        newSelected = selected.filter((testName) => testName !== name)
      } else {
        newSelected = selected.concat([name])
      }

      this.props.setApplicationNames(newSelected)
      this.setState({ selected: newSelected })
    }
  }

  render() {
    const { applications, selected } = this.state

    return (
      <div className="application-list-wrapper">
        <h2>Applications ({applications.length})</h2>
        <ul>
          {
            applications.map((name) => (
              <li key={name}>
                <Checkbox type="checkbox" checked={selected.includes(name)} onChange={this.handleSelection(name)} label={name} />
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}
