const blessed = require('blessed')
const contrib = require('blessed-contrib')
const { genCoordsFrom, kuler } = require('./utils')
const screen = blessed.screen()

// Screen layout properties
const rows = 12
const cols = 12
const rowSpan = 6
const colSpan = 6
const grid = new contrib.grid({
  rows,
  cols,
  screen,
  hideBorder: true,
})

const generateCoord = genCoordsFrom(rowSpan, colSpan)

const shortJobNameRegex = /\/(.*)\//
const labelTpl = (stepName, jobName) =>
  `Build duration till ${stepName} in min. (${
    jobName.match(shortJobNameRegex)[1]
  })`

const lineStyle = { line: 'white', text: 'white', baseline: 'white' }

const setLineGraph = ({ jobName, data, stepName }, index) => {
  const [x, y] = generateCoord(index)

  const line = grid.set(x, y, colSpan, rowSpan, contrib.line, {
    style: { ...lineStyle, line: kuler() },
    label: labelTpl(stepName, jobName),
    showNthLabel: 5,
  })
  screen.append(line) // must append before setting data
  line.setData([data])
}

const render = data => {
  data.forEach(setLineGraph)

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0)
  })
  screen.render()
}

module.exports = render
