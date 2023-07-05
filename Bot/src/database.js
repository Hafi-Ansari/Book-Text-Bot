require('dotenv').config({ path: '../.env' });
const { Client } = require('@elastic/elasticsearch')

const client = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID
 },
  auth: {
    username: 'elastic',
    password: process.env.ELASTIC_PASSWORD
  }
})

async function search(query) {
  const { body } = await client.search({
    index: 'search-text', // The name of your Elasticsearch index
    body: {
      query: {
        match: { text: query } // Assuming 'text' is the field you want to search
      }
    }
  })

  return body.hits.hits; // This will be an array of search results
}

// Now you can use the search function like this:
search('HellDiver')
  .then(results => {
    // Do something with the search results
    console.log(results);
  })
  .catch(console.log);
