const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const connectDB = require('./src/db/database');
const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');
const newsRoutes = require('./src/routes/news');
const bookmarkRoutes = require('./src/routes/bookmarks');
const aiRoutes = require('./src/routes/ai');

connectDB();
const corsOptions = {
    origin: process.env.VITE_FRONTEND_URL,  // Use VITE_FRONTEND_URL from .env
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server Is Running Successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});