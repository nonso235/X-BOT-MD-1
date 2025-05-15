const config = require('./config')
      const fs = require('fs'),
      path = require('path'),
      axios = require('axios'),
      sessionDir = path.join(__dirname, 'sessions'),
      credsPath = path.join(sessionDir, 'creds.json'),
      createDirIfNotExist = dir => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

createDirIfNotExist(sessionDir);

const SESSIONS_BASE_URL = 'https://pair-md-db.onrender.com'; // Your Backened Url Here
const SESSIONS_API_KEY = 'xylo-ai'; // Must Match one of your Backened ApiKeys

async function loadSession() {
  try {
    if (!config.SESSION_ID) {
      console.log('No SESSION_ID Provided - Using QR Code Authentication');
      return true;
    }

    const credsId = config.SESSION_ID;

    if (!credsId.startsWith('XBOT-MD~')) {
      console.log('Invalid SESSION_ID: It must start with "XBOT-MD~"');
      return false;
    }

    const sessionDir = path.join(__dirname, '../sessions');
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    const response = await axios.get(`${SESSIONS_BASE_URL}/api/downloadCreds.php/${credsId}`, {
      headers: {
        'x-api-key': SESSIONS_API_KEY
      }
    });

    if (!response.data.credsData) {
      throw new Error('No sessionData Received from Server');
    }

    const credsPath = path.join(sessionDir, 'creds.json');
    fs.writeFileSync(credsPath, JSON.stringify(response.data.credsData), 'utf8');
    console.log('Session Loaded ✅');
    return response.data.credsData;
  } catch (error) {
    console.error('Error loading session:', error.response?.data || error.message);
    return null;
  }
}

module.exports = { loadSession }
