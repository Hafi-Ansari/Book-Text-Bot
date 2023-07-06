const { SlashCommandBuilder } = require("@discordjs/builders");

const commands = {
  echo: {
    data: new SlashCommandBuilder()
      .setName("echo")
      .setDescription("Replies with your input!")
      .addStringOption((option) =>
        option
          .setName("input")
          .setDescription("Input to echo back")
          .setRequired(true)
      ),
    async execute(interaction) {
      // get the user input from the command options
      const userInput = interaction.options.getString("input");
      await interaction.reply(userInput);
    },
  },
  // Add more commands here...
};

module.exports = commands;
