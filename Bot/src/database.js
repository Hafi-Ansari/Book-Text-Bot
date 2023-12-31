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

async function phraseSearch(query) {
  let { body } = await client.search({
    index: "bot-search-text",
    body: {
      query: {
        match_phrase: { text: query },
      },
      sort: [{ order: "asc" }],
      size: 100
    },
  });

  return body.hits.hits;
}

async function fuzzySearch(query) {
  const { body } = await client.search({
    index: "bot-search-text",
    body: {
      query: {
        match: {
          text: {
            query: query,
            operator: "and",
            fuzziness: "AUTO",
          },
        },
      },
      sort: [
        { order: "asc" }, 
      ],
      size: 100
    },
  });

  let results = body.hits.hits;
  return results;
}

async function fullTextSearch(query) {
  let { body } = await client.search({
    index: "bot-search-text",
    body: {
      query: {
        match: { text: query },
      },
      sort: [{ order: "asc" }],
      size: 100
    },
  });

  return body.hits.hits;
}

async function proximitySearch(query) {
  let { body } = await client.search({
    index: "bot-search-text",
    body: {
      query: {
        match_phrase: {
          text: {
            query: query,
            slop: 10, 
          },
        },
      },
      sort: [{ order: "asc" }],
      size: 100
    },
  });

  return body.hits.hits;
}

module.exports = {
  phraseSearch,
  fuzzySearch,
  proximitySearch,
  fullTextSearch,
};
