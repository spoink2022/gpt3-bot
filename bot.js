// Create the Bot Client
// # ----------------- #
const { Client, Intents } = require('discord.js');

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = require('./private/config.json');

const { handleCommandMessage, handleCommandInteraction } = require('./commands');
const { registerSlashCommands } = require('./lib/deploy-commands.js');

// Login Setup
const myIntents = new Intents([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
]);

const client = new Client({ intents: myIntents, partials: ['CHANNEL'] });

// Event Setup
client.on('ready', onReady);
client.on('messageCreate', onMessageCreate);
client.on('interactionCreate', onInteractionCreate);

async function onReady() {
    client.user.setActivity('Ping me!', { type: 'PLAYING'});
    console.log('Logged in as ' + client.user.tag + '!');
}

async function onMessageCreate(msg) {
    if (msg.author.bot) { return; }

    if (msg.content.startsWith(`<@${DISCORD_CLIENT_ID}>`)) {
        handleCommandMessage(msg);
    }
}

async function onInteractionCreate(interaction) {
    if (interaction.isCommand()) {
        handleCommandInteraction(interaction);
    }
}

// Register Slash Commands
registerSlashCommands();

// Login
client.login(DISCORD_TOKEN);