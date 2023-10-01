const PouchDB = require('pouchdb');
const axios = require('axios');

const db = new PouchDB('keysDatabase');
const API_URL = 'https://encurta.net/api?api=d5713b391c30067d7df3073a3a4fc42bd8bc67fe&url=https://raihub.netlify.app/showkey.html&format=text&type=0';

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function generateKey() {
    const key = generateRandomString(10); // função para gerar a chave
    const token = generateRandomString(5); // função para gerar o token

    const doc = {
        _id: key,
        token: token,
        createdAt: new Date().toISOString(),
        duration: 24 * 60 * 60 * 1000, // 24 horas em milissegundos
        used: false
    };

    try {
        await db.put(doc);
        const shortURL = await axios.get(`${API_URL}&alias=RaiHub${token}`); // gerar URL curta
        return { key, token, shortURL: shortURL.data };
    } catch (err) {
        console.error("Erro ao armazenar a chave no PouchDB:", err);
        return null;
    }
}

async function useKey(key, token) {
    try {
        const doc = await db.get(key);
        if (doc && !doc.used && doc.token === token && (new Date() - new Date(doc.createdAt)) <= doc.duration) {
            doc.used = true;
            await db.put(doc);
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error("Erro ao usar a chave:", err);
        return false;
    }
}
