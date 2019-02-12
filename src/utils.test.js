const { equal, deepEqual } = require('assert')
const { toMinutes, toHumanDate, genCoordsFrom } = require('./utils')

equal(
  toMinutes('ts')({ ts: 1000000 }),
  16,
  'toMinutes should convert ms to minutes and round it to the next integer'
)

equal(
  toHumanDate('ts')({ ts: 1549988423 }),
  '12/02/2019',
  'toHumanDate should convert seconds to DD/MM/YYYY'
)

deepEqual(Array.from({ length: 8 }, (v, i) => i).map(genCoordsFrom(3, 3)), [
  [0, 0],
  [3, 0],
  [0, 3],
  [3, 3],
  [0, 6],
  [3, 6],
  [0, 9],
  [3, 9],
])

deepEqual(Array.from({ length: 8 }, (v, i) => i).map(genCoordsFrom(4, 4)), [
  [0, 0],
  [4, 0],
  [0, 4],
  [4, 4],
  [0, 8],
  [4, 8],
  [0, 12],
  [4, 12],
])

process.stdout.write('✔  Utils unit tests\n')
process.exit(0)
