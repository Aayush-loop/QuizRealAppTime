import React, { useState, useEffect } from 'react'
import { Trophy, Timer, CircleHelp, Goal, AlarmClockCheck, CircleCheckBig, RefreshCcwDot } from 'lucide-react'
import Loading from '../components/Loading'
import API from '../utils/API'

const Quiz = () => {
    const [loading, setLoading] = useState(false);
    const [quizAccumulator, setQuizAccumulator] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [showFullContent, setShowFullContent] = useState(false);

    const toggleReadMore = () => {
        setShowFullContent(!showFullContent);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/quiz?status=${activeTab}`);
            if (response.status === 200) {
                setQuizAccumulator(Array.isArray(response.data.data) ? response.data.data : []);
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [activeTab]);

    return (
        <>
            <section class="bg-white dark:bg-gray-900">
                <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div class="max-w-screen-md mb-8 lg:mb-16">
                        <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Challenge Yourself Today</h2>
                        <p class="text-gray-500 sm:text-xl dark:text-gray-400">Browse through a variety of quizzes designed to test and improve your understanding.</p>
                    </div>

                    <div className=' mx-auto border rounded-lg p-5  bg-white mb-5  dark:bg-gray-800 dark:border-gray-700'>
                        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" >
                                <li className="me-2">
                                    <a
                                        href="#"
                                        className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 'upcoming'
                                            ? 'text-blue-600 border-blue-600'
                                            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                            } dark:text-gray-400 group`}
                                        onClick={() => handleTabClick('upcoming')}
                                    >
                                        <AlarmClockCheck />
                                        <span className='ms-2'>Upcoming</span>
                                    </a>
                                </li>

                                <li className="me-2">
                                    <a
                                        href="#"
                                        className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 'completed'
                                            ? 'text-blue-600 border-blue-600'
                                            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                            } dark:text-gray-400 group`}
                                        onClick={() => handleTabClick('completed')}
                                    >
                                        <CircleCheckBig /> <span className='ms-2'>Completed</span>
                                    </a>
                                </li>

                                <li className="me-2">
                                    <a
                                        href="#"
                                        className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 'ongoing'
                                            ? 'text-blue-600 border-blue-600'
                                            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                            } dark:text-gray-400 group`}
                                        onClick={() => handleTabClick('ongoing')}
                                    >
                                        <RefreshCcwDot /><span className='ms-2'>Ongoing</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>


                    {
                        activeTab === 'upcoming' &&
                        <>
                            {
                                loading ? (
                                    <Loading />
                                ) : (
                                    quizAccumulator.length > 0 ? (
                                        <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 md:space-y-0 ">
                                            {quizAccumulator.map((quiz, index) => (
                                                <div class='border p-3 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 '>
                                                    <div class="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-blue-100 lg:h-16 lg:w-16 dark:bg-blue-900">
                                                        <Trophy />
                                                    </div>

                                                    <h3 class="mb-3 text-xl font-bold dark:text-white">{quiz.title}</h3>

                                                    <p class={`font-normal text-gray-700 dark:text-gray-400 my-3 ${showFullContent === quiz._id ? '' : 'line-clamp-3'}`}>
                                                        {quiz.description}
                                                    </p>
                                                    {quiz.description.split(' ').length > 20 && (
                                                        <button
                                                            className="text-blue-600 hover:underline text-sm mt-1"
                                                            onClick={() => setShowFullContent(prev => (prev === quiz._id ? false : quiz._id))}
                                                        >
                                                            {showFullContent === quiz._id ? 'Show less' : 'Read more'}
                                                        </button>
                                                    )}

                                                    <div className='flex gap-3 justify-between '>
                                                        <div class="flex items-center text-gray-900 rounded-lg dark:text-white  group">
                                                            <Timer />
                                                            <span class="ms-3">{'20 Min'}</span>
                                                        </div>
                                                        <div class="flex items-center text-gray-900 rounded-lg dark:text-white  group">
                                                            <CircleHelp />
                                                            <span class="ms-3">{'10 Questions'}</span>
                                                        </div>

                                                        <div class="flex items-center text-gray-900 rounded-lg dark:text-white  group">
                                                            <Goal />
                                                            <span class="ms-3">{`${quiz.fullMarks} Marks`}</span>
                                                        </div>
                                                    </div>

                                                    {/* <button type="button" class="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                        onClick={() => navigate(`/lobby/${quiz._id}`)}
                                                    >
                                                        Start Quiz
                                                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                                        </svg>
                                                    </button> */}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='flex justify-center items-center h-96'>
                                            <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                                No Quiz Found
                                            </h1>
                                        </div>
                                    )
                                )
                            }

                        </>
                    }



                    {
                        activeTab === 'completed' &&
                        <>
                            {
                                loading ? (
                                    <Loading />
                                ) : (
                                    quizAccumulator.length > 0 ? (
                                        <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 md:space-y-0 ">
                                            {quizAccumulator.map((quiz, index) => (
                                                <div class='border p-3 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 '>
                                                    <div class="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-blue-100 lg:h-16 lg:w-16 dark:bg-blue-900">
                                                        <Trophy />
                                                    </div>

                                                    <h3 class="mb-3 text-xl font-bold dark:text-white">{quiz.title}</h3>

                                                    <p class={`font-normal text-gray-700 dark:text-gray-400 my-3 ${showFullContent === quiz._id ? '' : 'line-clamp-3'}`}>
                                                        {quiz.description}
                                                    </p>
                                                    {quiz.description.split(' ').length > 20 && (
                                                        <button
                                                            className="text-blue-600 hover:underline text-sm mt-1"
                                                            onClick={() => setShowFullContent(prev => (prev === quiz._id ? false : quiz._id))}
                                                        >
                                                            {showFullContent === quiz._id ? 'Show less' : 'Read more'}
                                                        </button>
                                                    )}

                                                    <div className='flex gap-3 justify-between '>
                                                        <div class="flex items-center text-gray-900 rounded-lg dark:text-white  group">
                                                            <Timer />
                                                            <span class="ms-3">{'20 Min'}</span>
                                                        </div>
                                                        <div class="flex items-center text-gray-900 rounded-lg dark:text-white  group">
                                                            <CircleHelp />
                                                            <span class="ms-3">{'10 Questions'}</span>
                                                        </div>

                                                        <div class="flex items-center text-gray-900 rounded-lg dark:text-white  group">
                                                            <Goal />
                                                            <span class="ms-3">{`${quiz.fullMarks} Marks`}</span>
                                                        </div>
                                                    </div>

                                                    {/* <button type="button" class="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                        onClick={() => navigate(`/lobby/${quiz._id}`)}
                                                    >
                                                        Start Quiz
                                                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                                        </svg>
                                                    </button> */}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='flex justify-center items-center h-96'>
                                            <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                                No Quiz Found
                                            </h1>
                                        </div>
                                    )
                                )
                            }

                        </>
                    }


                    {
                        activeTab === 'ongoing' &&
                        <>
                            {
                                loading ? (
                                    <Loading />
                                ) : (
                                    quizAccumulator.length > 0 ? (
                                        <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 md:space-y-0 ">
                                            {quizAccumulator.map((quiz, index) => (
                                                <div class='border p-3 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 '>
                                                    <div class="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-blue-100 lg:h-16 lg:w-16 dark:bg-blue-900">
                                                        <Trophy />
                                                    </div>

                                                    <h3 class="mb-3 text-xl font-bold dark:text-white">{quiz.title}</h3>

                                                    <p class={`font-normal text-gray-700 dark:text-gray-400 my-3 ${showFullContent === quiz._id ? '' : 'line-clamp-3'}`}>
                                                        {quiz.description}
                                                    </p>
                                                    {quiz.description.split(' ').length > 20 && (
                                                        <button
                                                            className="text-blue-600 hover:underline text-sm mt-1"
                                                            onClick={() => setShowFullContent(prev => (prev === quiz._id ? false : quiz._id))}
                                                        >
                                                            {showFullContent === quiz._id ? 'Show less' : 'Read more'}
                                                        </button>
                                                    )}

                                                    <div className='flex gap-3 justify-between '>
                                                        <div class="flex items-center text-gray-900 rounded-lg dark:text-white  group">
                                                            <Timer />
                                                            <span class="ms-3">{'20 Min'}</span>
                                                        </div>
                                                        <div class="flex items-center text-gray-900 rounded-lg dark:text-white  group">
                                                            <CircleHelp />
                                                            <span class="ms-3">{'10 Questions'}</span>
                                                        </div>

                                                        <div class="flex items-center text-gray-900 rounded-lg dark:text-white  group">
                                                            <Goal />
                                                            <span class="ms-3">{`${quiz.fullMarks} Marks`}</span>
                                                        </div>
                                                    </div>

                                                    {/* <button type="button" class="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                        onClick={() => navigate(`/lobby/${quiz._id}`)}
                                                    >
                                                        Start Quiz
                                                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                                        </svg>
                                                    </button> */}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='flex justify-center items-center h-96'>
                                            <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                                No Quiz Found
                                            </h1>
                                        </div>
                                    )
                                )
                            }

                        </>
                    }

                </div>



            </section >
        </>
    )
}

export default Quiz