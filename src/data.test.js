const { deepEqual } = require('assert')
const { createOutliersFilter } = require('./data')

const dataSet = [
  { d: 7 },
  { d: 3 },
  { d: 5 },
  { d: 8 },
  { d: 30 }, // <:::::[]=¤ (▀̿̿Ĺ̯̿̿▀̿ ̿) Outlier
  { d: 2 },
  { d: 10 },
  { d: 5 },
]

const expectedSet = [
  { d: 7 },
  { d: 3 },
  { d: 5 },
  { d: 8 },
  { d: 2 },
  { d: 10 },
  { d: 5 },
]

deepEqual(dataSet.filter(createOutliersFilter('d')(dataSet)), expectedSet)

process.stdout.write('✔  Data unit tests\n')
process.exit(0)
