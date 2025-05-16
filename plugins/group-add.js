const { cmd, commands } = require("../command"); 

cmd(
  {
    pattern: "add",
    desc: "Adds a person to group",
    category: "group",
    filename: __filename,
  },
  async (conn, mek, m, { from, quoted, args, reply, isGroup, isBotAdmins }) => {
try{
    if (!isGroup) return reply("_This command is for groups_");
    if (!isBotAdmins) return reply("_I'm not admin_");
    if (!args[0] && !quoted) return reply("_Mention user to add_"); 

    let jid = quoted ? quoted.sender : args[0] + "@s.whatsapp.net";
    await conn.groupParticipantsUpdate(from, [jid], "add");
    return reply(`@${jid.split("@")[0]} added`, { mentions: [jid] });
}catch(e){
console.log(e)
m.reply(`${e}`)
}
  }
); 
