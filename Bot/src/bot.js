const { phraseSearch, fuzzySearch, proximitySearch, fullTextSearch } = require('./database');

fuzzySearch("haemanthus paradise")
  .then((results) => {
    console.log(results);
  })
  .catch(console.log);