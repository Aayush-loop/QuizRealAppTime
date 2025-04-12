import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'
import { AuthProvider } from './contexts/AuthContext'
import AddQuiz from './pages/AddQuiz'
import AdminDashboard from './pages/AdminDashboard'
import Registration from './pages/Registration'
import ResultAnalysis from './components/ResultAnalysis'
import Playground from './components/Playground'

const App = () => {
  return (
    <>
      <AuthProvider>
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

          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<UserDashboard />} />
            <Route path='/addquiz' element={<AddQuiz />} />
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/register' element={<Registration />} />
            {/* <Route path='/quiz/' element={<Quiz />} /> */}
            <Route path='result-analysis' element={<ResultAnalysis />} />
            <Route path='/playground' element={<Playground />} />
          </Routes>

          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App