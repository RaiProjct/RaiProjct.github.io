const crypto = require('crypto');

// Esta seria sua lista ou banco de dados de chaves
const generatedKeys = new Map();

exports.handler = async function(event, context) {
    const newKey = crypto.randomBytes(16).toString('hex');
    generatedKeys.set(newKey, { 
        createdAt: Date.now(),
        used: false
    });
    return {
        statusCode: 200,
        body: JSON.stringify({ key: newKey })
    };
}
