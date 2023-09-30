// Esta seria sua lista ou banco de dados de chaves, ou você poderia importá-la de outro arquivo
const generatedKeys = new Map();

exports.handler = async function(event, context) {
    const key = event.queryStringParameters.key;
    const keyInfo = generatedKeys.get(key);
    
    if (!keyInfo) {
        return { statusCode: 404, body: "Key not found" };
    }

    if (Date.now() - keyInfo.createdAt > 24 * 60 * 60 * 1000 || keyInfo.used) {
        return { statusCode: 403, body: "Key expired or already used" };
    }

    keyInfo.used = true;
    generatedKeys.set(key, keyInfo);

    return { statusCode: 200, body: "Key is valid and now marked as used" };
}
