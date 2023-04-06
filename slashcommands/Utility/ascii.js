const { Client, ChatInputCommandInteraction } = require("discord.js")
const figlet = require('figlet')

module.exports = {
    name: "ascii",
    description: "Gerar asci.",
    category: "Utility",
    options: [
        {
            name: "texto",
            description: "O texto para fazer ascii",
            type: 3,
            required: true,
        },
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    run: async(client, interaction) => {

        const text = interaction.options.getString("texto");

        figlet.text(text, (err, data) => {
            if (err) return console.log(err)
            if (data.length > 2000) return interaction.reply({ content: "Forneça um texto com menos de 2.000 caracteres!", ephemeral: true })
            interaction.reply({ content: '```\n' + data + '```' })
        })
        
    }
}