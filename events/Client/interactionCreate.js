const {InteractionType, EmbedBuilder} = require("discord.js")
const config = require('../../Config/config.json')

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { member } = interaction
 
        if (interaction.type !== InteractionType.ApplicationCommand) return;
        
        const command = client.slash.get(interaction.commandName);
        if (!command) return interaction.reply({ content: `:x: | Erro ao processar o comando`, ephemeral: true });
        
        if (command.ownerOnly) {
            if (interaction.user.id !== config.Owner_ID) {
                return interaction.reply({ content: `:x: **|** Acesso negado.`, ephemeral: true });
            }
        }

        if (command.UserPerms && command.UserPerms.length !== 0) if (!member.permissions.has(command.UserPerms)) return interaction.reply({embeds: [
            new EmbedBuilder()
            .setColor("#9400d3")
            .setDescription(`❌ | Você precisa de \`${command.UserPerms.join(", ")}\` permissão(ões) para executar este comando!`)
        ], ephemeral: true,})

        if (command.BotPerms && command.BotPerms.length !== 0) if (!member.permissions.has(command.BotPerms)) return interaction.reply({embeds: [
            new EmbedBuilder()
            .setColor("#9400d3")
            .setDescription(`❌ | Preciso de  \`${command.BotPerms.join(", ")}\` permissão(ões) para executar este comando`)
        ], ephemeral: true,})
        
        const args = [];
        
        for (let option of interaction.options.data) {
            if (option.type === 'SUB_COMMAND') {
                if (option.name) args.push(option.name);
                option.options?.forEach(x => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        
        try {
            command.run(client, interaction, args)
        } catch (e) {
            interaction.reply({ content: e.message });
        }
    }
}