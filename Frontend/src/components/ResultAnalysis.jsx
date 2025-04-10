import React from 'react'
import { useState } from 'react';
import QuestionCard from './QuestionCard';

const ResultAnalysis = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    return (
        <>
            <section class="bg-white dark:bg-gray-900">
                <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div class="max-w-screen-md mb-8 lg:mb-16">
                        <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Quiz Result & Rankings</h2>
                        <p class="text-gray-500 sm:text-xl dark:text-gray-400">Check your performance and explore the leaderboard to see who's leading.</p>
                    </div>

                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-10 sm:gap-6">

                        <div className="col-span-1 lg:col-span-6">
                            <QuestionCard />
                        </div>

                        {/* analysis card */}
                        <div className="col-span-4">
                            <div class=" w-full bg-white rounded-lg border dark:bg-gray-800 p-4 md:p-6">
                                <div class="flex justify-between mb-3">
                                    <div class="flex items-center">
                                        <div class="flex justify-center items-center">
                                            <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Results</h5>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <div class="grid grid-cols-3 gap-3 mb-2">
                                        <dl class="bg-blue-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                            <dt class="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-500 text-blue-600 dark:text-blue-300 text-sm font-medium flex items-center justify-center mb-1">10</dt>
                                            <dd class="text-blue-600 dark:text-blue-300 text-sm font-medium">Attempted</dd>
                                        </dl>

                                        <dl class="bg-teal-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                            <dt class="w-8 h-8 rounded-full bg-teal-100 dark:bg-gray-500 text-teal-600 dark:text-teal-300 text-sm font-medium flex items-center justify-center mb-1">9</dt>
                                            <dd class="text-teal-600 dark:text-teal-300 text-sm font-medium">Correct</dd>
                                        </dl>

                                        <dl class="bg-orange-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                            <dt class="w-8 h-8 rounded-full bg-orange-100 dark:bg-gray-500 text-orange-600 dark:text-orange-300 text-sm font-medium flex items-center justify-center mb-1">1</dt>
                                            <dd class="text-orange-600 dark:text-orange-300 text-sm font-medium">Wrong</dd>
                                        </dl>


                                    </div>
                                </div>

                                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white my-5">Status</h5>
                                <nav>
                                    <div className="w-full">
                                        <ul className="grid grid-cols-10 gap-2 text-base">

                                            {Array.from({ length: 50 }, (_, i) => (
                                                <li key={i}>
                                                    <a
                                                        href="#"
                                                        className={`flex items-center justify-center h-8 leading-tight border rounded-md 
                                                          ${i === currentQuestion
                                                                ? 'bg-blue-700 text-white border-blue-700'
                                                                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'} `}
                                                        onClick={() => setCurrentQuestion(i)}
                                                    >
                                                        {i + 1}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </nav>

                                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                                <div class="flex items-center justify-start mb-1">
                                    <span class="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3"><span class="flex w-2.5 h-2.5 bg-blue-600 rounded-full me-1.5 shrink-0"></span>Current</span>

                                    <span class="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3"><span class="flex w-2.5 h-2.5 bg-teal-500 rounded-full me-1.5 shrink-0"></span>Correct</span>

                                    <span class="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3"><span class="flex w-2.5 h-2.5 bg-red-500 rounded-full me-1.5 shrink-0"></span>Wrong</span>

                                    <span class="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3"><span class="flex w-2.5 h-2.5 bg-gray-900 dark:bg-gray-700  rounded-full me-1.5 shrink-0"></span>Unattempted</span>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default ResultAnalysis