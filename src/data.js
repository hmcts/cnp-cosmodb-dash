require('dotenv').load()
const { compose, sort } = require('ramda')
const cosmos = require('@azure/cosmos')
const CosmosClient = cosmos.CosmosClient
const { toMinutes, toHumanDate } = require('./utils')
const { endpoint, masterKey, databaseId, containerId } = process.env
const client = new CosmosClient({ endpoint, auth: { masterKey } })

/**
 * Performs a documents query on CosmoDB
 */
const getData = async ({ jobName, stepName }) => {
  const db = await client.database(databaseId)
  const container = db.container(containerId)
  const queryIterator = container.items.query({
    query: `
      SELECT c._ts,c.current_build_duration,c.job_name
      FROM c where
      STARTSWITH(c.job_name, '${jobName}')
      and c.current_build_scheduled_time > '2018-11-10T00:00:00Z'
      and c.current_build_current_result = 'SUCCESS'
      and c.current_step_name = '${stepName}'
      and STARTSWITH(c.build_url ,'https://build')
      and NOT CONTAINS(c.build_tag, 'Nightly')
      ORDER BY c._ts ASC
    `,
  })
  const { result: rawData } = await queryIterator.toArray()
  return {
    rawData,
    jobName,
    stepName,
  }
}

/**
 * Filter predicate using the quartiles
 */
const isInQ2Quartile = attr => ({ q1, q3 }) => value =>
  value[attr] > q1 * 0.75 && value[attr] < q3 * 1.25

/**
 * Compute q1 and q3 quartiles from ordered data
 *
 * Notice that because the new results are scarce and in small numbers
 * we do not take in account the smaller quartile.
 */
const getQuartiles = attr => data => {
  const q1Idx = 0 // On a bigger dataset, should be: Math.floor(data.length * 0.25);
  const q3Idx = Math.ceil(data.length * 0.75)

  return {
    q1: data[q1Idx][attr],
    q3: data[q3Idx][attr],
  }
}

const by = attr => (a, b) => a[attr] - b[attr]

/**
 * Filter outliers predicate
 */
const createOutliersFilter = attr =>
  compose(
    isInQ2Quartile(attr),
    getQuartiles(attr),
    sort(by(attr))
  )

/**
 * Formats data in a way that can be ingested by a render function
 */
const formatData = ({ rawData, jobName, stepName }) => {
  const outliersFilter = createOutliersFilter('current_build_duration')
  const filteredData = rawData.filter(outliersFilter(rawData))
  return {
    data: {
      x: filteredData.map(toHumanDate('_ts')),
      y: filteredData.map(toMinutes('current_build_duration')),
    },
    jobName,
    stepName,
  }
}

module.exports = {
  getData,
  formatData,
  createOutliersFilter,
}
