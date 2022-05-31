// All Help-Related Commands
// # --------------------- #
module.exports.sendPing = async function(msg) {
    msg.channel.send({ embeds: [PING_EMBED] });
}

module.exports.sendHelp = async function(interaction) {
    switch (interaction.options.getSubcommand()) {
        case 'general':
            interaction.editReply({ embeds: [START_EMBED] });
            break;
        case 'tokens':
            interaction.editReply({ embeds: [TOKENS_EMBED] });
            break;
        case 'engine':
            interaction.editReply({ embeds: [ENGINE_EMBED] });
            break;
        case 'temperature':
            interaction.editReply({ embeds: [TEMPERATURE_EMBED] });
            break;
        case 'commands':
            interaction.editReply({ embeds: [COMMANDS_EMBED] });
            break;
        default:
            break;
    }
}


const COMMANDS_EMBED = {
    color: 0xcccccc,
    title: 'Full Command List',
    description: `\`\`\`
@GPT-3 [prompt]
@GPT-3
/settings
/set engine
/set max-response-tokens
/set temperature
/help general
/help engine
/help temperature
/help commands
\`\`\``
};

const PING_EMBED = {
    color: 0xb125db,
    title: 'Welcome to GPT-3 Bot!',
    description: `**Synopsis**
The goal of this bot is to share the epicness of AI in a fun and safe environment. This bot uses the GPT-3 model from OpenAI to produce results.\n
**Usage**
This bot operates on slash commands for non-prompt commands, so simply type \`/\` and you should be able to view your options. Alternatively, for a walkthrough on using the bot, type \`/help general\`.\n
**Sample Prompts**
\\*ping the color after red in the rainbow is
\\*ping summarize Hamlet in under 20 words\n
**Limits**
Since this is such a powerful model, your inputs require external processing, which costs money on my end. You have been given 1000 tokens, so please use them wisely. See \`/help tokens\` for more information on this bot's token system.`,
    footer: {
        text: '*actually ping the bot like you did to call this command'
    }
};

const START_EMBED = {
    color: 0x3366ff,
    title: 'Getting Started With GPT-3 Bot',
    description: `**1. Understanding Settings** :gear:
The default settings work fine, but feel free to experiment for best results!
\`/settings\`
\`/set\`
\n**2. Tokens** :cd:
Your token balance is visible in almost every command. To cut down on spending, try setting to a weaker engine or limiting max response size.
\n**3. Prompts** :inbox_tray:
Access the AI with a ping followed by your prompt/question. Give it a moment to process your request and enjoy your response! Inappropriate content will not be displayed.
\n**4. Become an Expert** :sunglasses:
The goal here is for you to figure out how to best use the AI and see what you can do with it. From telling stories to math problems to literary analysis, the possibilities are limitless. Learn how to get the results you want!
\`/help tokens\`
\`/help engine\`
\`/help temperature\`
`
};

const TOKENS_EMBED = {
    color: 0x3366ff,
    title: 'Explanation of Tokens',
    description: `:link: **[See the OpenAI Website](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)**
\n**Actual Tokens**
Tokens can be thought of as chunks of words, with each token being equal to ~0.75 words.
\n**Bot Tokens**
Since tokens are valued differently depending on the model, this bot uses a standardized value for tokens: 1 Token = 1 Davinci Token.\
\nTherefore, when you use cheaper engines, the cost will be reduced accordingly.
\`/help engine\`
\n**Getting Additional Tokens**
As the bot is still in beta, there is no way to get tokens yet. Future possibilities include:
- Giveaways
- Voting on top.gg
- Paid options`
};

const ENGINE_EMBED = {
    color: 0x3366ff,
    title: 'Explanation of Engines',
    description: `:link: **[See the OpenAI Website](https://beta.openai.com/docs/engines/gpt-3)**
\n**Overview**
There are 4 main models with different levels of power suitable for different tasks. Davinci is the most capable, while Ada is the fastest. Use \`/set\` to switch between engines.
\n**Davinci**
Most capable
Price: x1
\n**Curie**
Capable
Price: x0.1
\n**Babbage**
Fast
Price: x0.02
\n**Ada**
Fastest
Price: x0.014`
};

const TEMPERATURE_EMBED = {
    color: 0x3366ff,
    title: 'Explanation of Temperature',
    description: `:link: **[Technical Explanation](https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277)**
\n**Definition**
Temperature can be though of as the bot's creativity. At 0% you will get the same result every time, while at 100% the bot will take more risks with your answer.
\nThe default value is 75%.`
}