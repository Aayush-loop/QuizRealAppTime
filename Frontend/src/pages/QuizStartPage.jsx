import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

const QuizStartPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    return (
        <>
            <section class="bg-white dark:bg-gray-900">
                <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="max-w-screen-xl mb-8 lg:mb-16">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                            Quiz Control Panel
                        </h2>
                        <p className="text-gray-500 sm:text-xl dark:text-gray-400 mb-6">
                            This is the real-time controller for managing your quiz. You can control when the quiz starts and ends, and navigate through questions during the session.
                        </p>

                    </div>

                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-10 sm:gap-6">
                        <div className="col-span-1 lg:col-span-7">
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md dark:bg-yellow-200 dark:text-yellow-900">
                                Waiting for participants to join the quiz session. Please keep this page open. Once all participants are ready, you can begin the quiz.
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto mt-6">
                                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={() => {
                                        socket.emit('startQuiz', { quizId });
                                        navigate(`/admin-quiz-controller/${quizId}`);
                                    }}>
                                    Start Now
                                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="col-span-3">
                            <div class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                                <div class="flex items-center justify-between mb-4">
                                    <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Participants</h5>
                                    <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                                        View all
                                    </a>
                                </div>
                                <div class="flow-root">
                                    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">

                                        <li class="py-3 sm:py-4">
                                            <div class="flex items-center">
                                                <div class="shrink-0">
                                                    <img class="w-8 h-8 rounded-full" src="/images/avatar.jpg" alt="Neil image" />
                                                </div>
                                                <div class="flex-1 min-w-0 ms-4">
                                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        Bishal Sapkota
                                                    </p>
                                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        email@windster.com
                                                    </p>
                                                </div>

                                            </div>
                                        </li>

                                        <li class="py-3 sm:py-4">
                                            <div class="flex items-center">
                                                <div class="shrink-0">
                                                    <img class="w-8 h-8 rounded-full" src="/images/avatar.jpg" alt="Neil image" />
                                                </div>
                                                <div class="flex-1 min-w-0 ms-4">
                                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        Bishal Sapkota
                                                    </p>
                                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        bishal@gmail.com
                                                    </p>
                                                </div>

                                            </div>
                                        </li>

                                        <li class="py-3 sm:py-4">
                                            <div class="flex items-center">
                                                <div class="shrink-0">
                                                    <img class="w-8 h-8 rounded-full" src="/images/avatar.jpg" alt="Neil image" />
                                                </div>
                                                <div class="flex-1 min-w-0 ms-4">
                                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        Bishal Sapkota
                                                    </p>
                                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        bishal@gmail.com
                                                    </p>
                                                </div>

                                            </div>
                                        </li>

                                        <li class="py-3 sm:py-4">
                                            <div class="flex items-center">
                                                <div class="shrink-0">
                                                    <img class="w-8 h-8 rounded-full" src="/images/avatar.jpg" alt="Neil image" />
                                                </div>
                                                <div class="flex-1 min-w-0 ms-4">
                                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        Bishal Sapkota
                                                    </p>
                                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        bishal@gmail.com
                                                    </p>
                                                </div>

                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default QuizStartPage;
