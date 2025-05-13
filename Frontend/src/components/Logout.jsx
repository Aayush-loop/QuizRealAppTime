import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import API from '../utils/API';
import { toast } from 'react'

const Logout = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);
    const { setIsAuthenticated, setUseruser, loading, } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            const response = await API.post('/auth/logout', {}, { withCredentials: true });
            if (response.status === 200) {
                setIsAuthenticated(false);
                setUser(null);
                navigate('/');
                toast.success('Logout successful!');
            }
            else {
                toast.error('Logout failed! Please try again.');
            }
        }
        catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);

    };

    return (
        <>
            {/* Backdrop Overlay */}
            <div className={`fixed inset-0 z-40 bg-black opacity-50 ${isModalOpen ? 'block' : 'hidden'}`}></div>

            <div id="popup-modal" tabIndex="-1" className={`fixed inset-0 z-50 flex items-center justify-center ${isModalOpen ? 'block' : 'hidden'}`}>
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                        <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="popup-modal" onClick={handleModalClose}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg className="mx-auto mb-4 text-white bg-red-500 rounded-full p-2 w-12 h-12 dark:bg-red-700 dark:text-red-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500">Do you want to logout?</h3>
                            <button type="button" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={handleLogout}>
                                Yes, I'm sure
                            </button>

                            <button type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={handleModalClose}>No, cancel</button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Logout;