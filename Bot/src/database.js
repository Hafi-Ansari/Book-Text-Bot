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

async function search(query) {
    // Attempt a match_phrase query first
    let { body } = await client.search({
      index: "new-search-text",
      body: {
        query: {
          match_phrase: { text: query }, // This will look for the exact phrase in the 'text' field
        },
      },
    });
  
    let results = ["Exact Matches:", body.hits.hits];
  
    // If no results were found with the match_phrase query, perform a fuzzy match query
    if (results[1].length === 0) {
      const { body } = await client.search({
        index: "new-search-text",
        body: {
          query: {
            match: {
              text: {
                query: query,
                fuzziness: "AUTO", // This will look for fuzzy matches in the 'text' field
              },
            },
          },
        },
      });
  
      results = ["Couldn't Find Exact Matches. Here are some similar results:", body.hits.hits];
    }
  
    return results;
  }
  
  // Now you can use the search function like this:
  search("HellDiver")
    .then((results) => {
      // Do something with the search results
      console.log(results[0]);
      console.log(results[1])
    })
    .catch(console.log);
  