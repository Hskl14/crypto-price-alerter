const mongoose = require("mongoose");
const { status, alertTypes } = require("../utils/constants");

const alertSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    ticker: { type: String, required: true },
    triggerPrice: { type: Number, required: true },
    conditionSide: { type: String, required: true },
    type: { type: String, default: alertTypes.single },
    status: { type: String, default: status.active },
    createdAt: { type: Date, default: Date.now },
    lastTriggeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Alert", alertSchema);
