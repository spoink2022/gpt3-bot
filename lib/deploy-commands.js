// Deploy Slash Commands
// # ----------------- #
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { PROD, DISCORD_CLIENT_ID, DISCORD_TOKEN } = require('../private/config.json');

module.exports.registerSlashCommands = async function() {

    const commands = [
        new SlashCommandBuilder().setName('help').setDescription('Get help on the usage of the bot.')
        .addSubcommand(subcommand => 
            subcommand.setName('general').setDescription('Walkthrough for new users.')
        ).addSubcommand(subcommand => 
            subcommand.setName('tokens').setDescription('Explanation of the token system.')
        ).addSubcommand(subcommand => 
            subcommand.setName('engine').setDescription('Explanation of different engines.')
        ).addSubcommand(subcommand => 
            subcommand.setName('temperature').setDescription('Explanation of temperature.')
        ).addSubcommand(subcommand => 
            subcommand.setName('commands').setDescription('View a command list.')
        ),
        new SlashCommandBuilder().setName('settings').setDescription('Check your current GPT-3 settings.'),
        new SlashCommandBuilder().setName('set').setDescription('Change your current GPT-3 settings.').addSubcommand(subcommand =>
            subcommand.setName('engine').setDescription('Change the strength of your default AI engine.').addIntegerOption(option => 
                option.setName('level').setDescription('The strength of the AI engine.').setRequired(true).addChoices(
                    { name: '1 - Ada', value: 0 },
                    { name: '2 - Babbage', value: 1 },
                    { name: '3 - Curie', value: 2 },
                    { name: '4 - Davinci', value: 3 },
                    )
                )
            ).addSubcommand(subcommand => 
            subcommand.setName('temperature').setDescription('Change the creativity of your AI engine.').addIntegerOption(option => 
                option.setName('temperature').setDescription('The creativity of your engine, in percent.').setRequired(true)
                )
            )
        .addSubcommand(subcommand => 
            subcommand.setName('max-response-tokens').setDescription('Change the maximum response length.').addIntegerOption(option => 
                option.setName('tokens').setDescription('The maximum amount of tokens a response can contain.').setRequired(true)
                )
            )
    ].map(command => command.toJSON());

    const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

    if (PROD) {
        rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands })
		.then(() => console.log('Successfully registered application commands (Global).'))
		.catch(() => console.log('Failed to register global commands.'));
    } else {
        const { DEV_GUILD_ID } = require('../private/config.json');
        rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DEV_GUILD_ID), { body: commands })
            .then(() => console.log('Successfully registered application commands for personal.'))
            .catch(console.error);
    }
}