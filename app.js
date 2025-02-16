const express = require("express");
const app = express();

const userRoutes = require("./routes/userRoutes");
const alertRoutes = require("./routes/alertRoutes");

const logger = require('./utils/logger');
const config = require('./config');
const mongoose = require('mongoose');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('*** Crypto Price Alerter Active ***');
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/alert', alertRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(config.db.connectionString, { serverApi: { version: '1', strict: true, deprecationErrors: true } });
    logger.info('MongoDB connected!');
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

if (config.services.alertChecker.runService) {
  logger.info('INFO | alertChecker | Starting Service!');
  require("./services/alertChecker")
}

app.listen(config.app.port, config.app.url, () => logger.info(`Server listening on ${config.app.url}:${config.app.port}`));

module.exports = app;
