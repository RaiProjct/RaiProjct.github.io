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

    // Verifica restrição de IP aqui, se necessário...

    const newKey = crypto.randomBytes(16).toString('hex');

    // Adiciona a nova chave aos dados
    keysData.push({
        Key: newKey,
        Ativada: new Date().toISOString(),
        Duracao: "24 hours",  // Pode ser ajustado para mostrar um valor dinâmico
        Usada: false
    });

    // Salva de volta no arquivo JSON
    fs.writeFileSync(keysDataPath, JSON.stringify(keysData, null, 2));

    // ... (restante do código de geração do link encurtado)
};
