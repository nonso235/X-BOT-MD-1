const axios = require('axios');
const { cmd } = require('../command');
cmd({
    pattern: "lyric",
    alias: ["lyrics"],
    desc: "short link with alias",
    react: "⚡",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const args = q.split(', ');
        if (args.length < 2) return reply("Please provide a song for the lyrics  Usage: .lyrics [artist], [title]");

        const artist = args[0];
        const title = args.slice(1).join(' ');

        const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;

        const response = await axios.get(url);
        const lyrics = response.data.lyrics;

        const linkyMes = `
╭┈───────────────•
│ *[ • X - MD - LYRICS • ]*
╰┈───────────────•
╭┈───────────────•
│  ◦ *NAME*: ${title}
│  ◦ 
│  ◦ *LYRICS*:\n${lyrics}
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
    


          
