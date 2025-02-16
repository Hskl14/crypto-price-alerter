const cron = require("node-cron");
const Alert = require("../models/alertModel");
const logger = require('../utils/logger');
const config = require('../config');
const { getCryptoPriceCG } = require('../services/priceFetcher');
const { notifyUser } = require("./notifier");

async function checkAlerts() {
  try {
    logger.debug(`DEBUG | alertChecker.checkAlerts | Checking Prices for Alerts `);
    const alerts = await Alert.find({ status: "A", lastTriggeredAt: { $lte : new Date(Date.now() - config.services.alertChecker.triggerCooldown*1000)} });
    if (!alerts.length) return;

    const uniqueTickers = [...new Set(alerts.map(alert => alert.ticker))];
    const prices = await getCryptoPriceCG(uniqueTickers);

    for (const alert of alerts) {
      if (!prices[alert.ticker]) {
        logger.warn(`WARN | alertChecker.checkAlerts | Price for ${alert.ticker} not found`);
        continue;
      }

      let triggered = false;
      if (alert.conditionSide == "gte" && prices[alert.ticker] >= alert.triggerPrice) triggered = true;
      if (alert.conditionSide == "lte" && prices[alert.ticker] <= alert.triggerPrice) triggered = true;
      if (triggered) {
        logger.debug(`DEBUG | alertChecker.checkAlerts | Alert triggered | ticker: ${alert.ticker} livePrice: ${prices[alert.ticker]} triggerPrice: ${alert.triggerPrice} conditionSide: ${alert.conditionSide}`);
        notifyUser(alert.userId, alert.ticker, alert.conditionSide, prices[alert.ticker]);

        if (alert.type === "S") {
          await Alert.findByIdAndUpdate(alert.id, { status: "P", lastTriggeredAt: Date.now() })
        } else {
          await Alert.findByIdAndUpdate(alert.id, { lastTriggeredAt: Date.now() })
        }
      }
    }
  } catch (error) {
    logger.error(`ERROR | alertChecker.checkAlerts | ${error}`);
  }
}

cron.schedule(config.services.alertChecker.cronDefinition, checkAlerts);

module.exports = { checkAlerts };