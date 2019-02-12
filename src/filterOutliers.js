const R = require("ramda");

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

const filterOutliers = attr =>
  R.compose(
    createOutlierFilter(attr),
    calculateQuartiles(attr),
    R.sort(sortBy(attr))
  );

module.exports = filterOutliers;
