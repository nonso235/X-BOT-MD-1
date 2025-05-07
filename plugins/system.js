const { cmd, commands } = require('../command');
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const fetch = require('node-fetch');


cmd({
  pattern: "delfile",
  alias: ["df", "deletefile"],
  desc: "Delete any file or folder from root or subdirectories",
  category: "system",
  react: "🗑️",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
  try {
    if (!isOwner) return reply("❌ You are not allowed to use this command.");

    if (!args[0]) return reply("❌ Provide a filename or folder name to delete.\nExample: `.delfile index.js`");

    const rawPath = args[0].trim();
    const filePath = path.resolve(process.cwd(), rawPath);

    if (!fs.existsSync(filePath)) return reply("❌ File or folder not found.");

    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }

    reply(`✅ Successfully deleted: \n\`${rawPath}\``);
  } catch (err) {
    console.error("delfile error:", err);
    reply("❌ Error: " + err.message);
  }
});


cmd({
  pattern: "dlfile",
  alias: ["dlf", "saveurrl"],
  desc: "Download file from URL, save with custom name and send",
  category: "system",
  react: "⬇️",
  filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
  try {
    if (!isOwner) return reply("❌ Only the owner can use this command.");

    const [url, ...nameParts] = args;
    if (!url || !nameParts.length) {
      return reply("❌ Usage: .downloadfile <URL> <custom-name.ext>");
    }

    const customName = nameParts.join(" ").replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = path.join(__dirname, customName);

    const res = await axios.get(url, { responseType: "stream" });
    const writer = fs.createWriteStream(filePath);

    res.data.pipe(writer);

    writer.on("finish", async () => {
      await client.sendMessage(message.chat, {
        document: fs.readFileSync(filePath),
        fileName: customName,
        mimetype: res.headers["content-type"] || "application/octet-stream"
      }, { quoted: message });

      await reply(`✅ File *${customName}* downloaded and sent successfully.`);
    }); // ← این پرانتز جا مانده بود

    writer.on("error", (err) => {
      console.error("Download error:", err);
      reply("❌ Error while saving the file.");
    });

  } catch (err) {
    console.error("DownloadFile Error:", err);
    reply(`❌ Error: ${err.message}`);
  }
});
