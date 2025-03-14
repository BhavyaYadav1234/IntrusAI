const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Intrusion = require('../models/Intrusion');

dotenv.config();
connectDB();

const sampleData = [
    { type: 'Port Scan', severity: 'High', sourceIP: '192.168.1.10' },
    { type: 'Brute Force', severity: 'Medium', sourceIP: '192.168.1.20' },
    { type: 'Malware', severity: 'Critical', sourceIP: '192.168.1.30' },
];

const importData = async() => {
    try {
        await Intrusion.deleteMany(); // Clear existing data
        await Intrusion.insertMany(sampleData);
        console.log('Sample data inserted!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();