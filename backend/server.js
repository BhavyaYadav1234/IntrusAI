const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const idsRoutes = require('./routes/idsRoutes');
app.use('/api', idsRoutes);

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow frontend access (you can restrict by URL later)
    },
});

// When a client connects
io.on('connection', (socket) => {
    console.log('A client connected via WebSocket');

    // Optional: disconnect log
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Function to emit intrusion updates
const sendIntrusionUpdate = (data) => {
    io.emit('new_intrusion', data);
};

// Export the emit function for other files to use
module.exports = { sendIntrusionUpdate };

app.post('/api/predict', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5300/predict', req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Flask API:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 5200;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});