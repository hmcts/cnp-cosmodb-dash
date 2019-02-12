const { equal, deepEqual } = require("assert");
const {
  toMinutes,
  toHumanDate,
  getCoordinates,
  filterOutliers
} = require("./utils");

equal(
  toMinutes("ts")({ ts: 1000000 }),
  16,
  "toMinutes should convert ms to minutes and round it to the next integer"
);

equal(
  toHumanDate("ts")({ ts: 1549988423 }),
  "12/02/2019",
  "toHumanDate should convert seconds to DD/MM/YYYY"
);

deepEqual(Array.from({ length: 8 }, (v, i) => i).map(getCoordinates(3, 3)), [
  [0, 0],
  [3, 0],
  [0, 3],
  [3, 3],
  [0, 6],
  [3, 6],
  [0, 9],
  [3, 9]
]);

deepEqual(Array.from({ length: 8 }, (v, i) => i).map(getCoordinates(4, 4)), [
  [0, 0],
  [4, 0],
  [0, 4],
  [4, 4],
  [0, 8],
  [4, 8],
  [0, 12],
  [4, 12]
]);

const dataSet = [
  { d: 7 },
  { d: 3 },
  { d: 5 },
  { d: 8 },
  { d: 30 }, // Outlier
  { d: 2 },
  { d: 10 },
  { d: 5 }
];

const expectedSet = [
  { d: 7 },
  { d: 3 },
  { d: 5 },
  { d: 8 },
  { d: 2 },
  { d: 10 },
  { d: 5 }
];

deepEqual(dataSet.filter(filterOutliers("d")(dataSet)), expectedSet);

process.stdout.write("Unit tests OK\n");
process.exit(0);
