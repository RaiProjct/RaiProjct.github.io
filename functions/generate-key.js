const PouchDB = require('pouchdb');
const axios = require('axios');
const crypto = require('crypto');

const db = new PouchDB('keysDatabase');

async function generateUniqueKey() {
    let unique = false;
    let key;
    while (!unique) {
        key = crypto.randomBytes(16).toString('hex');
        try {
            await db.get(key);
        } catch (err) {
            if (err.name === 'not_found') {
                unique = true;
            }
        }
    }
    return key;
}

function isKeyValid(createdAt) {
    const currentTime = new Date().getTime();
    const keyCreationTime = new Date(createdAt).getTime();
    const oneDayInMillis = 24 * 60 * 60 * 1000;

    // Verifica se a chave tem mais de 24 horas
    return (currentTime - keyCreationTime) <= oneDayInMillis;
}

async function hasGeneratedKeyRecently(ip) {
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();

    const allKeys = await db.allDocs({ include_docs: true });

    return allKeys.rows.some(row => {
        const doc = row.doc;
        return doc.ip === ip && 
               (currentTime - new Date(doc.createdAt).getTime()) <= oneDayInMillis;
    });
}

exports.handler = async (event, context) => {
    const apiKey = "d5713b391c30067d7df3073a3a4fc42bd8bc67fe";
    const destLink = "https://raihub.netlify.app/showkey.html";

    const clientIP = event.headers['client-ip'];

    const generatedRecently = await hasGeneratedKeyRecently(clientIP);
    if (generatedRecently) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Você só pode gerar uma chave a cada 24 horas" })
        };
    }

    const key = await generateUniqueKey();
    const token = crypto.randomBytes(8).toString('hex');

    await db.put({
        _id: key,
        token: token,
        ip: clientIP,
        used: false,
        createdAt: new Date().toISOString()
    });

    if (!isKeyValid(key.createdAt)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Chave expirada" })
        };
    }

    try {
        const response = await axios.get(`https://encurta.net/api?api=${apiKey}&url=${destLink}?token=${token}&key=${key}&alias=RaiHub${token}&type=0`);
        if (response.data.status === "success") {
            return {
                statusCode: 200,
                body: JSON.stringify({ link: response.data.shortenedUrl })
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Erro ao encurtar o URL" })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao se comunicar com o serviço de encurtamento" })
        };
    }
};
