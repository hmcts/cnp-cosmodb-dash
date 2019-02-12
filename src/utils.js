const { format } = require('date-fns')

/**
 * Generate grid coordinates
 */
const genCoordsFrom = (colWidth, colHeigh) => index => [
  colHeigh * (index % 2),
  colWidth * Math.ceil((index + 1) / 2) - colWidth,
]

/**
 * Timestamp to human-readable date
 */
const toHumanDate = attr => d => format(new Date(d[attr] * 1000), 'DD/MM/YYYY')

/**
 * ms to minutes
 */
const toMinutes = attr => d => (d[attr] / 1000 / 60) << 0

/**
 * Random bright color
 */
const kuler = () => [
  (0.8 * Math.random() + 0.2) * 255,
  (0.8 * Math.random() + 0.2) * 255,
  (0.8 * Math.random() + 0.2) * 255,
]

module.exports = {
  toHumanDate,
  toMinutes,
  genCoordsFrom,
  kuler,
}
