// Handle API Requests to OpenAI
// # ------------------------- #
const { Configuration, OpenAIApi } = require("openai");

const KEYS = require('../private/keys.json');

const configuration = new Configuration({
    apiKey: KEYS[0]
});

const openai = new OpenAIApi(configuration);

const ENGINE_CODES = ['text-ada-001', 'text-babbage-001', 'text-curie-001', 'text-davinci-002'];
const TOXIC_THRESHOLD = -0.355;


module.exports.getTextCompletion = async function(prompt, engine, temperature, maxTokens, userid) {
    
    const response = await openai.createCompletion(ENGINE_CODES[engine], {
        prompt: prompt,
        temperature: temperature,
        max_tokens: maxTokens,
        n: 1,
        user: userid
    });

    let data = response.data;
    data.safe = true;

    const safety = (await openai.createCompletion('content-filter-alpha', {
        prompt: '<|endoftext|>'+data.choices[0].text+'\n--\nLabel:',
        temperature: 0,
        max_tokens: 1,
        top_p: 0,
        logprobs: 10
    })).data.choices[0];

    if (safety.text === '2' && safety.logprobs.top_logprobs[0]['2'] > TOXIC_THRESHOLD) {
        data.safe = false;
    }

    return data;
}