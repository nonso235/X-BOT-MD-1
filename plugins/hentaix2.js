const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

// Base API URLs
const fantoxApiUrl = "https://fantox-apis.vercel.app";
const giftedApiUrl = "https://api.gifted.my.id/api";

// Helper function to clear a reaction after 5 seconds
async function clearReaction(m) {
  try {
    // Calling m.react("") is an example; adjust it according to your bot’s API for removing reactions
    await m.react("");
  } catch (e) {
    console.error("Error clearing reaction:", e);
  }
}

/* ------------------------------------------------------------------
   1. NSFW Image Commands (dynamic endpoints)
   ------------------------------------------------------------------ */
const endpoints = [
  "genshin", "swimsuit", "schoolswimsuit", "white", "barefoot", "touhou",
  "gamecg", "hololive", "uncensored", "sunglasses", "glasses", "weapon",
  "shirtlift", "chain", "fingering", "flatchest", "torncloth", "bondage",
  "demon", "wet", "pantypull", "headdress", "headphone", "tie", "anusview",
  "shorts", "stokings", "topless", "beach", "bunnygirl", "bunnyear", "idol",
  "vampire", "gun", "maid", "bra", "nobra", "bikini", "whitehair", "blonde",
  "pinkhair", "bed", "ponytail", "nude", "dress", "underwear", "foxgirl",
  "uniform", "skirt", "sex", "sex2", "sex3", "breast", "twintail",
  "spreadpussy", "tears", "seethrough", "breasthold", "drunk", "fateseries",
  "spreadlegs", "openshirt", "headband", "food", "close", "tree", "nipples",
  "erectnipples", "horns", "greenhair", "wolfgirl", "catgirl"
];

endpoints.forEach((endpoint) => {
  cmd(
    {
      pattern: endpoint,
      desc: `Send pictures of random ${endpoint}s!`,
      category: "hentai",
      react: "🍑",
      filename: __filename,
    },
    async (
      conn,
      mek,
      m,
      { from, quoted, body, isCmd, command, args, q, isGroup, sender, botNumber, pushname, isMe, isOwner, reply }
    ) => {
      try {
        const res = await fetch(`${fantoxApiUrl}/${endpoint}`);
        const json = await res.json();

        if (!json.url)
          return reply(`*Request Denied for ${endpoint}!*`);

        const caption = `Here's a pic of ${endpoint}`;
        await conn.sendMessage(
          m.chat,
          { image: { url: json.url }, caption },
          { quoted: m }
        );

        // Clear reaction after 5 seconds.
        setTimeout(() => {
          clearReaction(m);
        }, 5000);
      } catch (e) {
        reply(`Error in ${endpoint} command:\n\n${e}`);
      }
    }
  );
});

/* ------------------------------------------------------------------
   2. xsearch Command for NSFW content search
   ------------------------------------------------------------------ */
cmd(
  {
    pattern: "xsearch",
    desc: "Search for NSFW content based on a query.",
    category: "hentai",
    react: "🔍",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, botNumber, pushname, isMe, isOwner, reply }
  ) => {
    try {
      const query = args.slice(1).join(" ");
      if (!query)
        return reply("Please provide a search term, e.g., `.xsearch mom and son`.");

      await reply("fetching results please wait....");

      const searchUrl = `${giftedApiUrl}/search/xnxxsearch?apikey=gifted_api_6hf50c4j&query=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl);
      if (!response.ok)
        return reply(`*_Error: ${response.status} ${response.statusText}_*`);

      const data = await response.json();
      if (
        !data.success ||
        !data.results ||
        data.results.length === 0
      ) {
        return reply(`No results found for "${query}".`);
      }

      let message = `*Results for "${query}":*\n\n`;
      data.results.forEach((result, index) => {
        message += `${index + 1}. ${result.title}\nLink: ${result.link}\n\n`;
      });

      await reply(message);
      setTimeout(() => {
        clearReaction(m);
      }, 5000);
    } catch (e) {
      reply(`Error in xsearch command:\n\n${e}`);
    }
  }
);

/* ------------------------------------------------------------------
   3. xdl Command for NSFW Video Download
   ------------------------------------------------------------------ */
cmd(
  {
    pattern: "xdl",
    alias: ["xx"],
    desc: "Download video from a given link.",
    category: "hentai",
    react: "⏳",
    filename: __filename,
    use: "<Video URL>",
  },
  async (
    conn,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, botNumber, pushname, isMe, isOwner, reply }
  ) => {
    try {
      if (args.length < 1)
        return reply("*Please provide a video URL*");
      const videoUrl = args[1];

      const apiUrl = `${giftedApiUrl}/download/xnxxdl?apikey=gifted_api_6hf50c4j&url=${encodeURIComponent(videoUrl)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      console.log("API Response:", data);

      if (
        data.success &&
        data.result &&
        data.result.files &&
        data.result.files.high
      ) 
        const videoDownloadUrl = data.result.files.high;
        const caption = data.result.title;
        await conn.sendMessage(from, {
            video: { url: videoDownloadUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Error in xdl downloader command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
        
