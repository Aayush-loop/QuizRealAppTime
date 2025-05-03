import React, { useState, useEffect } from 'react'
import { io } from "socket.io-client";
import { Bookmark } from 'lucide-react'
import API from '../utils/API';
import Loading from './Loading';
import { useParams } from 'react-router-dom';


const socket = io("http://localhost:3000");  //later use .env


const AdminQuizController = () => {
    const quizId = useParams().quizId;
    const [question, setQuestion] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [totalQuestionLength, setTotalQuestionLength] = useState(0);

    const fetchAndBroadcastQuestion = async (newIndex) => {
        try {
            setIsLoading(true);
            const response = await API.get(`/quiz/${quizId}/question?questionIndex=${newIndex}`);
            if (response.status === 200) {
                const questionData = response.data.data;
                // console.log(questionData);
                setQuestion(questionData.question);
                setTotalQuestionLength(questionData.length);
                setIsLoading(false);

                // Emit question to all students
                socket.emit('admin-question-change', {
                    question: questionData.question,
                    questionIndex: newIndex,
                    totalQuestions: questionData.length
                });
            }
        } catch (error) {
            console.error("Error fetching question:", error);
            setIsLoading(false);
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

    return (
        <>
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="max-w-screen-md mb-8 lg:mb-16">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Review Your Quiz Performance </h2>
                        <p className="text-gray-500 sm:text-xl dark:text-gray-400">Access detailed results for each test you've taken, analyze your scores, and keep track of your improvements over time.</p>
                    </div>

                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-10 sm:gap-6">
                        <div className="col-span-1 lg:col-span-6">
                            {
                                isLoading ? <Loading /> : (
                                    <div className="p-6 bg-white rounded-lg border dark:bg-gray-800">
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
                                            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => handleSetQuestionIndex(questionIndex - 1)}
                                                disabled={questionIndex === 0}>
                                                <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                                                </svg>
                                                Previous
                                            </button>
                                            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => handleSetQuestionIndex(questionIndex + 1)}
                                                disabled={questionIndex === totalQuestionLength - 1}>
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
                            <div className=" w-full bg-white rounded-lg border dark:bg-gray-800 p-4 md:p-6">
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
                                        onClick={() => {
                                            socket.emit('endQuiz', { quizId });
                                            // navigate(`/result-analysis/${quizId}`);
                                        }}>End Quiz</button>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AdminQuizController