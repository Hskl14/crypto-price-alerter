const axios = require("axios");
const logger = require('../utils/logger');

const coinIds = { "BTC": "bitcoin", "ETH": "ethereum" }

async function getCryptoPriceCG(tickers) {
  try {
    const normalizedSymbols = tickers.map(ticker => coinIds[ticker.toUpperCase()]);
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${normalizedSymbols.join(',')}&vs_currencies=usd`);
    return tickers.reduce((prices, ticker) => {
      if (response.data[coinIds[ticker.toUpperCase()]]) {
          prices[ticker] = response.data[coinIds[ticker.toUpperCase()]].usd;
      }
      return prices;
  }, {});
  } catch (error) {
    logger.error(`ERROR | priceFetcher.getCryptoPriceCG | ${error}`);
  }
}

// TODO add fallback price source ie. Binance
// async function getCryptoPriceBinance(symbol) { 
//     try {
//         const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
//         return response;
//       } catch (error) {
//         logger.error(`Error | priceFetcher.getCryptoPriceBinance | ${error}`);
//       }
//   }

module.exports = { getCryptoPriceCG };

