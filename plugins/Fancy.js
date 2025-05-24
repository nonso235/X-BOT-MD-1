const config = require('../config');
const { fancy } = require('../models/Style');
const { cmd } = require('../command');


cmd({
  pattern: 'fancy',
  alias: ['style'],
  desc: 'Fancy by DavidX.',
  category: 'tools',
  use: '.fancy',
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
    const id = args[0]?.match(/\d+/)?.join('');
    const text = args.slice(1).join(" ");

    try {
        if (id === undefined || text === undefined) {
            return reply(`\nExample : ${config.PREFIX}fancy 10 DavidX Tech\n` + String.fromCharCode(8206).repeat(4001) + fancy.list('DavidX Tech', fancy));
        }

        const selectedStyle = fancy[parseInt(id) - 1];
        if (selectedStyle) {
            return reply(fancy.apply(selectedStyle, text));
        } else {
            return reply('_Style Not Found :(_');
        }
    } catch (error) {
        console.error(error);
        return reply('_Error :(_');
    }
});
