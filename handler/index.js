const fs = require("node:fs");
const chalk = require("chalk");
const config = require('../Config/config.json');

//Carregar eventos
const loadEvents = async function (client) {
    const eventFolders = fs.readdirSync("./events");
    for (const folder of eventFolders) {
        const eventFiles = fs
        .readdirSync(`./events/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            
            if (event.name) {
                console.log(chalk.greenBright(` ✔️  => ${file} Evento carregado.`));
            } else {
                console.log(chalk.redBright(` ❌  => ${file} Evento não carregado.`));
                continue;
            }
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}

//Carregar comandos de prefixo
const loadCommands = async function (client) {
    const commandFolders = fs.readdirSync("./commands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(chalk.greenBright(` ✔️  => ${file} Comando de prefixo carregado.`));
            } else {
                console.log(chalk.redBright(` ❌  => ${file} Comando de prefixo não carregado.`));
                continue;
            }

            if (command.UserPerms)
            if (command.UserPerms.every(perms => Perms.includes(perms))) command.default_member_permissions = false
            else return Table.addRow(command.name, "🔸 FAILED", "A permissão do usuário é inválida")
            
            if (command.aliases && Array.isArray(command))
            command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
        }
    }
}

//Carregar slashcommands
const loadSlashCommands = async function (client) {
    let slash = []

    const commandFolders = fs.readdirSync("./slashcommands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./slashcommands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../slashcommands/${folder}/${file}`);
            
            if (command.name) {
                client.slash.set(command.name, command);
                slash.push(command)
                console.log(chalk.greenBright(` ✔️  => ${file} SlashCommand carregado`));
            } else {
                console.log(chalk.redBright(` ❌  => ${file} SlashCommand não carregado`));
                continue;
            }
        }
    }

    client.on("ready", async() => {
        // SlashCommands em servidor específico
         await client.guilds.cache
            .get(config.Guild_ID)
            .commands.set(slash);

        // SlashCommands global
       // await client.application.commands.set(slash)
    })
}

module.exports = {
    loadEvents,
    loadCommands,
    loadSlashCommands
}