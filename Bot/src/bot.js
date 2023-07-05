require("dotenv").config();
const { phraseSearch, fuzzySearch, proximitySearch, fullTextSearch } = require('./database');
const Discord = require("discord.js");

const discordToken = process.env.DISCORD_RPS_TOKEN;

const Client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.Guilds,
  ],
  partials: [
    Discord.Partials.Message,
    Discord.Partials.Channel,
    Discord.Partials.GuildMember,
    Discord.Partials.User,
    Discord.Partials.GuildScheduledEvent,
  ],
});


Client.on("ready", (client) => {
  const channel = Client.channels.cache.get(process.env.CHANNEL_ID); 
  channel.send('hello world');
});

Client.login(discordToken);


/*

fuzzySearch("haemanthus paradise")
  .then((results) => {
    console.log(results);
  })
  .catch(console.log);

*/