const crypto = require('crypto');
const axios = require('axios');

const API_TOKEN = 'd5713b391c30067d7df3073a3a4fc42bd8bc67fe';

exports.handler = async function(event, context) {
    const newKey = crypto.randomBytes(16).toString('hex');
    const apiUrl = `YOUR_NETLIFY_URL/use-key/${newKey}`; // Substitua YOUR_NETLIFY_URL pelo URL do seu projeto no Netlify

    const customAlias = `RaiHub-${newKey.substring(0, 5)}`; // Criando um alias único

    try {
        const response = await axios.get(`https://encurta.net/api`, {
            params: {
                api: API_TOKEN,
                url: apiUrl,
                alias: customAlias,
                format: 'text',
                type: 0  // Tipo 0 (sem anúncios)
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ shortenedLink: response.data })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error generating shortened link.'
        };
    }
};
