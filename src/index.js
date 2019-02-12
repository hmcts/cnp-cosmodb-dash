const { getData, formatData } = require('./data')
const render = require('./render')

/**
 * Possible values for stepName:
 * - dockerbuild
 * - buildinfra:aat
 * - etc.
 *
 */
const jobNames = [
  {
    jobName: 'HMCTS_CDM/ccd-case-print-service/master',
    stepName: 'buildinfra:aat',
  },
  {
    jobName: 'HMCTS_CMC/cmc-legal-rep-frontend/master',
    stepName: 'buildinfra:aat',
  },
  { jobName: 'HMCTS_CDM/ccd-admin-web/master', stepName: 'buildinfra:aat' },
  {
    jobName: 'HMCTS_CDM/ccd-case-management-web/master',
    stepName: 'buildinfra:aat',
  },
]

const main = async () => {
  const dataSet = await Promise.all(jobNames.map(getData))
  const data = dataSet.map(formatData)

  render(data)
}

main().catch(console.error)
