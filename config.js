const config = {
    app: {
        url: "localhost",
        port: 3000,
        name: "crypto-price-alerter",
        jwtSecret: "sillysecret",
    },
    log: {
        level: "debug",
        filename: "express",
    },
    db: {
        connectionString: "mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    },
    services: {
        alertChecker: {
            runService: true,
            cronDefinition: '*/30 * * * * *',
            triggerCooldown: 300, // 5 min
        }
    },
};

module.exports = config;

