// All Settings-Related Commands
// # ------------------------- #
const db = require('../db');

const ENGINE_NAMES = ['Ada', 'Babbage', 'Curie', 'Davinci'];
const ENGINE_DESCRIPTIONS = ['fastest', 'fast', 'capable', 'most capable'];
const ENGINE_PRICES = [0.014, 0.02, 0.1, 1];

module.exports.sendSettings = async function(interaction) {
    const user = await db.users.fetchUser(interaction.user.id);

    let embed = {
        color: 0xcccccc,
        title: 'GPT-3 Settings',
        author: {
            name: `${interaction.user.tag} - ${user.tokens} tokens`,
            icon_url: interaction.user.displayAvatarURL()
        },
        description: `:brain: **Engine**: ${ENGINE_NAMES[user.engine]} (${ENGINE_DESCRIPTIONS[user.engine]})
:thermometer: **Temperature**: ${user.temperature}%
:gear: **Max Response Size**: ${user.max_tokens} tokens`
    };

    interaction.editReply({ embeds: [embed] });
}

module.exports.sendEngine = async function(interaction) {
    const user = await db.users.fetchUser(interaction.user.id);
    const engineLevel = interaction.options.getInteger('level');
    
    await db.users.setColumns(user.userid, { engine: engineLevel });

    let embed = {
        color: 0x00cc00,
        title: 'Set Engine',
        author: {
            name: `${interaction.user.tag} - ${user.tokens} tokens`,
            icon_url: interaction.user.displayAvatarURL()
        },
        description: `Set AI Engine to ${ENGINE_NAMES[engineLevel]}.`,
        fields: [
            { name: 'Description :notepad_spiral:', value: ENGINE_DESCRIPTIONS[engineLevel][0].toUpperCase() + ENGINE_DESCRIPTIONS[engineLevel].substring(1), inline: true },
            { name: 'Price Multiplier :cd:', value: `x${ENGINE_PRICES[engineLevel]}`, inline: true }
        ]
    }

    interaction.editReply({ embeds: [ embed ] });
}

module.exports.sendTemperature = async function(interaction) {
    const user = await db.users.fetchUser(interaction.user.id);
    const temperature = Math.min(Math.max(interaction.options.getInteger('temperature'), 0), 100);
    
    await db.users.setColumns(user.userid, { temperature: temperature });

    let embed = {
        color: 0x00cc00,
        title: 'Set Temperature',
        author: {
            name: `${interaction.user.tag} - ${user.tokens} tokens`,
            icon_url: interaction.user.displayAvatarURL()
        },
        description: `Set to ${temperature}%.`
    }

    interaction.editReply({ embeds: [ embed ] });
}

module.exports.sendMaxResponseTokens = async function(interaction) {
    const user = await db.users.fetchUser(interaction.user.id);
    const maxResponseTokens = Math.min(Math.max(interaction.options.getInteger('tokens'), 0), 2000); // set to 250 max for prod
    
    await db.users.setColumns(user.userid, { max_tokens: maxResponseTokens });

    let embed = {
        color: 0x00cc00,
        title: 'Set Max Response Tokens',
        author: {
            name: `${interaction.user.tag} - ${user.tokens} tokens`,
            icon_url: interaction.user.displayAvatarURL()
        },
        description: `Set to ${maxResponseTokens} tokens.`
    }

    interaction.editReply({ embeds: [ embed ] });
}