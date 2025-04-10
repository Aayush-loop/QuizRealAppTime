import React, { useState, useContext } from 'react';
import { DarkThemeToggle } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-full flex flex-wrap items-center justify-between mx-auto p-4">
                    <div onClick={() => navigate('/')} className="flex items-center space-x-3 rtl:space-x-reverse">
                        <p className='text-lg  dark:text-white'> Quiz App</p>
                    </div>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        {
                            isAuthenticated && user ? (
                                <img className="w-8 h-8 rounded-full" src={user.picture || '/images/avatar.jpg'} alt="user photo" onClick={() => navigate('/dashboard')} />
                            ) : (
                                <button type="button" className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => navigate('/login')}>Login</button>
                            )
                        }

                        <DarkThemeToggle />
                        <button onClick={toggleCollapse} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-expanded={!isCollapsed}>
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>

                    </div>
                    <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isCollapsed ? 'hidden' : ''}`} id="navbar-user">
                        {/* <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <div className=" cursor-pointer block py-2 px-3 text-white bg-purple-700 rounded md:bg-transparent md:text-purple-700 md:p-0 md:dark:text-purple-700" aria-current="page" onClick={() => navigate('/')}>Home</div>
                            </li>
                        </ul> */}
                    </div>
                </div>

            </nav>
        </>
    );
};

export default Navbar;
