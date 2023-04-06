const { ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
  
const TicketSetup = require('../../Database/TicketSetupDB');
const Ticket = require('../../Database/TicketDB');

module.exports = {
    name: "tickets",
    description: "Opções e configuração de tickets",
    UserPerms: ["Administrator"],
    category: "Administration",
    options: [
        {
            name: "setup",
            description: "Configuração do sistema de tickets",
            type: 1,
            options: [
                {
                    name: "channel",
                    description: "Selecione o canal onde os tickets devem ser criados",
                    type: 7,
                    channel_types: [0],
                    required: true,
                },
                {
                    name: "category",
                    description: "Selecione a categoria onde os tickets devem ser criados.",
                    type: 7,
                    channel_types: [4],
                    required: true,
                },
                {
                    name: "transcripts",
                    description: "Selecione o canal para onde as transcrições devem ser enviadas.",
                    type: 7,
                    channel_types: [0],
                    required: true,
                },
                {
                    name: "support-role",
                    description: "Cargo de suporte para o ticket.",
                    type: 8,
                    required: true,
                },
                {
                    name: "everyone",
                    description: "Selecione o cargo de everyone. (Você deve selecionar o cargo de everyone) IMPORTANTE",
                    type: 8,
                    required: true,
                },
                {
                    name: "button-name",
                    description: "Nome do butão",
                    type: 3,
                    required: true,
                },
                {
                    name: "emoji",
                    description: "emoji do butão",
                    type: 3,
                    required: true,
                },
                {
                    name: "description",
                    description: "O texto a enviar com o painel de tickets",
                    type: 3,
                    required: false,
                }
            ],
        },
        {
            name: "delete-users",
            description: "Exclua os tickets dos usuários (use este comando somente se você removeu o ticket manualmente)",
            type: 1,
        },
        {
            name: "delete-setup",
            description: "Excluir o sistema de tickets (painel)",
            type: 1,
        },
    ],

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    run: async(client, interaction) => {

      const { guild, options } = interaction;

      if (interaction.options.getSubcommand() === "setup") {
          const channel = options.getChannel('channel');
          const category = options.getChannel('category');
          const transcripts = options.getChannel('transcripts');
          const handlers = options.getRole('support-role');
          const everyone = options.getRole('everyone');
          const description = options.getString('description');
          const button = options.getString('button-name');
          const emoji = options.getString('emoji');
          await TicketSetup.findOneAndUpdate(
            { GuildID: guild.id },
            {
              Channel: channel.id,
              Category: category.id,
              Transcripts: transcripts.id,
              Handlers: handlers.id,
              Everyone: everyone.id,
              Description: description,
              //Button: [button[0]],
            },
            {
              new: true,
              upsert: true,
            }
          ).catch((err) => console.log(err));
  
          interaction
          .reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Sistema de Tickets")
                .setDescription("Sistema de tickets configurado com sucesso!")
                .setColor('Green')
                .addFields(
                  {
                    name: "<:channel:1056715573242892338> Channel",
                    value: `<:icon_reply:1088996218283229184>  <#${channel.id}>`,
                    inline: true,
                  },
                  {
                    name: "<:orangenwand:1056716503921205301> Cargo de Suporte",
                    value: `<:icon_reply:1088996218283229184>  <@&${handlers.id}>`,
                    inline: true,
                  },
                  {
                    name: "<:Discussions:1056716758611939348> Descrição do Painel",
                    value: `<:icon_reply:1088996218283229184>  ${description}`,
                    inline: true,
                  },
                  {
                    name: "Ticket Logs",
                    value: `<#${transcripts.id}>`,
                  }
                ),
            ],
            ephemeral: true,
          })
          .catch(async (err) => {
            console.log(err);
            await interaction.reply({
              content: "ocorreu um erro...",
            });
          });
    
          const sampleMessage =
          `Bem-vindo ao tickets! Clique no botão **"${button}"** para criar um ticket e a equipe de suporte entrará em contato com você!`;
    
          const embed = new EmbedBuilder()
            .setTitle("Sistema de Tickets")
            .setDescription(description == null ? sampleMessage : description)
            .setColor("Aqua")
            .setImage("https://i.imgur.com/MVWa8pZ.png")
    
          const buttonshow = new ButtonBuilder()
            .setCustomId('createTicket')
            .setLabel(button)
            .setEmoji(emoji)
            .setStyle(ButtonStyle.Primary);
    
          await guild.channels.cache.get(channel.id).send({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(buttonshow)],
          }).catch(error => {return});
      } 
      if (interaction.options.getSubcommand() === "delete-users") {
  
        const ticketData = await TicketSetup.findOne({
          GuildID: interaction.guild.id,
        });
  
        if (!ticketData) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Sistema de Tickets")
                .setDescription("Já excluiu todos os tickets abertos por usuários no banco de dados!")
                .addFields(
                  {
                    name: "<:Slash:1088996088712794162> IMPORTANTE",
                    value: "<:icon_reply:1088996218283229184> **SE TIVER TICKETS ABERTOS DEPOIS DE USAR ESTE COMANDO TERÁ QUE REMOVÊ-LOS MANUALMENTE**",
                    inline: true,
                  },
                ),
            ],
            ephemeral: true,
          });
        }
  
        Ticket
          .findOneAndDelete({
            GuildID: interaction.guild.id,
          })
          .catch((err) => console.log(err));
  
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Sistema de Tickets")
              .setColor("Green")
              .setDescription("Excluído com sucesso o sistema de tickets!")
              .addFields(
                {
                  name: "IMPORTANTE",
                  value: "**SE TIVER TICKETS ABERTOS DEPOIS DE USAR ESTE COMANDO TERÁ QUE REMOVÊ-LOS MANUALMENTE**"
                }
              ),
          ],
          ephemeral: true,
        });
      }
  
      if (interaction.options.getSubcommand() === "delete-setup") {
        const ticketData = await TicketSetup.findOne({
          GuildID: interaction.guild.id,
        });
  
        if (!ticketData) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Sistema de Tickets")
                .setDescription("Seu painel de tickets já foi excluído!")
                .addFields(
                  {
                    name: "<:Slash:1088996088712794162> uSAR",
                    value: "<:icon_reply:1088996218283229184>  /tickets setup",
                    inline: true,
                  },
                ),
            ],
            ephemeral: true,
          });
        }
  
        TicketSetup
          .findOneAndDelete({
            GuildID: interaction.guild.id,
          })
          .catch((err) => console.log(err));
  
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Sistema de Tickets")
              .setDescription("Excluído com sucesso o sistema de tickets!"),
          ],
          ephemeral: true,
        });
      }

    }
}