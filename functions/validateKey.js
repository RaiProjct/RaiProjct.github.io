const MongoClient = require('mongodb').MongoClient;

const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const dbName = 'Keys';
const collectionName = 'RaiHub';
const uri = `mongodb+srv://${username}:${password}@cluster.mongodb.net/${dbName}?retryWrites=true&w=majority`;

exports.handler = async (event, context) => {
    const token = event.queryStringParameters.token;
    const keyId = event.queryStringParameters.keyId;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    
    const collection = client.db(dbName).collection(collectionName);
    
    const keyRecord = await collection.findOne({ _id: keyId });

    await client.close();

    if (keyRecord && keyRecord.Token === token) {
        return {
            statusCode: 200,
            body: JSON.stringify({ valid: true, key: keyRecord.Key })
        };
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({ valid: false })
        };
    }
};
