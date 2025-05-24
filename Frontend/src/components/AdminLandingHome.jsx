import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import ModalHandler from '../utils/Modalhandler';
import Loading from '../components/Loading'
import API from '../utils/API'
import { toast } from 'react-toastify'
import { CircleCheckBig, AlarmClockCheck, RefreshCcwDot, Users, Calendar, BarChart2 } from 'lucide-react'



export const AdminLandingHome = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [quizAccumulator, setQuizAccumulator] = useState([]);

    const [activeTab, setActiveTab] = useState('upcoming');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const openModal = (modal) => setActiveModal(modal);
    const closeModal = () => setActiveModal(null);

    const resetQuiz = () => {
        setQuiz({
            title: '',
            description: '',
            date: '',
            time: '',
            fullMarks: '',
            passMarks: '',
            topic: '',
            numberOfQuestions: '',
            bannerImage: null,
        })
    }

    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        fullMarks: '',
        passMarks: '',
        topic: '',
        numberOfQuestions: '',
        bannerImage: null,

    })


    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            const formData = new FormData();
            formData.append('title', quiz.title);
            formData.append('description', quiz.description);
            formData.append('date', quiz.date);
            formData.append('time', quiz.time);
            formData.append('fullMarks', quiz.fullMarks);
            formData.append('passMarks', quiz.passMarks);
            formData.append('topic', quiz.topic);
            formData.append('numberOfQuestions', quiz.numberOfQuestions);
            formData.append('bannerImage', quiz.bannerImage);

            const response = await API.post('/quiz/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {

                setLoading(false);
                closeModal();
                resetQuiz();
                toast.success('Quiz created successfully')
            }
            else {
                setLoading(false);
                toast.error(response.data.message || 'Something went wrong')
            }

        } catch (error) {
            setLoading(false);
            toast.error('Something went wrong')
        }
    }

    const handleChange = (e) => {
        if (e.target.name === 'bannerImage') {
            setQuiz({ ...quiz, [e.target.name]: e.target.files[0] })
        }
        else {
            setQuiz({ ...quiz, [e.target.name]: e.target.value })
        }
    }

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

    const handleStartQuiz = (quizId) => {
        navigate(`/start-quiz/${quizId}`)
    }

    useEffect(() => {
        fetchQuizzes();
    }, [activeTab]);

    return (
        <>
            <div className=' mx-auto border rounded-lg p-5  bg-white mb-5 dark:bg-gray-800 dark:border-gray-700'>
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 mb-3">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Create Quiz
                    </h3>

                    <button className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => openModal('CreateQuizModal')}>
                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                        Create
                    </button>
                </div>
            </div>

            <div className=' mx-auto border rounded-lg p-5  bg-white mb-5 dark:bg-gray-800 dark:border-gray-700 '>
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
                                <div className='flex flex-col gap-3'>
                                    {quizAccumulator.map((quiz, index) => (
                                        <div className="border rounded-lg px-6 py-4 bg-white dark:bg-gray-800 dark:border-gray-700 w-full">
                                            <div className="flex flex-col gap-4  w-full">

                                                <div className="flex items-center justify-between w-full md:w-auto">
                                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                        {quiz.title}
                                                    </h3>
                                                    <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">Upcoming</span>
                                                </div>

                                                <div className='flex items-center justify-between w-full md:w-auto'>
                                                    <div className="flex flex-wrap md:flex-nowrap justify-start items-center gap-6 text-sm text-gray-700 dark:text-gray-300 w-full">
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            <span>10 Attempts</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{quiz.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <BarChart2 className="w-4 h-4" />
                                                            <span>100 % Passed</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        href="#"
                                                        className="text-blue-600 font-medium hover:underline whitespace-nowrap cursor-pointer"
                                                        onClick={() => handleStartQuiz(quiz._id)}
                                                    >
                                                        Start
                                                    </button>
                                                </div>
                                            </div>
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
                                <div className='flex flex-col gap-3'>
                                    {quizAccumulator.map((quiz, index) => (
                                        <div className="border rounded-lg px-6 py-4 bg-white dark:bg-gray-800 dark:border-gray-700 w-full">
                                            <div className="flex flex-col gap-4  w-full">

                                                <div className="flex items-center justify-between w-full md:w-auto">
                                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                        {quiz.title}
                                                    </h3>
                                                    <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Completed</span>
                                                </div>

                                                <div className='flex items-center justify-between w-full md:w-auto'>
                                                    <div className="flex flex-wrap md:flex-nowrap justify-start items-center gap-6 text-sm text-gray-700 dark:text-gray-300 w-full">
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            <span>10 Attempts</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{quiz.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <BarChart2 className="w-4 h-4" />
                                                            <span>100 % Passed</span>
                                                        </div>
                                                    </div>
                                                    {/* <button
                                                        href="#"
                                                        className="text-blue-600 font-medium hover:underline whitespace-nowrap cursor-pointer"
                                                        onClick={() => handleStartQuiz(quiz._id)}
                                                    >
                                                        Start
                                                    </button> */}
                                                </div>
                                            </div>
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
                                <div className='flex flex-col gap-3'>
                                    {quizAccumulator.map((quiz, index) => (
                                        <div className="border rounded-lg px-6 py-4 bg-white dark:bg-gray-800 dark:border-gray-700 w-full">
                                            <div className="flex flex-col gap-4  w-full">

                                                <div className="flex items-center justify-between w-full md:w-auto">
                                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                        {quiz.title}
                                                    </h3>
                                                    <span class="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">Ongoing</span>
                                                </div>

                                                <div className='flex items-center justify-between w-full md:w-auto'>
                                                    <div className="flex flex-wrap md:flex-nowrap justify-start items-center gap-6 text-sm text-gray-700 dark:text-gray-300 w-full">
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            <span>10 Attempts</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{quiz.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <BarChart2 className="w-4 h-4" />
                                                            <span>100 % Passed</span>
                                                        </div>
                                                    </div>
                                                    {/* <button
                                                        href="#"
                                                        className="text-blue-600 font-medium hover:underline whitespace-nowrap cursor-pointer"
                                                    onClick={() => handleStartQuiz(quiz._id)}
                                                    >
                                                        Start
                                                    </button> */}
                                                </div>
                                            </div>
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

            <ModalHandler title='Create Quiz' isVisible={activeModal === 'CreateQuizModal'} onClose={closeModal}>
                {
                    loading ? <Loading /> : (
                        <>
                            <form method='post' encType='multipart/form-data' onSubmit={handleSubmit} className="p-2 pt-0">
                                <div className="grid gap-4 mb-2 grid-cols-2">
                                    <div className="col-span-2">
                                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                        <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Title " onChange={handleChange} />
                                    </div>

                                    <div className="col-span-2">
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                        <textarea id="description" rows="3" name='description' className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write description here" onChange={handleChange} ></textarea>
                                    </div>
                                </div>


                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label for="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                                        <input type="date" name="date" id="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" onChange={handleChange} />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">


                                        <label for="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                            <input type="time" id="time" name='time' className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handleChange} />
                                        </div>


                                    </div>
                                </div>

                                <div className="grid gap-4 mb-2 grid-cols-2">

                                    <div className="col-span-2 sm:col-span-1">
                                        <label for="fullMarks" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Marks</label>
                                        <input type="text" name="fullMarks" id="fullMarks" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" onChange={handleChange} />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label for="passMarks" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pass Marks</label>
                                        <input type="text" name="passMarks" id="passMarks" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" onChange={handleChange} />

                                    </div>

                                </div>


                                <div className="grid gap-4 mb-2 grid-cols-2">

                                    <div className="col-span-2 sm:col-span-1">
                                        <label for="topic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Topic</label>
                                        <input type="text" name="topic" id="topic" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" onChange={handleChange} />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label for="numberOfQuestions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No of Questions</label>
                                        <input type="text" name="numberOfQuestions" id="numberOfQuestions" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" onChange={handleChange} />

                                    </div>

                                </div>


                                <div className="grid mb-2 grid-cols-1">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="bannerImage">Banner Image</label>
                                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="bannerImage" name='bannerImage' type="file" onChange={handleChange} />
                                </div>

                                <div className='flex justify-end items-center'>
                                    <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                        Create
                                    </button>
                                </div>
                            </form>
                        </>
                    )
                }
            </ModalHandler>

        </>
    )
}


