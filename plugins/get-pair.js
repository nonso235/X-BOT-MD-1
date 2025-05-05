//const fetch = require("node-fetch");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson} = require('../lib/functions')
const { cmd } = require("../command");

// get pair 2

cmd({
    pattern: "pair",
    alias: ["getpair"],
    react: "✅",
    desc: "Pairing code",
    category: "tools",
    use: ".pair 2349233354XXX",
    filename: __filename
}, 
async (conn, mek, m, { from, prefix, quoted, q, reply }) => {
    try {
        // Helper function for delay
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // Validate input
        if (!q) {
            return await reply("*Example -* .pair 2349133354xxx");
        }

        // Fetch pairing code
        //const fetch = require("node-fetch");
        const response = await fetch(`https://x-bot-md-session.onrender.com/code?number=${q}`);
        const pair = await response.json();

        // Check for errors in response
        if (!pair || !pair.code) {
            return await reply("Faild, try again or report to the owner using .report.");
        }

        // Success response
        const pairingCode = pair.code;
        
const doneMsg = "> PAIR CODE BROUGHT SUCCESSFULLY, JUST INPUT AND GET YOUR SESSION ID 🗿🍆";
        // Send first message
        await reply(` ${pairingCode}`);

        // Add a delay of 2 seconds before sending the second message
        await sleep(2000);

        // Send second message with just the pairing code
        await reply(`${doneMsg}`);
    } catch (error) {
        console.error(error);
        await reply("An error occurred. Please try again later.");
    }
});
