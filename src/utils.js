const { format } = require("date-fns");

exports.getCoordinates = (colWidth, colHeigh) => index => [
  colHeigh * (index % 2),
  colWidth * Math.ceil((index + 1) / 2) - colWidth
];

exports.toHumanDate = attr => d =>
  format(new Date(d[attr] * 1000), "DD/MM/YYYY");

exports.toMinutes = attr => d => (d[attr] / 1000 / 60) << 0;
