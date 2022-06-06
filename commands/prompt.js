// Handle Queries to the AI
// # -------------------- #
const { encode } = require('gpt-3-encoder')

const { DISCORD_CLIENT_ID } = require('../private/config.json');

const db = require('../db');

const { getTextCompletion } = require('../lib/prompt.js');

// Constants
const ENGINE_NAMES = ['Ada', 'Babbage', 'Curie', 'Davinci'];
const ENGINE_PRICES = [0.014, 0.02, 0.1, 1];

module.exports.sendPrompt = async function(msg) {
    // -- Handle Queries to the AI --
    const user = await db.users.fetchUser(msg.author.id);
    if (user.banned) return msg.reply('You are banned from using this bot!');

    // Filter Prompt
    let prompt = `GPT-3 Bot, ` + msg.content.replace(`<@${DISCORD_CLIENT_ID}>`, '').trim();

    if (msg.channel.type === 'GUILD_TEXT') {
        msg.mentions.members.forEach(guildMember => {
            prompt = prompt.replaceAll(`<@${guildMember.user.id}>`, guildMember.nickname || guildMember.user.username);
        });
    } else {
        msg.mentions.users.forEach(discordUser => {
            prompt = prompt.replaceAll(`<@${discordUser.id}>`, discordUser.username);
        });
    }

    if (prompt.length >= 750) return msg.reply('Prompts must be less than 750 characters!'); // oversized prompt

    const promptCost = encode(prompt).length;

    // Ensure Token Requirements
    const maxCost = Math.ceil((promptCost + user.max_cost) * ENGINE_PRICES[user.engine]);
    if (maxCost > user.tokens) { // cannot afford
        return msg.reply(`With a prompt worth \`${promptCost}\` tokens and a response limit of \`${user.max_tokens}\` tokens, your current balance of \`${user.tokens}\` tokens is not enough!`);
    }

    // Send Filler Embed
    let temporaryEmbed = {
        color: 0xcccccc,
        title: `${prompt[0].toUpperCase() + prompt.substring(1, 100)}${prompt.length > 100 ? '...' : ''}`,
        author: {
            name: `${msg.author.tag} - ${user.tokens} tokens`,
            icon_url: msg.author.displayAvatarURL()
        },
        description: 'Processing...'
    };
    const sentMessage = await msg.channel.send({ embeds: [temporaryEmbed] });

    // Execute Prompt
    const response = await getTextCompletion(prompt, user.engine, user.temperature/100, user.max_tokens, user.userid);
    const responseCost = encode(response.choices[0].text).length;
    const actualCost = Math.ceil((promptCost + responseCost) * ENGINE_PRICES[user.engine]);
    await db.users.updateColumns(user.userid, { tokens: -actualCost });

    // Construct Embed
    let finalEmbed = {
        color: response.safe ? 0x00cc00 : 0xcc0000,
        title: `${prompt[0].toUpperCase() + prompt.substring(1, 100)}${prompt.length > 100 ? '...' : ''}`,
        author: {
            name: `${msg.author.tag} - ${user.tokens - actualCost} tokens`,
            icon_url: msg.author.displayAvatarURL()
        },
        description: `${prompt.length > 100 ? `**Prompt** \`\`\`${prompt[0] + prompt.substring(1)}\`\`\`\n` : ''}\
${prompt.length > 100 ? '**Response** ' : ''}\`\`\`${response.safe ? response.choices[0].text : 'CENSORED: I am legally not allowed to display this response.'}\`\`\`
**Prompt Size**: ${promptCost} token${promptCost > 1 ? 's' : ''}
**Response Size**: ${responseCost} token${responseCost > 1 ? 's' : ''}
**Cost**: ${promptCost + responseCost} x ${ENGINE_PRICES[user.engine]} = ${actualCost} token${actualCost > 1 ? 's' : ''}\n\u200b`,
        fields: [
            { name: 'Engine :brain:', value: ENGINE_NAMES[user.engine], inline: true },
            { name: 'Temperature :thermometer:', value: `${user.temperature}%`, inline: true },
            { name: 'Max Response Size :gear:', value: `${user.max_tokens} tokens`, inline: true }
        ]
    };

    //sentMessage.edit({ embeds: [finalEmbed] });
    sentMessage.delete().catch(err => {
        // message deleted by user
    });
    msg.channel.send({ embeds: [finalEmbed] });
}