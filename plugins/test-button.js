const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const os = require("os");
const { proto } = require("@whiskeysockets/baileys"); // حتما مطمئن شو این هست

cmd({
  pattern: "button",
  react: "👨‍💻",
  alias: ["panel11", "help11", "commands11"],
  desc: "Get bot's command list.",
  category: "main",
  use: ".menu",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
  try {
    const hostnameLength = os.hostname().length;
    let hostname = hostnameLength === 12 ? "replit" :
                   hostnameLength === 36 ? "heroku" :
                   hostnameLength === 8 ? "koyeb" : os.hostname();

    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
    const uptimeFormatted = runtime(process.uptime());

    const caption = `╭━━〔 ${config.BOT_NAME} Control Panel 〕━━╮
┃ 💻 Version: ${require("../package.json").version}
┃ 📦 Memory: ${memoryUsage}MB / ${totalMemory}MB
┃ ⌚ Uptime: ${uptimeFormatted}
┃ 🌐 Platform: ${hostname}
┃ ⚙️ Mode: ${config.MODE}
┃ 👤 User: ${pushname}
╰━━━━━━━━━━━━━━━━━━━━╯`;

    const message = {
      image: { url: "https://files.catbox.moe/06cgye.jpg" },
      caption: caption,
      footer: "David",
      templateButtons: [
        { index: 1, quickReplyButton: { displayText: "✅ Alive", id: ".alive" } },
        { index: 2, quickReplyButton: { displayText: "📶 Ping", id: ".ping" } },
        { index: 3, quickReplyButton: { displayText: "📋 All Menus", id: ".menu" } }
      ]
    };

    await conn.sendMessage(from, message, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error:\n${e.message}`);
  }
});