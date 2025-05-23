 const fs = require('fs'),
      path = require('path'),
      axios = require('axios'),
      sessionDir = path.join(__dirname, 'sessions'),
      credsPath = path.join(sessionDir, 'creds.json'),
      createDirIfNotExist = dir => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

createDirIfNotExist(sessionDir);

const SESSIONS_BASE_URL = 'https://pair-md-db.onrender.com'; // Your Backened Url Here
const SESSIONS_API_KEY = 'xylo-ai'; // Must Match one of your Backened ApiKeys
const config = require('../config');
// config or env path 

async function loadSession() {
    try {
        if (!config.SESSION_ID) {
            console.log('No SESSION_ID provided - go get your session id first');
            return null;
        }

      
        console.log('Downloading creds data...');
        if (config.SESSION_ID.startsWith('XBOT-MD~')) {
            console.log('Downloading Mongo session...');
            const response = await axios.get(`${SESSIONS_BASE_URL}/api/downloadCreds.php/${config.SESSION_ID}`, {
                headers: { 'x-api-key': SESSIONS_API_KEY }
            });

            if (!response.data.credsData) {
                throw new Error('No credential data received from Mongo server');
            }

            fs.writeFileSync(credsPath, JSON.stringify(response.data.credsData), 'utf8');
            console.log('✅ Mongo session downloaded successfully');
            return response.data.credsData;
        } 
        else {
            console.log('Downloading MEGA.nz sezsion...');
const megaFileId = config.SESSION_ID.startsWith('XBOT-MD~') 
    ? config.SESSION_ID.replace("XBOT-MD~", "") 
    : config.SESSION_ID;

const filer = File.fromURL(`https://mega.nz/file/${megaFileId}`);
            
            const data = await new Promise((resolve, reject) => {
                filer.download((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            
            fs.writeFileSync(credsPath, data);
            console.log('✅ MEGA session downloaded successfully');
            return JSON.parse(data.toString());
        }
    } catch (error) {
        console.error('❌ Error loading session:', error.message);
        console.log('Get new session id and try again');
        return null;
    }
}

module.exports = { loadSession }
