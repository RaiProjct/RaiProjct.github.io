const PouchDB = require('pouchdb');
const db = new PouchDB('keysDatabase');

exports.handler = async (event, context) => {
    const token = event.queryStringParameters.token;
    const keyId = event.queryStringParameters.keyId;

    try {
        const keyRecord = await db.get(keyId);

        if (keyRecord && keyRecord.token === token) {
            return {
                statusCode: 200,
                body: JSON.stringify({ valid: true, key: keyId })
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ valid: false })
            };
        }

    } catch (err) {
        console.error("Erro ao validar a chave:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro interno do servidor" })
        };
    }
};
