import React, { Component } from 'react'

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
      <ul>
        {
          applications.map((name) => (
            <li key={name}>
              <input type="checkbox" checked={selected.includes(name)} onChange={this.handleSelection(name)} />
              &nbsp;
              {name}
            </li>
          ))
        }
      </ul>
    )
  }
}
