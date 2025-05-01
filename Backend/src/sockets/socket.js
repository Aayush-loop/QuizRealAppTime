const { getQuestion } = require('../controllers/quiz.controller');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('admin-question-change', (question) => {
            // Broadcast to all students (except admin)
            console.log('Admin changed question:', question);
            socket.broadcast.emit('update-question', question);
        });



        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};




