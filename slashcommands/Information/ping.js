const { EmbedBuilder, ApplicationCommandType } = require("discord.js")

module.exports = {
    name: "ping",
    description: "Veja a latência do bot",
	type: ApplicationCommandType.ChatInput,
	category: "Information",
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.Message} interaction
     */

    run: async(client, interaction) => {

        const ping = Math.round(client.ws.ping)
        const gateway = Date.now() - interaction.createdTimestamp
          const msg = await interaction.reply({embeds: [
              new EmbedBuilder()
              .setColor("#9400d3")
              .setDescription(`**Estou calculando o ping, por favor aguarde**`)
          ]})
          setTimeout(() => {
              interaction.editReply({embeds: [
                  new EmbedBuilder()
                  .setColor("#4D4DFF")
                  .setDescription(`**Estou calculando o ping, por favor aguarde.**`)
              ]})
          }, 1000)
      
          setTimeout(() => {
              interaction.editReply({embeds: [
                  new EmbedBuilder()
                  .setColor("#ffd700")
                  .setDescription(`**Estou calculando o ping, por favor aguarde..**`)
              ]})
          }, 2000)
          setTimeout(() => {
              interaction.editReply({embeds: [
                  new EmbedBuilder()
                  .setColor("#000000")
                  .setDescription(`**Estou calculando o ping, por favor aguarde...**`)
              ]})
          }, 3000)
          setTimeout(() => {
            interaction.editReply({embeds: [
              new EmbedBuilder()
                .setColor("#9400d3")
                .setDescription(`**Estou calculando o ping, por favor aguarde.**`)
            ]})
        }, 4000)
        setTimeout(() => {
          interaction.editReply({embeds: [
              new EmbedBuilder()
              .setColor("#ffd700")
              .setDescription(`**Estou calculando o ping, por favor aguarde..**`)
          ]})
      }, 5000)
      setTimeout(() => {
        interaction.editReply({embeds: [
          new EmbedBuilder()
            .setColor("#000000")
            .setDescription(`**Estou calculando o ping, por favor aguarde...**`)
        ]})
    }, 6000)
          setTimeout(() => {
              interaction.editReply({embeds: [
                  new EmbedBuilder()
                  .setColor("ffasfa")
                  .setDescription(`*📌 | Ping (latency): \`${ping}\` ms\n\n⏰ | Gateway Ping: \`${gateway}\` ms*`)
              ]})
          }, 8000)

    }
}