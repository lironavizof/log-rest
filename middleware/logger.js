const pino = require('pino');
const Log = require('../models/log');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

module.exports = function Logger(req, res, next) {
    const start = Date.now();


    next();
};


