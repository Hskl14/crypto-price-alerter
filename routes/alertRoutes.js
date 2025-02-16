const express = require("express");
const { upsertAlert, getAlerts } = require("../controllers/alertController");
const authMiddleware = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.get("/alerts/:ticker?/:alertId?", authMiddleware, getAlerts);
router.post("/upsert-alert", [
    authMiddleware,
    check("ticker", "Ticker is required").isIn(["BTC", "ETH"]),
    check("triggerPrice", "triggerPrice is required").isNumeric(),
    check("conditionSide", "conditionSide is not valid").isIn(['lte', 'gte']),
    check("alarmType", "alarmType is not valid").isIn(['S', 'L']),
    check("status", "status is not valid").isIn(['A', 'P']),
], upsertAlert);
// TODO add validation schema and improve validations 

module.exports = router;
