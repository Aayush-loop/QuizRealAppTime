import React, { useState, useEffect, useContext } from 'react'
import { Bookmark } from 'lucide-react'
import API from '../utils/API';
import Loading from './Loading';
import { useParams, useNavigate } from 'react-router-dom';
import ModalHandler from '../utils/Modalhandler';
import { SocketContext } from '../contexts/SocketContext';

const AdminQuizController = () => {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const quizId = useParams().quizId;
    const [question, setQuestion] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalQuestionLength, setTotalQuestionLength] = useState(0);
    const [stats, setStats] = useState({ submitted: 0, correct: 0, wrong: 0 });


    const [leaderBoard, setLeaderboard] = useState([]);
    const [activeModal, setActiveModal] = useState(null);

    const closeModal = () => {
        setActiveModal(null);
        setLoading(false);
        navigate('/admin');
    };


    const fetchAndBroadcastQuestion = async (newIndex) => {
        try {
            setLoading(true);
            const response = await API.get(`/quiz/${quizId}/question?questionIndex=${newIndex}`);
            if (response.status === 200) {
                const questionData = response.data.data;
                // console.log(questionData);
                setQuestion(questionData.question);
                setTotalQuestionLength(questionData.length);
                setLoading(false);

                // Emit question to all students
                socket.emit('admin-question-change', {
                    question: questionData.question,
                    questionIndex: newIndex,
                    totalQuestions: questionData.length
                });
            }
        } catch (error) {
            console.error("Error fetching question:", error);
            setLoading(false);
        }
    };

    const handleSetQuestionIndex = (newIndex) => {
        if (newIndex >= 0 && newIndex < totalQuestionLength) {
            setQuestionIndex(newIndex);
            fetchAndBroadcastQuestion(newIndex);
        }
    };


    useEffect(() => {
        fetchAndBroadcastQuestion(questionIndex);
    }, []);

    useEffect(() => {
        socket.on('joinQuiz', (data) => {
            console.log(data);
        });
        return () => {
            socket.off('joinQuiz');
        };
    }, []);

    useEffect(() => {
        socket.on('answerStatsUpdated', (data) => {
            if (question?._id && data.questionId === question._id) {
                setStats({
                    submitted: data.submitted,
                    correct: data.correct,
                    wrong: data.wrong
                });
            }
        });

        return () => {
            socket.off('answerStatsUpdated');
        };
    }, [question]);

    useEffect(() => {
        socket.on("getLeaderBoard", (data) => {
            console.log("Received leaderboard data:", data);
            setLeaderboard(data.data)
            setActiveModal('leaderboard')
        })
        return () => {
            socket.off("getLeaderBoard")
        }
    }, [])

    return (
        <>
            <section className="bg-white dark:bg-gray-900 min-h-screen">
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="max-w-screen-xl mb-8 lg:mb-16">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                            Quiz Session Manager
                        </h2>
                        {/* <p className="text-gray-500 sm:text-xl dark:text-gray-400 mb-6">
                            Welcome to the quiz! You’ve successfully joined the session. Please stay on this page while we wait for all participants to connect. The quiz will begin once everyone is ready. Make sure your internet connection is stable, and avoid refreshing or closing the tab. Good luck!
                        </p> */}
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div class="grid grid-cols-3 gap-3 ">
                            <dl class="bg-blue-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                <dt class="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-500 text-blue-600 dark:text-blue-300 text-sm font-medium flex items-center justify-center mb-1">
                                    {stats.submitted}
                                </dt>
                                <dd class="text-blue-600 dark:text-blue-300 text-sm font-medium">Submitted</dd>
                            </dl>

                            <dl class="bg-teal-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                <dt class="w-8 h-8 rounded-full bg-teal-100 dark:bg-gray-500 text-teal-600 dark:text-teal-300 text-sm font-medium flex items-center justify-center mb-1">
                                    {stats.correct}
                                </dt>
                                <dd class="text-teal-600 dark:text-teal-300 text-sm font-medium">Correct</dd>
                            </dl>

                            <dl class="bg-orange-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                <dt class="w-8 h-8 rounded-full bg-orange-100 dark:bg-gray-500 text-orange-600 dark:text-orange-300 text-sm font-medium flex items-center justify-center mb-1">
                                    {stats.wrong}
                                </dt>
                                <dd class="text-orange-600 dark:text-orange-300 text-sm font-medium">Wrong</dd>
                            </dl>
                        </div>
                    </div>

                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-10 sm:gap-6 mt-5">

                        <div className="col-span-1 lg:col-span-6">
                            {
                                loading ? <Loading /> : (
                                    <div className="p-6 bg-white rounded-lg border dark:bg-gray-800 dark:border-gray-700">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                QUESTION NO. {questionIndex + 1}
                                            </span>

                                            <div className="flex items-center gap-4">
                                                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {/* ⏱ {formatTime(seconds)} */} 5:00
                                                </div>

                                                <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                                                    MARKS WEIGHT: <span className="font-bold">{question?.marks}</span>
                                                </span>

                                                <button title="Bookmark" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                                                    <Bookmark />
                                                </button>

                                                <button title="More options" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                                                    ⋮
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-lg font-semibold mb-4 dark:text-white">
                                            {question?.question}
                                        </p>
                                        <div className="grid gap-4 mb-4 grid-cols-2">
                                            {question?.options?.map((opt, index) => (
                                                <div className="col-span-2 sm:col-span-1" key={index}>
                                                    <div className="flex items-center ps-4 border border-gray-200 rounded-lg dark:border-gray-700">
                                                        <input
                                                            id={`option-${index}`}
                                                            type="checkbox"
                                                            name={`option-${index}`}
                                                            disabled
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                        <label
                                                            htmlFor={`option-${index}`}
                                                            className="w-full py-4 ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                                                        >
                                                            {opt.option}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            {/* Previous Button */}
                                            <button
                                                type="button"
                                                className={`inline-flex items-center text-sm font-medium rounded-lg px-5 py-2.5 me-2
            ${questionIndex === 0
                                                        ? 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700'
                                                        : 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                                    }`}
                                                onClick={() => handleSetQuestionIndex(questionIndex - 1)}
                                                disabled={questionIndex === 0}
                                            >
                                                <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                                                </svg>
                                                Previous
                                            </button>

                                            {/* Next Button */}
                                            <button
                                                type="button"
                                                className={`inline-flex items-center text-sm font-medium rounded-lg px-5 py-2.5
            ${questionIndex === totalQuestionLength - 1
                                                        ? 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700'
                                                        : 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                                    }`}
                                                onClick={() => handleSetQuestionIndex(questionIndex + 1)}
                                                disabled={questionIndex === totalQuestionLength - 1}
                                            >
                                                Next
                                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                                </svg>
                                            </button>
                                        </div>


                                    </div>
                                )
                            }

                        </div>

                        <div className="col-span-4">
                            <div className=" w-full bg-white rounded-lg border dark:bg-gray-800 p-4 md:p-6 dark:border-gray-700">
                                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white my-5">Select Question</h5>
                                <nav>
                                    <div className="w-full">
                                        <ul className="grid grid-cols-10 gap-2 text-base">

                                            {Array.from({ length: totalQuestionLength }, (_, i) => (
                                                <li key={i}>
                                                    <a
                                                        href="#"
                                                        className={`flex items-center justify-center h-8 leading-tight border rounded-md 
                                                          ${i === questionIndex
                                                                ? 'bg-blue-700 text-white border-blue-700'
                                                                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'} `}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleSetQuestionIndex(i);
                                                        }}
                                                    >
                                                        {i + 1}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </nav>

                                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                                <div className="flex items-center justify-star">
                                    <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"

                                        onClick={
                                            () => {
                                                socket.emit('endQuiz', { quizId });
                                                //console.log("Quiz ended");
                                                //navigate('/admin');
                                                // toast.success("You have ended the quiz successfully");
                                            }

                                        } >End Quiz</button>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ModalHandler title="Leaderboard" isVisible={activeModal === 'leaderboard'} onClose={closeModal}>

                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-4 py-3">S.N.</th>
                            <th scope="col" class="px-4 py-3">Name</th>
                            <th scope="col" class="px-4 py-3">Score</th>
                            <th scope="col" class="px-4 py-3">Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderBoard.map((item, index) => (
                            <tr key={index} class="border-b dark:border-gray-700">
                                <td class="px-4 py-3">{index + 1}</td>
                                <th scope="row" class="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <img src={item.profileImage || '/images/avatar.jpg'} alt="User" class="w-auto h-8 mr-3 rounded-full" />
                                    {item.name}
                                </th>
                                <td class="px-4 py-3">{item.score}</td>
                                <td class="px-4 py-3">{item.rank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ModalHandler>
        </>
    )
}

export default AdminQuizController