const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { Link } = ButtonStyle
const ms = require("ms")

module.exports = {
    name: "messageCreate",

    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {

        const { author, guild, content } = message
        const { user } = client

        if (!guild || author.bot) return
        if (content.includes("@here") || content.includes("@everyone")) return
        if (!content.includes(user.id)) return

        return message.reply({

            embeds: [
                new EmbedBuilder()
                    .setColor("#c5a0c1")
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                    .setDescription(`Ola, você me chamou? Eu sou Nazuna! Prazer em conhecê-lo. Digite \`/\`  clique no meu logotipo para ver todos os meus comandos.\n\nUse \`/ajuda\` para obter uma visão geral sobre os comandos. \n\n*Esta mensagem será apagada em \`10 segundos\`!*`)
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({ text: "Introduction to Nazuna" })
                    .setTimestamp()
            ],

            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setStyle(Link)
                        .setURL("https://discord.com/api/oauth2/authorize?client_id=1021062400696389692&permissions=8&scope=applications.commands%20bot")
                        .setLabel("Invite Me"),

                    new ButtonBuilder()
                        .setStyle(Link)
                        .setURL("https://nazuna.pro")
                        .setLabel("Status"),

                    new ButtonBuilder()
                        .setStyle(Link)
                        .setURL("https://discord.gg/chszUfgVVt")
                        .setLabel("Support")

                )
            ]

        }).then(msg => {

            setTimeout(() => {

                msg.delete().catch((err) => {

                    if (err.code !== 10008) return console.log(err)

                })

            }, ms("10s"))

        })

    }
}