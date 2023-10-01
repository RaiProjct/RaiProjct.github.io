const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const path = require('path');

const API_TOKEN = 'd5713b391c30067d7df3073a3a4fc42bd8bc67fe';

exports.handler = async function(event, context) {
    const clientIp = event.headers['client-ip'];

    // Carrega as chaves do arquivo JSON
    const keysDataPath = path.join(__dirname, 'keys.json');
    const keysData = JSON.parse(fs.readFileSync(keysDataPath, 'utf8'));

    // Verifica se o IP já solicitou uma chave nas últimas 24 horas
    const lastKeyForIp = keysData.filter(k => k.ip === clientIp).sort((a, b) => new Date(b.Ativada) - new Date(a.Ativada))[0];
    if (lastKeyForIp && (Date.now() - new Date(lastKeyForIp.Ativada).getTime()) < 24 * 60 * 60 * 1000) {
        return {
            statusCode: 429, 
            body: JSON.stringify({ 
                error: 'You can only generate one key per 24 hours.' 
            })
        };
    }

    const newKey = crypto.randomBytes(16).toString('hex');

    // Adiciona a nova chave aos dados
    keysData.push({
        Key: newKey,
        Ativada: new Date().toISOString(),
        Duracao: "24 hours",
        Usada: false,
        ip: clientIp // armazenar o IP para a verificação de 24 horas
    });

    // Salva de volta no arquivo JSON
    fs.writeFileSync(keysDataPath, JSON.stringify(keysData, null, 2));

    const apiUrl = `https://raihub.netlify.app/display-key/${newKey}`;
    const customAlias = `RaiHub-${newKey.substring(0, 5)}`;

    try {
        const response = await axios.get(`https://encurta.net/api`, {
            params: {
                api: API_TOKEN,
                url: apiUrl,
                alias: customAlias,
                format: 'text',
                type: 0
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                key: newKey, 
                shortenedLink: response.data
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error generating shortened link.'
        };
    }
};
