// Handle Commands
// # ----------- #
const { DISCORD_CLIENT_ID } = require('../private/config.json');

const { sendPrompt } = require('./prompt.js');
const { sendPing, sendHelp } = require('./help.js');
const { sendSettings, sendEngine, sendTemperature, sendMaxResponseTokens } = require('./settings.js');

module.exports.handleCommandMessage = async function(msg) {
    if (msg.content === `<@${DISCORD_CLIENT_ID}>`) {
        sendPing(msg);
    } else {
        sendPrompt(msg);
    }
}

module.exports.handleCommandInteraction = async function(interaction) {
    await interaction.deferReply();

    switch (interaction.commandName) {
        case 'help':
            sendHelp(interaction);
            break;
        case 'settings':
            sendSettings(interaction);
            break;
        case 'set':
            switch (interaction.options.getSubcommand()) {
                case 'engine':
                    sendEngine(interaction);
                    break;
                case 'temperature':
                    sendTemperature(interaction);
                    break;
                case 'max-response-tokens':
                    sendMaxResponseTokens(interaction);
                    break;
                default:
                    break;
            }
        default:
            break;
    }
}