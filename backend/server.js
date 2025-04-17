const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

app.use(cors());
app.use(express.json());

const idsRoutes = require('./routes/idsRoutes');

app.use('/api', idsRoutes);

const PORT = process.env.PORT || 5200;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});