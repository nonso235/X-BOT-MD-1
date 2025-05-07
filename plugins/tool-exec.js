const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const os = require("os");
const FormData = require("form-data");
const fetch = require('node-fetch');
const AdmZip = require('adm-zip'); // استفاده از adm-zip
const { exec } = require('child_process');

cmd({
    pattern: "exec",
    alias: ["exec2"],
    desc: "exec an npm package",
    category: "system",
    react: "🔧",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
    if (!isOwner) {
        return reply("❌ You are not allowed to use this command.");
    }

    // اگر بسته‌ای وارد نشده باشد
    if (args.length === 0) {
        return reply("❌ Please provide the package name.\nExample: `.exec qrcode`");
    }

    const exec = args.join(" ");  // گرفتن نام بسته از ورودی

    try {
        // اجرای دستور نصب بسته
        exec(`${exec}`, (error, stdout, stderr) => {
            if (error) {
                return reply(`❌ Error installing exec: ${error.message}`);
            }
            if (stderr) {
                return reply(`❌ Error: ${stderr}`);
            }
            return reply(`✅ exec "${packageName}" installed successfully.\nOutput: ${stdout}`);
        });
    } catch (err) {
        console.error("Error:", err);
        reply(`❌ Something went wrong: ${err.message}`);
    }
});

