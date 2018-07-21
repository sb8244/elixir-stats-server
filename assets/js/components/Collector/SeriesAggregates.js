import React from 'react'

function renderRow() {
  return ({ currentValue, average, max, min, name, color }) => (
    <div key={name} className="series-aggregates">
      <div className="color-legend-block" style={{background: color}} title={name} />
      <div className="series-aggregates__value">val: {currentValue || "-"}</div>
      <div className="series-aggregates__value">avg: {average || "-"}</div>
      <div className="series-aggregates__value">min: {min || "-"}</div>
      <div className="series-aggregates__value">max: {max || "-"}</div>
    </div>
  )
}

export default ({ getColor, seriesContainer, timeRange, tracker }) => {
  const rows = Object.keys(seriesContainer).map((serverId) => {
    const series = seriesContainer[serverId]
    const row = {
      currentValue: null,
      average: null,
      max: null,
      min: null,
      name: serverId,
      color: getColor(serverId)
    }

    let cropped = series
    if (timeRange) {
      cropped = series.crop(timeRange)
    }

    const avg = cropped.avg('value')
    const max = cropped.max('value')
    const min = cropped.min('value')

    if (avg) { row.average = avg.toFixed(1) }
    if (max) { row.max = max.toFixed(1) }
    if (min) { row.min = min.toFixed(1) }
    if (tracker) {
      const trackerEvent = series.atTime(tracker)
      row.currentValue = trackerEvent.get('value')
    }

    return row
  })

  return <div className="series-aggregates-wrapper">{rows.map(renderRow())}</div>
}
