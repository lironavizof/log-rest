const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
    {
            service: { type: String },
        method: { type: String, required: true },
        url: { type: String, required: true },
        statusCode: { type: Number, required: true },
        endpoint: { type: String }, // למשל: "/api/logs"
        timestamp: { type: Date, default: Date.now },
        message: { type: String },
            error: { type: String, required: false }

    },
    { versionKey: false }
);

module.exports = mongoose.model('log', logSchema);

