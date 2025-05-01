// server.js
const express   = require('express');
const cors      = require('cors');
const multer    = require('multer');
const csvToJson = require('csvtojson');
const axios     = require('axios');
const mongoose  = require('mongoose');
const FormData = require("form-data");
const fs        = require('fs');
const path      = require('path');
require('dotenv').config();

const app = express();
const PORT = 4000;

const auth = require("./middleware/auth");
const authRoutes = require("./routes/auth");

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MONGODB SETUP ─────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/IntrusAI"
const mongoURI = `${MONGO_URI}`;
mongoose.connect(mongoURI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.once('open', () => console.log('✅ MongoDB connected.'));
db.on('error', err => console.error('❌ MongoDB error:', err));

// ─── MONGOOSE SCHEMA ──────────────────────────────────────────────────────────
const ResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // references the User model
    required: true
  },
  filename:        String,
  model_response:  mongoose.Schema.Types.Mixed,
  file_data:       Buffer,
  file_mimetype:   String,
  created_at:      { type: Date, default: Date.now }
});
const ResultModel = mongoose.model('csvrecords', ResultSchema);

// ─── MULTER CONFIGURATION ─────────────────────────────────────────────────────
const upload = multer({ dest: 'uploads/' });

// Routes
app.use("/auth", authRoutes);  // Authentication routes

// ─── UPLOAD & PROCESS ROUTE ───────────────────────────────────────────────────
app.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    console.log('📁 Received:', req.file.originalname);

    // Ensure the user is available from the auth middleware
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: 'User not authenticated.' });
    }

    // 1) parse CSV → JSON
    const csvPath = path.resolve(req.file.path);
    let rows = await csvToJson().fromFile(csvPath);

    // 2) apply your custom tweaks
    rows = rows.map(r => ({
      ...r,
      'Fwd Header Length':   0,
      'Fwd Header Length.1': 23
    }));
    console.log('🔍 Parsed & tweaked JSON length:', rows.length);

    const FLASK_URL = process.env.FLASK_URL || "http://127.0.0.1:5000";
    // 3) forward to Flask ML service
    const mlRes = await axios.post(`${FLASK_URL}/predict`, rows);
    console.log('✅ ML API responded:', mlRes.data);

    // 4) read file back into a Buffer
    const fileBuffer = fs.readFileSync(csvPath);

    // 5) save file + ML response in MongoDB, including user reference
    const saved = await ResultModel.create({
      user: userId,            // Save the user ID in the 'user' field
      filename: req.file.originalname,
      model_response: mlRes.data,
      file_data: fileBuffer,
      file_mimetype: req.file.mimetype
    });
    console.log('✅ Saved to MongoDB, _id:', saved._id);

    // 6) delete temp file
    fs.unlinkSync(csvPath);

    // 7) reply to client
    return res.json({ success: true, result: mlRes.data });
  } catch (err) {
    console.error('❌ Error in /upload:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// ─── RECORDS ROUTE ───────────────────────────────────────────────────────────
app.get("/records", auth, async (req, res) => {
  try {
    // Ensure that user ID is provided in the request
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: 'User not authenticated.' });
    }

    const records = await ResultModel.find({ user: userId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// ─── HEALTH CHECK ROUTE ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('🚀 IDS API is up and running!');
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
