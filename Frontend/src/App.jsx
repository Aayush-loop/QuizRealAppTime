import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'
import { AuthProvider } from './contexts/AuthContext'
import AdminDashboard from './pages/AdminDashboard'
import Registration from './pages/Registration'
import ResultAnalysis from './components/ResultAnalysis'
import Playground from './components/Playground'
import AdminQuizController from './components/AdminQuizController'
import QuizStartPage from './pages/QuizStartPage'
import Lobby from './pages/Lobby'
import ProtectedRoute from './utils/ProtectedRoute'
import { Flowbite } from "flowbite-react";
import { SocketProvider } from './contexts/SocketContext';

const App = () => {
  return (
    <>
      <AuthProvider>
        <SocketProvider >
          <BrowserRouter>
            <ToastContainer position="top-right"

              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition:Bounce />

            <Flowbite>
              <Routes>
                <Route path='/' element={<Homepage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/dashboard' element={<ProtectedRoute element={<UserDashboard />} />} />
                <Route path='/admin' element={<ProtectedRoute element={<AdminDashboard />} />} />
                <Route path='/register' element={<Registration />} />
                <Route path='result-analysis/:resultId' element={<ResultAnalysis />} />
                <Route path='/playground/:quizId' element={<Playground />} />
                <Route path='/admin-quiz-controller/:quizId' element={<AdminQuizController />} />
                <Route path='/start-quiz/:quizId' element={<QuizStartPage />} />
                <Route path='/lobby/:quizId' element={<Lobby />} />
              </Routes>
            </Flowbite>
            <ToastContainer />
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </>
  )
}

export default App