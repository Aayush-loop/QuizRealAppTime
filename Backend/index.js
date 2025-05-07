const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    },
});

app.set('io', io);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));


// Routes
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.route');
const quizRoutes = require('./src/routes/quiz.route');
const resultRoutes = require('./src/routes/result.route');
app.get('/api/v1', (req, res) => {
    res.json({ message: "Welcome to the API" });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/result', resultRoutes);

//require('./src/sockets/socket')(io);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
