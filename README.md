## Basic Crypto Price Alerter App

A simple **Express.js** application that monitors cryptocurrency prices and sends alerts based on user-defined thresholds. Uses **MongoDB Atlas** for data storage and **CoinGecko** for price feed.

## Features
- Monitors cryptocurrency prices in real-time
- Sends alerts when price thresholds are met
- RESTful API with JWT authentication

## Prerequisites
Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 18.x recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud Database)

## Installation

1. **Clone the Repository**
   ```sh
   git clone https://github.com/Hskl14/crypto-price-alerter.git
   cd crypto-price-alerter
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Setup Config Variables**
   Edit `config.js` file in the root directory and configure it to your settings:
   ```js
   const config = {
    app: {
        url: "localhost",
        port: 3000,
        name: "crypto-price-alerter",
        jwtSecret: your_jwt_secret,
    },
    db: {
    	connectionString: "mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname?retryWrites=true&w=majority",
    }
   }
   ````

4. **Run the Application**
   ```sh
   npm start
   ```
   The app should be running at `http://localhost:3000`

## API Endpoints

| Method | Endpoint                          | Description              |
|--------|----------------------------------|--------------------------|
| POST   | /api/v1/user/register           | Register a new user     |
| POST   | /api/v1/user/login              | Login and get JWT       |
| POST   | /api/v1/alert/upsert-alert      | Create or update alert  |
| GET    | /api/v1/alert/alerts/:ticker/:id/ | Get alert/alerts       |

## Running Tests
Run unit tests with:
```sh
npm test
```

## CI/CD Integration
- GitHub Actions for automated testing and deployment.

## License
MIT License. See `LICENSE` for details.



