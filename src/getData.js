require("dotenv").load();
const cosmos = require("@azure/cosmos");
const CosmosClient = cosmos.CosmosClient;

const { endpoint, masterKey, databaseId, containerId } = process.env;

const client = new CosmosClient({ endpoint, auth: { masterKey } });

module.exports = async jobName => {
  const db = await client.database(databaseId);
  const container = db.container(containerId);

  const queryIterator = container.items.query({
    query: `SELECT
      c._ts,c.current_build_duration,c.job_name
      FROM c where
      STARTSWITH(c.job_name, '${jobName}')
      and c.current_build_scheduled_time > '2018-10-10T00:00:00Z'
      and c.current_build_current_result = 'SUCCESS'
      and c.current_step_name = 'buildinfra:aat'
      and STARTSWITH(c.build_url ,'https://build')
      and NOT CONTAINS(c.build_tag, 'Nightly')
      ORDER BY c._ts ASC`
  });

  const { result: docs } = await queryIterator.toArray();
  return docs;
};
