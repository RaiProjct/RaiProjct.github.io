const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');

const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const dbName = 'Keys';
const collectionName = 'RaiHub';
const uri = `mongodb+srv://${username}:${password}@cluster.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const encurtaNetAPI = "https://encurta.net/api?api=d5713b391c30067d7df3073a3a4fc42bd8bc67fe&url=https://raihub.netlify.app/showkey&alias=RaiHub&type=0";

exports.handler = async (event, context) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  let response = {};

  try {
    await client.connect();
    
    const collection = client.db(dbName).collection(collectionName);
    
    const newKey = {
      Key: Math.random().toString(36).substr(2, 8).toUpperCase(),
      Duration: "24h",
      Used: "No",
      Created: new Date().toISOString()
    };

    const result = await collection.insertOne(newKey);

    const shortenedURLResponse = await axios.get(encurtaNetAPI);
    
    response = {
      statusCode: 200,
      body: JSON.stringify({ message: "Key generated successfully!", shortenedLink: shortenedURLResponse.data.shortenedUrl })
    };
  } catch (err) {
    console.error('Error:', err);
    response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  } finally {
    await client.close();
  }

  return response;
};
