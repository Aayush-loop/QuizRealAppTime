import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AdminLandingHome } from '../components/AdminLandingHome';
import AddQuiz from './AddQuestion';
import { AuthContext } from '../contexts/AuthContext';
import Logout from '../components/Logout';
import Loading from '../components/Loading';
import AdminResult from '../components/AdminResult';


const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (!isSidebarOpen) return;
    setSidebarOpen(false);
};


const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { loading, set } = useContext(AuthContext);
    const [user, setUser, setIsAuthenticated] = useState(useContext(AuthContext).user);

    if (loading || !user) {
        return <Loading />
    }

    if (user.role !== 'instructor') {
        setIsAuthenticated(false);
    }
    return (
        <>
            <div className="antialiased bg-gray-50 dark:bg-gray-900">
                <nav className="w-screen bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
                    <div className="flex flex-wrap justify-between items-center">

                        <Link to='/' className="flex items-center justify-between mr-4">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Quiz App</span>
                        </Link>

                        {
                            !isSidebarOpen ? (
                                <button
                                    aria-controls="drawer-navigation"
                                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                                    className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <svg
                                        aria-hidden="true"
                                        className="hidden w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <span className="sr-only">Toggle sidebar</span>
                                </button>) : (
                                <button
                                    aria-controls="drawer-navigation"
                                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                                    className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                    </svg>

                                    <span className="sr-only">Toggle sidebar</span>
                                </button>
                            )

                        }
                    </div>

                </nav>

                {/* <!-- Sidebar --> */}
                <aside
                    className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
                    aria-label="Sidenav"
                    id="drawer-navigation"
                >
                    <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
                        <ul className="space-y-2">
                            <div className="text-center text-gray-500 dark:text-gray-400 mb-5">
                                {/* <img className="mx-auto mb-4 w-36 h-36 rounded-full aspect-video object-cover ring-2 ring-gray-300 dark:ring-gray-500" src={user.image} alt="Avatar" /> */}


                                <img className="mx-auto mb-4 w-36 h-36 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src={user && user.image ? user.image : 'images/avatar.jpg'} />

                                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <a href="#">{user.name}</a>
                                </h3>
                                <p>{user.email}</p>

                            </div>

                            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                            <li>
                                <a href="#"
                                    onClick={() => {
                                        setActiveTab('home');
                                        setSidebarOpen(!isSidebarOpen)
                                    }}
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">


                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                                    </svg>

                                    <span className="ms-3">Home</span>
                                </a>
                            </li>

                            <li>
                                <a href="#" onClick={() => {
                                    setActiveTab('quiz')
                                    setSidebarOpen(!isSidebarOpen)
                                }} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                    <span className="ms-3">Quiz</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={() => {
                                    setActiveTab('result')
                                    setSidebarOpen(!isSidebarOpen)
                                }
                                } className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 9h6m-6 3h6m-6 3h6M6.996 9h.01m-.01 3h.01m-.01 3h.01M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                                    </svg>


                                    <span className="flex-1 ms-3 whitespace-nowrap">Result</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={() => {
                                    setActiveTab('logout')

                                }
                                } className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                                </a>
                            </li>

                        </ul>
                    </div>
                </aside>

                <main className="p-4 md:ml-64 h-auto min-h-screen pt-20">
                    {
                        activeTab === 'home' && (
                            <AdminLandingHome />

                        )
                    }

                    {
                        activeTab === 'quiz' && <div>
                            <AddQuiz />
                        </div>
                    }
                    {
                        activeTab === 'result' && <div>
                            <AdminResult />
                        </div>
                    }
                    {
                        activeTab === 'logout' && <div>
                            <Logout />
                        </div>
                    }
                </main>
            </div>

        </>
    )
}

export default AdminDashboard

