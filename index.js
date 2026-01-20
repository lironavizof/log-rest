require('dotenv').config();
console.log('MONGO_URI =', process.env.MONGO_URI);

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3003;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`log-rest running on port ${PORT}`));
});

