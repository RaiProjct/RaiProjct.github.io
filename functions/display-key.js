const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    const key = event.path.split("/").pop();
    
    const keysDataPath = path.join(__dirname, 'keys.json');
    const keysData = JSON.parse(fs.readFileSync(keysDataPath, 'utf8'));
    
    const keyData = keysData.find(k => k.Key === key);

    if (!keyData || keyData.Usada) {
        return { 
            statusCode: 404, 
            body: "Key not found or already used." 
        };
    }

    // Aqui, você retorna a chave. Você pode formatá-la de maneira amigável, talvez com HTML, 
    // ou apenas retorná-la como texto simples.
    return { 
        statusCode: 200, 
        body: `Your key is: ${key}` 
    };
}
