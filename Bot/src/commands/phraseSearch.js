// commands/search.js

const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const { phraseSearch } = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("phrase-search")
    .setDescription("User knows an exact quote from a book and wants to find where it comes from.")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The search input")
        .setRequired(true)
    ),
  async execute(interaction) {
    const userInput = interaction.options.getString("input");

    phraseSearch(userInput)
      .then((results) => {
        if (results.length === 0) {
          interaction.reply("Couldn't find anything. Sorry.");
          return;
        } else if (results.length === 100) {
          interaction.reply("Too many results. Try something more specific.");
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

            interaction
              .reply({
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
          interaction.reply(joinedTexts);
        }
      })
      .catch((error) => {
        console.error("Error during search:", error);
        interaction.reply("Sorry, something went wrong with your search.");
      });
  },
};
