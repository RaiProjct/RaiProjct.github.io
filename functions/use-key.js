// Estrutura simples para armazenar as chaves geradas (em uma implementação real, você pode querer usar um banco de dados)
const generatedKeys = new Map();

exports.handler = async function(event, context) {
    const key = event.path.split("/").pop(); // Isso pega o último segmento da URL, que é a chave
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
