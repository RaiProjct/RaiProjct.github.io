const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    const key = event.path.split("/").pop();
    
    const keysDataPath = path.join(__dirname, 'keys.json');
    const keysData = JSON.parse(fs.readFileSync(keysDataPath, 'utf8'));
    
    const keyData = keysData.find(k => k.Key === key);

    if (!keyData) {
        return { statusCode: 404, body: "Key not found" };
    }

    if (keyData.Usada) {
        return { statusCode: 403, body: "Key already used" };
    }

    const activatedDate = new Date(keyData.Ativada);
    if (Date.now() - activatedDate.getTime() > 24 * 60 * 60 * 1000) {
        return { statusCode: 403, body: "Key expired" };
    }

    keyData.Usada = true;

    // Salva de volta no arquivo JSON
    fs.writeFileSync(keysDataPath, JSON.stringify(keysData, null, 2));

    return { statusCode: 200, body: "Key is valid and now marked as used" };
}
