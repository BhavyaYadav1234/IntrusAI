// server.js
const express   = require('express');
const cors      = require('cors');
const multer    = require('multer');
const csvToJson = require('csvtojson');
const axios     = require('axios');
const mongoose  = require('mongoose');
const fs        = require('fs');
const path      = require('path');

const app = express();
const PORT = 4000;

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
  filename:        String,
  model_response:  mongoose.Schema.Types.Mixed,
  file_data:       Buffer,
  file_mimetype:   String,
  created_at:      { type: Date, default: Date.now }
});
const ResultModel = mongoose.model('csvrecords', ResultSchema);

// ─── MULTER CONFIGURATION ─────────────────────────────────────────────────────
const upload = multer({ dest: 'uploads/' }); 
// stores uploaded CSVs temporarily on disk

// ─── UPLOAD & PROCESS ROUTE ───────────────────────────────────────────────────
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    console.log('📁 Received:', req.file.originalname);

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

    // 5) save file + ML response in MongoDB
    const saved = await ResultModel.create({
      filename:      req.file.originalname,
      model_response: mlRes.data,
      file_data:     fileBuffer,
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

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('🚀 IDS API is up and running!');
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
