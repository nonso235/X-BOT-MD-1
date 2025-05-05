const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "update-file",
  react: "⬇️",
  desc: "Update local file from a URL",
  category: "owner",
  use: ".update-file file.js:https://url.com/file.js",
  filename: __filename,
}, async (conn, mek, m, { q, isCreator }) => {
  try {
    if (!isCreator) return;
    if (!q || !q.includes(":")) return;

    const [fileNameRaw, urlRaw] = q.split(":");
    let url = urlRaw.trim();
    const fileName = fileNameRaw.trim();

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const filePath = path.resolve(__dirname, "..", fileName);
    const response = await axios.get(url);

    fs.writeFileSync(filePath, response.data);

  } catch (e) {
    console.error("Silent Update Error:", e);
  }
});