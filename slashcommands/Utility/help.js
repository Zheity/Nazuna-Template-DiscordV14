const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const fs = require('fs')

module.exports = {
    name: 'ajuda',
    description: 'Comando de ajuda',
    category: "Utility",

    run: async (client, interaction) => {

        const optionsArr = []
        const slashCommands = await client.application.commands.fetch();

        const commandsFolder = fs.readdirSync('./slashcommands')
        for (const category of commandsFolder) {
            optionsArr.push({ label: `${category}`, description: `Veja os comandos ${category}`, value: `${category}` })
        }

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setLabel("Website")
            .setStyle(ButtonStyle.Link)
            .setURL("https://nazuna.pro"),
            new ButtonBuilder()
              .setLabel("Vote")
              .setStyle(ButtonStyle.Link)
              .setURL("https://top.gg/bot/1021062400696389692/vote"),
            new ButtonBuilder()
              .setLabel("ToS")
              .setStyle(ButtonStyle.Link)
              .setURL("https://discord.com/guidelines"),
            new ButtonBuilder()
              .setLabel("Privacy")
              .setStyle(ButtonStyle.Link)
              .setURL("https://discord.com/guidelines")
          );

        const embed = new EmbedBuilder()
        .setTitle('Comando de ajuda')
        .setDescription('Selecione uma opção para obter a lista de comandos. Apenas uma opção pode ser \n selecionada.')
        .setImage("https://i.imgur.com/kSOjdpa.jpg")
        .addFields(
            {
              name: `<:categories:1056920162294575104> Total de categorias de comando`,
              value: `<:Purpleponto:1056918571327946842> ${commandsFolder.length}`,
              inline: true,
            },
            {
              name: `<:slashcommands:1056910885735641178> Comandos Global Slash`,
              value: `<:Purpleponto:1056918571327946842> ${slashCommands.size}`,
              inline: true,
            }
          )
        .setColor("#c5a0c1");


        const menu = new ActionRowBuilder()
        .setComponents(
            new StringSelectMenuBuilder()
            .setCustomId('menu-help')
            .addOptions(optionsArr)
            .setPlaceholder("Selecione uma categoria")
        )

        await interaction.reply({ embeds: [ embed], components: [menu, Buttons] }).then(async (msg) => {
            const filter = (m) => m.user.id == interaction.user.id
            const collector = msg.createMessageComponentCollector({ filter, time: 60000 })

            collector.on('collect', async (i) => {
                i.deferUpdate();
                const selected = i.values[0]
                const commandsArr = []
                const commandsFiles = fs.readdirSync(`./slashcommands/${selected}`)

                for (const command of commandsFiles) {
                    if (command.endsWith('.js')) {
                        commandsArr.push(command.replace(/.js/g, ''))
                    }
                }

                embed.setDescription(`Veja os comandos da categoria ${selected}`)
                embed.setFields([
                    { name: 'Comandos (/)', value: `\`\`\`${commandsArr.join(', ')}\`\`\`` }
                ])

                interaction.editReply({ embeds: [embed] })
            })
        })

    }
}