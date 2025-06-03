const { cmd } = require("../command");

cmd({
  on: "body"
}, async (conn, mek, m, { from, body }) => {
  const lowerBody = body.toLowerCase();
  if (!["save", "send"].includes(lowerBody)) return;
  if (!mek.quoted) {
    return await conn.sendMessage(from, {
      text: "*Reply to a message*"
    }, { quoted: mek });
  }

  try {
    const buffer = await mek.quoted.download();
    const mtype = mek.quoted.mtype;
    const options = { quoted: mek };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: mek.quoted.text || '',
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: mek.quoted.text || '',
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: mek.quoted.ptt || false
        };
        break;
      case "stickerMessage":
        messageContent = {
          sticker: buffer
        };
        break;
      default:
        return await conn.sendMessage(from, {
          text: "*Only video, image, stickers & audio messages are currently supported*"
        }, { quoted: mek });
    }

    await conn.sendMessage(from, messageContent, options);
  } catch (error) {
    console.error("Save Error:", error);
    await conn.sendMessage(from, {
      text: "*Eror saving stuffs*:\n" + error.message
    }, { quoted: mek });
  }
});
