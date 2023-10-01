const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');

const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const dbName = 'Keys';
const collectionName = 'RaiHub';
const uri = "mongodb+srv://RaiHub:YOUR_REAL_PASSWORD_HERE@keys.98lvxlc.mongodb.net/?retryWrites=true&w=majority";

exports.handler = async (event, context) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    let response = {};

    try {
        await client.connect();
        
        const collection = client.db(dbName).collection(collectionName);

        const userIP = event.headers['client-ip'];

        const lastKeyRequest = await collection.findOne({ IP: userIP });
        
        if (lastKeyRequest) {
            const currentTime = new Date();
            const lastRequestTime = new Date(lastKeyRequest.Created);
            const timeDifference = currentTime - lastRequestTime;

            // 24 horas em milissegundos é 86400000
            if (timeDifference < 86400000) {
                throw new Error("You can request a new key only once every 24 hours.");
            }
        }
        
        const newKey = {
            Key: Math.random().toString(36).substr(2, 8).toUpperCase(),
            Token: Math.random().toString(36).substr(2, 8),
            Duration: "24h",
            Used: "No",
            Created: new Date().toISOString(),
            IP: userIP
        };

        const result = await collection.insertOne(newKey);

        const baseLink = `https://raihub.netlify.app/showkey.html`;
        const shortenedURL = `https://encurta.net/api?api=d5713b391c30067d7df3073a3a4fc42bd8bc67fe&url=${baseLink}?token=${newKey.Token}&key=${result.insertedId}&alias=RaiHub${newKey.Token}&type=0`;
        const shortenedURLResponse = await axios.get(shortenedURL);
        
        response = {
            statusCode: 200,
            body: JSON.stringify({ message: "Key generated successfully!", shortenedLink: shortenedURLResponse.data.shortenedUrl })
        };
    } catch (err) {
        console.error('Error:', err);
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: err.message })
        };
    } finally {
        await client.close();
    }

    return response;
};
