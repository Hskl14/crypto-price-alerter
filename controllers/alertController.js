const Alert = require("../models/alertModel");
const logger = require('../utils/logger');
const { validationResult } = require("express-validator");

async function getAlerts(req, res) {  
  const alertId = req.params.alertId;
  const ticker = req.params.ticker;
  const user = req.user;

  try {
    if (alertId) {
      const alert = await Alert.findById({ _id: alertId });
      if (!alert || alert.userId != user.userId) return res.status(400).json({ message: "Price Alert does not exist" });
      res.status(200).json(alert);
    } else {
      const alerts = await Alert.find({ userId: user.userId, status: "A", ...(ticker && {ticker: ticker})});
      // TODO add pagination 
      res.status(200).json(alerts);
    }
  } catch (error) {
    logger.error(`Error | alertController.getAlerts | ${error}`);
    res.status(500).json({ message: "Internal Server error" });
  }
}

async function upsertAlert(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { alertId, ticker, triggerPrice, conditionSide, alarmType, status } = req.body;
  const user = req.user;

  try {
    if (alertId) {
      const alert = await Alert.findById({ _id: alertId });
      if (!alert || alert.userId != user.userId) return res.status(200).json({ message: "Alert does not exist" });

      if (alert.status == "P" && status == "A") {
        const count = await Alert.countDocuments({ userId: user.userId, status: "A" });
        if (count+1 > 5) return res.status(200).json({ message: "You can have maximum of 5 alerts active at a time." });
      }

      await alert.updateOne({
        ...(ticker && {ticker: ticker}),
        ...(triggerPrice && {triggerPrice: triggerPrice}),
        ...(conditionSide && {conditionSide: conditionSide}),
        ...(alarmType && {alarmType: alarmType}),
        ...(status && {status: status}),
      });
      res.status(200).json(alert);
    } else {
      const count = await Alert.countDocuments({ userId: user.userId, status: "A" });
      if (count > 5) return res.status(200).json({ message: "You can have maximum of 5 alerts active at a time." });

      const alert = new Alert({
        userId: user.userId,
        type: alarmType,
        ticker: ticker,
        triggerPrice: triggerPrice,
        conditionSide: conditionSide,
      });
      await alert.save();
      res.status(200).json(alert);
    }
  } catch (error) {
    logger.error(`Error | alertController.upsertAlert | ${error}`);
    res.status(500).json({ message: "Internal Server error" });
  }
}

module.exports = { getAlerts, upsertAlert };
