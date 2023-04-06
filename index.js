const { Client, Collection, Partials, GatewayIntentBits } = require('discord.js');
const config = require('./Config/config.json')
const handler = require("./handler/index");
const handlerError = require("./handler/AntiCrash");

const myIntents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildModeration,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildIntegrations,
  GatewayIntentBits.GuildWebhooks,
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.DirectMessageReactions,
  GatewayIntentBits.DirectMessageTyping,
  GatewayIntentBits.MessageContent
]

const myPartials = [
  Partials.Channel,
  Partials.Message,
  Partials.Reaction
]
const client = new Client({
  partials: myPartials,
  intents: myIntents
});

const Discord = require('discord.js');

module.exports = client; 

client.discord = Discord;
client.commands = new Collection();
client.slash = new Collection();

handler.loadEvents(client);
handler.loadCommands(client);
handler.loadSlashCommands(client);

handlerError.antiCrash(client);

client.login(config.Bot_Token);