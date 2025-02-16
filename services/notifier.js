const axios = require("axios");
const logger = require('../utils/logger');
const config = require('../config');

async function notifyUser(userId, ticker, conditionSide, livePrice) {
    // send email/sms/pns to user based on user preference (IYS)
}

module.exports = { notifyUser };

