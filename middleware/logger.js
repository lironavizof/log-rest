const pino = require('pino');
const Log = require('../models/log');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

module.exports = function Logger(req, res, next) {
    const start = Date.now();

    // res.on('finish', async () => {
    //     try {
    //         const doc = {
    //             method: req.method,
    //             url: req.originalUrl,
    //             statusCode: res.statusCode,
    //             endpoint: req.route?.path ? req.baseUrl + req.route.path : req.path,
    //             timestamp: new Date(),
    //             message: `HTTP ${req.method} ${req.originalUrl} finished in ${Date.now() - start}ms`
    //         };
    //
    //         // Pino log (console/file)
    //         logger.info(doc);
    //
    //         // Save to MongoDB (logs collection)
    //         await Log.create(doc);
    //     } catch (err) {
    //         logger.error({ err }, 'Failed to save log to MongoDB');
    //     }
    // });

    next();
};


