const config = require('../config');
const fs = require('fs');
const { getAnti, setAnti } = require('../data/antidel');
const { cmd, commands } = require('../command');
const axios = require('axios');
const prefix = config.PREFIX;
const AdmZip = require("adm-zip");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    desc: "Manage AntiDelete Settings with Reply Menu",
    react: "🔄",
    category: "misc",
    filename: __filename,
},
async (conn, mek, m, { from, reply, isCreator }) => {
    if (!isCreator) return reply("*Only the bot owner can use this command!*");

    const dmStatus = config.ANTI_DEL_PATH === "log";

    const menuText = `> *ANTI-DELETE 𝐌𝐎𝐃𝐄 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*

> Current DM: ${dmStatus ? "✅ ON (log)" : "❌ OFF (same)"}

Reply with:

*1.* To Enable Antidelete for All (Group,DM) Same Chat  
*2.* To Enable Antidelete for All (Group,DM) dm Chat  
*3.* To Disable All Antidelete and reset

╭────────────────◆  
│> *POWERED BY DAVIDX*  
╰─────────────────◆`;

    const sentMsg = await conn.sendMessage(from, {
        image: { url: "https://files.catbox.moe/yv8zy4.jpg" },
        caption: menuText
    }, { quoted: mek });

    const messageID = sentMsg.key.id;

    const handler = async (msgData) => {
        try {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

            const quotedId = receivedMsg.message?.extendedTextMessage?.contextInfo?.stanzaId;
            const isReply = quotedId === messageID;
            if (!isReply) return;

            const replyText =
                receivedMsg.message?.conversation ||
                receivedMsg.message?.extendedTextMessage?.text || "";

            let responseText = "";

            if (replyText === "1") {
                await setAnti('gc', true);
                await setAnti('dm', true);
                config.ANTI_DEL_PATH = "same";
                fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 2)};`);
                responseText = "✅ AntiDelete Enabled.\nand Mode is Same chat\nGroup: ON\nDM: ON (same)";
            } else if (replyText === "2") {
                await setAnti('gc', true);
                await setAnti('dm', true);
                config.ANTI_DEL_PATH = "log";
                fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 2)};`);
                responseText = "✅ AntiDelete Mode changed to DM Log.\nGroup: ON\nDM: ON (log)";
            } else if (replyText === "3") {
                await setAnti('gc', false);
                await setAnti('dm', false);
                config.ANTI_DEL_PATH = "same";
                fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 2)};`);
                responseText = "❌ AntiDelete turned off for both Group and DM.";
            } else {
                responseText = "❌ Invalid input. Please reply with *1*, *2*, or *3*.";
            }

            await conn.sendMessage(from, { text: responseText }, { quoted: receivedMsg });
            conn.ev.off("messages.upsert", handler);
        } catch (err) {
            console.error("AntiDelete handler error:", err);
        }
    };

    conn.ev.on("messages.upsert", handler);
    setTimeout(() => conn.ev.off("messages.upsert", handler), 30 * 60 * 1000); // 30 دقیقه
});


cmd({
    pattern: "vv3",
    alias: ['retrive', '🔥'],
    desc: "Fetch and resend a ViewOnce message content (image/video).",
    category: "misc",
    use: '<query>',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const quotedMessage = m.msg.contextInfo.quotedMessage; // Get quoted message

        if (quotedMessage && quotedMessage.viewOnceMessageV2) {
            const quot = quotedMessage.viewOnceMessageV2;
            if (quot.message.imageMessage) {
                let cap = quot.message.imageMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(quot.message.imageMessage);
                return conn.sendMessage(from, { image: { url: anu }, caption: cap }, { quoted: mek });
            }
            if (quot.message.videoMessage) {
                let cap = quot.message.videoMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(quot.message.videoMessage);
                return conn.sendMessage(from, { video: { url: anu }, caption: cap }, { quoted: mek });
            }
            if (quot.message.audioMessage) {
                let anu = await conn.downloadAndSaveMediaMessage(quot.message.audioMessage);
                return conn.sendMessage(from, { audio: { url: anu } }, { quoted: mek });
            }
        }

        // If there is no quoted message or it's not a ViewOnce message
        if (!m.quoted) return reply("Please reply to a ViewOnce message.");
        if (m.quoted.mtype === "viewOnceMessage") {
            if (m.quoted.message.imageMessage) {
                let cap = m.quoted.message.imageMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(m.quoted.message.imageMessage);
                return conn.sendMessage(from, { image: { url: anu }, caption: cap }, { quoted: mek });
            }
            else if (m.quoted.message.videoMessage) {
                let cap = m.quoted.message.videoMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(m.quoted.message.videoMessage);
                return conn.sendMessage(from, { video: { url: anu }, caption: cap }, { quoted: mek });
            }
        } else if (m.quoted.message.audioMessage) {
            let anu = await conn.downloadAndSaveMediaMessage(m.quoted.message.audioMessage);
            return conn.sendMessage(from, { audio: { url: anu } }, { quoted: mek });
        } else {
            return reply("This is not a ViewOnce message.");
        }
    } catch (e) {
        console.log("Error:", e);
        reply("An error occurred while fetching the ViewOnce message.");
    }
});

// if you want use the codes give me credit on your channel and repo in this file and my all files 
