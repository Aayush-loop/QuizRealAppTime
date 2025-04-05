import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'
import Quiz from './pages/Quiz'
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  return (
    <>
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
          <Route path='/quiz' element={<Quiz />} />
          <Route path='/admin' element={<AdminDashboard />} />
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App