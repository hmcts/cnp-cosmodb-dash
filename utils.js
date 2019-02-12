const { format } = require("date-fns");

exports.getCoordinates = sqSize => index => [
  sqSize * (index % 2),
  sqSize * Math.ceil((index + 1) / 2) - sqSize
];

exports.toHumanDate = attr => d =>
  format(new Date(d[attr] * 1000), "DD/MM/YYYY");

exports.toMinutes = attr => d => (d[attr] / 1000 / 60) << 0;
