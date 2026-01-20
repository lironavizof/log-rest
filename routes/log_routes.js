const express = require('express');
const Log = require('../models/log');

const router = express.Router();
// POST /api/logs
router.post('/logs', async (req, res) => {
    try {
        const doc = req.body;


        if (!doc || !doc.method || !doc.url || typeof doc.statusCode !== 'number') {
            res.locals.error = { id: 400, message:  'Invalid log payload' };
            return res.status(400).json({ id: 400, message: res.locals.error.message });
        }

        const saved = await Log.create(doc);
        return res.status(201).json(saved);
    } catch (err) {
        res.locals.error = { id: 500, message:  err.message };
        return res.status(500).json({ id: 500, message: res.locals.error.message });
    }
});

// GET /api/logs
router.get('/logs', async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).lean();
        return res.status(200).json(logs);
    } catch (err) {
        res.locals.error = { id: 500, message:  err.message };
        return res.status(500).json({ id: 1, message: res.locals.error.message });
    }
});

module.exports = router;



