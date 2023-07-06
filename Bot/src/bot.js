require("dotenv").config({ path: "../.env" });
const fs = require("fs");
const commands = require('./commands/commands');

const {
  phraseSearch,
  fuzzySearch,
  proximitySearch,
  fullTextSearch,
} = require("./database");

const Discord = require("discord.js");

const discordToken = process.env.DISCORD_TOKEN;

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
  channel.send("hello world");
});

Client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  let userInput = message.content;

  phraseSearch(userInput)
    .then((results) => {
      if (results.length === 100) {
        message.channel.send("Too many results. Try something more specific.");
        return;
      }

      let resultTexts = results.map((result) => {
        let source = result._source;
        return `Book: ${source.book_title}, Chapter: ${source.chapter_number}\n${source.text}`;
      });

      let joinedTexts = resultTexts.join("\n\n");

      if (joinedTexts.length > 2000) {
        fs.writeFile("results.txt", joinedTexts, function (err) {
          if (err) throw err;

          message.channel
            .send({
              files: [
                {
                  attachment: "results.txt",
                  name: "results.txt",
                },
              ],
            })
            .then(() => {
              // after sending the file
              fs.unlink("./results.txt", (err) => {
                if (err) {
                  console.error("Error deleting file:", err);
                  return;
                }
              });
            })
            .catch((error) => {
              console.error("Error sending file:", error);
            });
        });
      } else {
        message.send(joinedTexts);
      }
    })
    .catch((error) => {
      console.error("Error during search:", error);
      message.reply("Sorry, something went wrong with your search.");
    });
});



Client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = commands[interaction.commandName];

  if (!command) return;

  try {
      await command.execute(interaction);
  } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

Client.login(discordToken);
