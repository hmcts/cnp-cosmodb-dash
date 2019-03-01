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
    stepName: 'dockerbuild',
  },
  {
    jobName: 'HMCTS_CMC/cmc-citizen-frontend/master',
    stepName: 'dockerbuild',
  },
  { jobName: 'HMCTS_CDM/ccd-admin-web/master', stepName: 'dockerbuild' },
  {
    jobName: 'HMCTS_Probate/probate-frontend/master',
    stepName: 'dockerbuild',
  },
]

const main = async () => {
  const dataSet = await Promise.all(jobNames.map(getData))
  const data = dataSet.map(formatData)

  render(data)
}

main().catch(console.error)
