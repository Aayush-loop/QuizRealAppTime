import React, { useContext } from 'react'
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar'

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to logout');
        }
    }
    return (
        <>
            <section class="bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div class="w-full sm: p-4 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-sm  dark:bg-gray-800 dark:border-gray-700">
                        <div class="flex items-center justify-center mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                            <img class="w-8 h-8 mr-2 rounded-full" src={'./images/avatar.jpg'} alt="logo" />
                        </div>
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class=" text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Welcome, Bishal
                            </h1>
                        </div>
                        <div className='flex flex-col items-center space-y-4'>
                            <button type="button" class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2 " onClick={() => handleLogout()}>
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                                </svg>

                                Log Out
                            </button>
                        </div>
                    </div>

                </div>
            </section>

        </>
    )
}

export default UserDashboard