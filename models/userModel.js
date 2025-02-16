const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require('../utils/logger');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minLenght: 6 },
  createdAt: { type: Date, default: Date.now},
});

userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        logger.error(`Error | userSchema.presave | ${error}`);
        next(error);
    }
});

module.exports = mongoose.model("User", userSchema);
