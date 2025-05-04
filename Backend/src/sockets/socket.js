const { getQuestion } = require('../controllers/quiz.controller');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinQuiz', () => {
            console.log('User joined quiz:', socket.id);
        });

        socket.on('startQuiz', (quizId) => {
            // console.log('Quiz started: ', quizId);
            socket.broadcast.emit('startQuiz', {
                message: 'Quiz started',
                started: true,
            });

        })

        socket.on('admin-question-change', (question) => {
            // console.log('Admin changed question:', question);
            socket.broadcast.emit('update-question', question);
        });

        socket.on('submitAnswer', (payload) => {
            console.log('User submitted answer:', payload);
            ;
        });

        socket.on('endQuiz', () => {
            // console.log('Quiz ended:', socket.id);
            socket.broadcast.emit('endQuiz', {
                message: 'Quiz ended',
                ended: true,
            });
        })

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};




