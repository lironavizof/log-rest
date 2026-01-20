require('dotenv').config();

const express = require('express');
const requestLogger = require('./middleware/logger');
const logRoutes = require('./routes/log_routes');

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use('/api', logRoutes);

app.use((req, res) => {
    res.status(404).json({ id: 404, message: 'Route not found' });
});

module.exports = app;
