const R = require("ramda");
const { format } = require("date-fns");

const createOutlierFilter = attr => ({ q1, q3 }) => value =>
  value[attr] > q1 * 0.75 && value[attr] < q3 * 1.25;

const calculateQuartiles = attr => data => {
  const q1Index = 0; // because the new results are scarce and smaller. On a bigger dataset, should be: Math.floor(data.length * 0.25);
  const q3Index = Math.ceil(data.length * 0.75);

  return {
    q1: data[q1Index][attr],
    q3: data[q3Index][attr]
  };
};

const sortBy = attr => (a, b) => a[attr] - b[attr];

exports.filterOutliers = attr =>
  R.compose(
    createOutlierFilter(attr),
    calculateQuartiles(attr),
    R.sort(sortBy(attr))
  );

exports.getCoordinates = (colWidth, colHeigh) => index => [
  colHeigh * (index % 2),
  colWidth * Math.ceil((index + 1) / 2) - colWidth
];

exports.toHumanDate = attr => d =>
  format(new Date(d[attr] * 1000), "DD/MM/YYYY");

exports.toMinutes = attr => d => (d[attr] / 1000 / 60) << 0;

exports.kuler = () => [
  (0.8 * Math.random() + 0.2) * 255,
  (0.8 * Math.random() + 0.2) * 255,
  (0.8 * Math.random() + 0.2) * 255
];
