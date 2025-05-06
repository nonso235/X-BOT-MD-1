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
        
        if (q) return reply("Please provide a Bible verse   Usage: .bible John 3:16");

        const url = `https://api.giftedtech.web.id/api/tools/bible?apikey=gifted&verse=${encodeURIComponent(q)}`;

        const response = await axios.get(url);
        const reading = response.result;

        const linkyMes = `
╭┈───────────────•
│ *[ • X - MD - BIBLE • ]*
╰┈───────────────•
╭┈───────────────•
│  ◦ *REFERENCE*: ${reading.verse}
│  ◦ 
│  ◦ *READING*:\n${reading.data}
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
    


          
