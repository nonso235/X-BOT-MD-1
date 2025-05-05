const axios = require('axios');
const { cmd } = require('../command');
cmd({
    pattern: "bible",
    alias: ["b"],
    desc: "short link with alias",
    react: "⚡",
    category: "information",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const args = q.split(', ');
        if (args.length < 2) return reply("Please provide a song for the lyrics  Usage: .bible [john 3], [16]");

        const chapter = args[0];
        const verse = args.slice(1).join(' ');

        const url = `https://bible-api.com/${encodeURIComponent(chapter)}:${encodeURIComponent(verse)}`;

        const response = await axios.get(url);
        const lyrics = response.data.lyrics;

        const linkyMes = `
╭┈───────────────•
│ *[ • X - MD - BIBLE • ]*
╰┈───────────────•
╭┈───────────────•
│  ◦ *REFERENCE*: ${reference}
│  ◦ 
│  ◦ *READING*:\n${text}
╰┈───────────────•

*•────────────•⟢*\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴀᴠɪᴅx 
*•────────────•⟢*
`;

        return reply(linkyMes);
    } catch (e) {
        console.log(e);
        return reply(`${error.message || error}`);
    }
});
    


          
