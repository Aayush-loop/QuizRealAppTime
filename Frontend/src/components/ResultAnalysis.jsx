import React, { useEffect } from 'react'
import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import API from '../utils/API';
import { useLocation, useParams } from 'react-router-dom';

const ResultAnalysis = () => {
    const { resultId } = useParams()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [resultData, setResultData] = useState();
    const [isLoading, setIsLoading] = useState(false);


    const fetchResult = async () => {
        try {
            setIsLoading(true);
            const URL = (userId) ? `/result?resultId=${resultId}&&userId=${userId}` : `/result?resultId=${resultId}`;
            const response = await API.get(URL,
                {
                    withCredentials: true,
                }
            )

            if (response.status === 200) {
                // console.log("Result data:", response.data.data[0]);
                setResultData(response.data.data[0]);
            }
        } catch (error) {
            console.error("Error fetching result data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchResult();
    }, [])
    const question = resultData?.submissions[currentQuestion];
    const totalQuestionLength = resultData?.submissions?.length || 0;

    return (
        <>
            <section class="bg-white dark:bg-gray-900 min-h-screen">
                <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div class="max-w-screen-md mb-8 lg:mb-16">
                        <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Review Your Quiz Performance </h2>
                        <p class="text-gray-500 sm:text-xl dark:text-gray-400">Access detailed results for each test you've taken, analyze your scores, and keep track of your improvements over time.</p>
                    </div>

                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-10 sm:gap-6">

                        <div className="col-span-1 lg:col-span-6">
                            <div className="p-6 bg-white rounded-lg border dark:bg-gray-800">
                                {question && (
                                    <>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                QUESTION NO. {question.qNo}
                                            </span>

                                            <div className="flex items-center gap-4">
                                                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {question.timeTaken} sec
                                                </div>

                                                <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                                                    MARKS WEIGHT: <span className="font-bold">{question.marks}</span>
                                                </span>

                                                <button title="Bookmark" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                                                    <Bookmark />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-lg font-semibold mb-4 dark:text-white">
                                            {question.question}
                                        </p>

                                        <div className="grid gap-4 mb-4 grid-cols-2">
                                            {question?.options?.map((opt, index) => (
                                                <div className="col-span-2 sm:col-span-1" key={index} >
                                                    <div className={`flex items-center ps-4 border border-gray-200 rounded-lg dark:border-gray-700 `}>
                                                        <input
                                                            id={`option-${index}`}
                                                            type="checkbox"
                                                            checked={question.selected.includes(opt.id)}
                                                            disabled
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                        <label
                                                            htmlFor={`option-${index}`}
                                                            className="w-full py-4 ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                                                        >
                                                            {opt.text}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-between items-center mt-4">
                                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                        disabled={currentQuestion === 0}>
                                        <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                                        </svg>
                                        Previous
                                    </button>
                                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                        disabled={currentQuestion === totalQuestionLength - 1}>
                                        Next
                                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                        </svg>
                                    </button>
                                </div>

                            </div>

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
                                            <dt class="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-500 text-blue-600 dark:text-blue-300 text-sm font-medium flex items-center justify-center mb-1">
                                                {resultData?.attempted}
                                            </dt>
                                            <dd class="text-blue-600 dark:text-blue-300 text-sm font-medium">Attempted</dd>
                                        </dl>

                                        <dl class="bg-teal-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                            <dt class="w-8 h-8 rounded-full bg-teal-100 dark:bg-gray-500 text-teal-600 dark:text-teal-300 text-sm font-medium flex items-center justify-center mb-1">
                                                {resultData?.correct}
                                            </dt>
                                            <dd class="text-teal-600 dark:text-teal-300 text-sm font-medium">Correct</dd>
                                        </dl>

                                        <dl class="bg-orange-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                            <dt class="w-8 h-8 rounded-full bg-orange-100 dark:bg-gray-500 text-orange-600 dark:text-orange-300 text-sm font-medium flex items-center justify-center mb-1">
                                                {resultData?.wrong}
                                            </dt>
                                            <dd class="text-orange-600 dark:text-orange-300 text-sm font-medium">Wrong</dd>
                                        </dl>
                                    </div>
                                </div>

                                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white my-5">Status</h5>
                                <nav>
                                    <div className="w-full">
                                        <ul className="grid grid-cols-10 gap-2 text-base">
                                            {resultData?.statusArray?.map((item, i) => (
                                                <li key={i}>
                                                    <button
                                                        className={`flex items-center justify-center h-8 leading-tight border rounded-md w-8
                                                            ${i === currentQuestion ? 'bg-blue-700 text-white border-blue-700' :
                                                                item.status === 'correct' ? 'bg-teal-500 text-white border-teal-500' :
                                                                    item.status === 'wrong' ? 'bg-red-500 text-white border-red-500' :
                                                                        'bg-gray-800 text-white border-gray-700'}`}
                                                        onClick={() => setCurrentQuestion(i)}
                                                    >
                                                        {item.qNo}
                                                    </button>
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
            </section >
        </>
    )
}

export default ResultAnalysis;
