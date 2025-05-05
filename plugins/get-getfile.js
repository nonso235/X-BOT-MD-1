const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

cmd({
  pattern: "gitfile",
  desc: "Send a file from project folder",
  category: "system",
  filename: __filename
}, async (conn, m, { text, reply }) => {
  const isOwner = m.sender === conn.user.id.split(":")[0] + "@s.whatsapp.net";
  if (!isOwner) return reply("Only the bot owner can use this command.");

  if (!text) return reply("Please specify the file path. Example: `.gitfile lib/example.js`");

  const filePath = path.resolve(process.cwd(), text);
  
  // جلوگیری از دسترسی به فایل‌های خارج از پروژه
  if (!filePath.startsWith(process.cwd())) {
    return reply("Access denied.");
  }

  if (!fs.existsSync(filePath)) return reply("File not found.");

  try {
    await conn.sendMessage(m.chat, {
      document: fs.readFileSync(filePath),
      mimetype: 'application/octet-stream',
      fileName: path.basename(filePath)
    }, { quoted: m });
  } catch (err) {
    console.error(err);
    reply("Failed to send file.");
  }
});