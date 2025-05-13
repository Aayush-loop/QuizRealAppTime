import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import API from "../utils/API"
import { AuthContext } from '../contexts/AuthContext'

const Login = () => {
    const navigate = useNavigate()
    const { setUser, setIsAuthenticated } = React.useContext(AuthContext)
    const [logindata, setLoginData] = useState({
        email: null,
        password: null,
    })

    const handleChange = (e) => {
        setLoginData({
            ...logindata,
            [e.target.name]: e.target.value
        })
        // console.log(logindata)
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await API.post('/auth/login', logindata, { withCredentials: true });
            if (response.status === 200) {

                toast.success(response.data.message);
                setIsAuthenticated(true)
                setUser(response.data.data)
                if (response.data.data.role === "student") {
                    navigate('/dashboard');
                }
                else {
                    navigate('/admin')
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-10  justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Login here
                            </h1>


                            <div className="p-4 md:p-5">
                                <form className="space-y-4" method='post' onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="abc@example.com" required onChange={handleChange} autoComplete='off' />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                                        <input type="password" name="password" id="password" placeholder="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required onChange={handleChange} autoComplete='off' />
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
                                            </div>
                                            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                                        </div>
                                        {/* <a href="#" className="font-sm text-blue-600 hover:underline dark:text-blue-500">Forgot Password?</a> */}
                                    </div>
                                    <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        Not have an account? <Link to='/register' className="font-medium text-blue-600 hover:underline dark:text-blue-500">Register here</Link>
                                    </p>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login