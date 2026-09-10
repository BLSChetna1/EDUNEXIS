const BHASHINI_USER_ID = process.env.BHASHINI_USER_ID;
const BHASHINI_API_KEY = process.env.BHASHINI_API_KEY;

function checkBhashiniCredentials() {
  if (!BHASHINI_USER_ID || !BHASHINI_API_KEY) {
    return {
      configured: false,
      message: "BHASHINI credentials are not configured yet",
    };
  }

  return {
    configured: true,
  };
}

module.exports = {
  checkBhashiniCredentials,
};