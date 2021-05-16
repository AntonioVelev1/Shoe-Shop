global.__basedir = __dirname;
const config = require('./config/config');
const dbConnector = require('./config/database');

const errorHandler = require('./utils/errorHandler');

dbConnector().then(() => {
    const app = require('express')();
    require('./config/express')(app);

    app.use(errorHandler);

    app.listen(config.port, console.log(`Listening on port ${config.port}!`));
}).catch(console.error);