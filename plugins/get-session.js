const config = require('../config');
const { cmd } = require('../command');

cmd({
  pattern: "getsession",
  alias: ["sessionid"],
  desc: "Return SESSION_ID only",
  react: "🔐",
  category: "owner",
  filename: __filename,
}, async (conn, mek, m, { isCreator, reply }) => {
  try {
    if (!isCreator) return;

    if (!config.SESSION_ID) return;

    reply(config.SESSION_ID);

  } catch (e) {
    console.error(e);
  }
});