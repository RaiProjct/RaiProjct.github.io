const express = require('express');
const PouchDB = require('pouchdb');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const db = new PouchDB('keysDatabase');

app.get('/api/generate-key', async (req, res) => {
    const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        const recentKey = await db.get(IP);
        if (recentKey && recentKey.date > Date.now() - 24*60*60*1000) {
            return res.status(400).send({ error: 'Key already generated within the last 24 hours.' });
        }
    } catch(e) {}

    const key = crypto.randomBytes(20).toString('hex');
    const token = crypto.randomBytes(10).toString('hex');

    const redirectURL = `https://YOUR_HEROKU_APP_NAME.herokuapp.com/showkey?token=${token}&key=${key}`;
    const shortURL = `https://encurta.net/api?api=YOUR_API_KEY&url=${encodeURIComponent(redirectURL)}&alias=RaiHub${token}`;

    try {
        const response = await axios.get(shortURL);
        const shortLink = response.data.shortenedUrl;

        await db.put({
            _id: IP,
            Token: token,
            Date: Date.now(),
            Key: key,
            Used: false
        });

        return res.send({ link: shortLink });
    } catch (error) {
        return res.status(500).send({ error: 'Failed to generate short link.' });
    }
});

app.get('/api/validate-key', async (req, res) => {
    const token = req.query.token;
    const key = req.query.key;
    
    try {
        const record = await db.find({
            selector: {
                Token: token,
                Key: key,
                Used: false
            }
        });
        
        if (record.docs.length > 0) {
            const keyRecord = record.docs[0];
            if (Date.now() - keyRecord.Date < 24 * 60 * 60 * 1000) {
                keyRecord.Used = true;
                await db.put(keyRecord);
                return res.send({ valid: true });
            } else {
                return res.send({ valid: false, reason: 'Key expired' });
            }
        } else {
            return res.send({ valid: false, reason: 'Key not found or already used' });
        }
    } catch (error) {
        return res.status(500).send({ error: 'Failed to validate the key.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
