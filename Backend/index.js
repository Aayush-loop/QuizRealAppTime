const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.route');
const quizRoutes = require('./src/routes/quiz.route');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/v1', (req, res) => {
    res.json({
        message: "Welcome to the API"
    })
});

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/quiz', quizRoutes);

const PORT = process.env.PORT
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});