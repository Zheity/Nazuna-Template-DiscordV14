const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const mal = require("mal-scraper");

module.exports = {
    name: 'anime',
    description: '💮 Pesquise informações sobre Anime por nome próprio',
    options: [
        {
            name: "nome",
            description: "Nome do anime.",
            type: 3,
            required: true
        },
    ],

    run: async (client, interaction) => {

        //const search = args.join(" ");
        let search = interaction.options.getString("nome")
        mal.getInfoFromName(search).then((data) => {
          const embed = new EmbedBuilder()
           .setAuthor({ name: `Resultado da pesquisa da Minha Lista de Animes para ${search}` })
           .setImage(data.picture)
           .setColor("#5865F2")
           .addFields(
             { name: 'English Title', value: `${data.englishTitle || "None!"}`, },
             { name: 'Japanese Title', value: `${data.japaneseTitle || "None!"}`, },
             { name: 'Type', value: `${data.type || "N/A!"}`, },
             { name: 'Episodes', value: `${data.episodes || "N/A!"}`, },
             { name: 'Score', value: `${data.score || "N/A!"}`, },
             { name: 'Rating', value: `${data.rating || "N/A!"}`, },
             { name: 'Aired', value: `${data.aired || "N/A!"}`, },
             { name: 'Scored by', value: `${data.scoreStats || "N/A!"}`, },
           )
           .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({
             dynamic: true,
             format: "png",
             size: 2048,
            }),
           })
           .setTimestamp();
          const row = new ActionRowBuilder()
           .addComponents(
            new ButtonBuilder()
             .setStyle(ButtonStyle.Link)
             .setURL(data.url)
             .setLabel("Veja mais")
           );
          return interaction.reply({ embeds: [embed], components: [row] });
         })

    }
}