// deploy-commands.js

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config({ path: "../.env" });

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

// Dynamically import all command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = commandFiles.map(file => require(`./commands/${file}`));

const commandsData = commands.map(command => command.data.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commandsData },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
