require("dotenv").config({ path: "../.env" });
const fs = require("fs");
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

// Create a new Collection to store commands
Client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Dynamically import all command files
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  Client.commands.set(command.data.name, command);
}


Client.on("ready", (client) => {
  const channel = Client.channels.cache.get(process.env.CHANNEL_ID);
});


Client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = Client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

Client.login(discordToken);
