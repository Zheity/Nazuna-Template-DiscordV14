const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "ping",
    description: "Veja a latência do bot",
    aliases: ['latency'],
    run: async(client, message) => {

        let PingEmbed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`${client.ws.ping}ms.`)

        message.reply({ embeds: [PingEmbed], ephemeral: true, allowedMentions: { repliedUser: false } })    

    }
}