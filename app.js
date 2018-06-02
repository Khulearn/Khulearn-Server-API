process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('./config/express_config');
const config = require('./config/config');
const tibero = require('./app/apis/odbc');

tibero.connect();
const app = express();
app.listen(3000);
module.exports = app;

console.log('Server running at ' + config.ip);
