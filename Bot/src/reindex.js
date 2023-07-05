require("dotenv").config({ path: "../.env" });
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID,
  },
  auth: {
    username: "elastic",
    password: process.env.ELASTIC_PASSWORD,
  },
});

async function createIndexWithNewMapping() {
  try {
    await client.indices.create({
      index: 'bot-search-text',
      body: {
        mappings: {
          properties: {
            text: {
              type: 'text',
              index_options: 'positions'
            }
          }
        }
      }
    });
    console.log('New index created with updated mapping');
  } catch (error) {
    console.error('Error creating new index:', error);
  }
}

async function reindexData() {
  try {
    await client.reindex({
      body: {
        source: {
          index: 'search-text'
        },
        dest: {
          index: 'bot-search-text'
        }
      }
    });
    console.log('Data reindexed successfully');
  } catch (error) {
    console.error('Error reindexing data:', error);
  }
}

async function updateAndReindex() {
  await createIndexWithNewMapping();
  await reindexData();
}

updateAndReindex();
