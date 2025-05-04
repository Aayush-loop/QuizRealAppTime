import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

const Playground = () => {
    const [questionIndex, setQuestionIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [selectedOptionIds, setSelectedOptionIds] = useState([]);
    const [question, setQuestion] = useState(null);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (totalSeconds) => {
        const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleOptionChange = (optionId) => {
        setSelectedOptionIds(prev =>
            prev.includes(optionId)
                ? prev.filter(id => id !== optionId)
                : [...prev, optionId]
        );
    };

    const handleSubmit = () => {
        if (!question || !questionStartTime) return;

        const timeTakenInSeconds = Math.floor((Date.now() - questionStartTime) / 1000);

        const payload = {
            questionid: question._id,
            userId: "680fbb3978a62a59d60dc8fe", // Replace with real user ID
            options: selectedOptionIds,
            timeTaken: timeTakenInSeconds
        };

        console.log("Emitting answer via socket:", payload);
        socket.emit("submitAnswer", payload);
        setSelectedOptionIds([]);
        setHasSubmitted(true);
    };

    useEffect(() => {
        socket.on("update-question", (data) => {
            console.log("Received question from admin:", data);
            setQuestion(data.question);
            setQuestionStartTime(Date.now());
            setSelectedOptionIds([]);
            setSeconds(0);
            setHasSubmitted(false);
            setQuestionIndex(data.questionIndex ?? 0);
        });

        return () => {
            socket.off("update-question");
        };
    }, []);

    if (isLoading) return <Loading />;

    if (hasSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div class="max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div >
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Answer Submitted!</h5>
                    </div>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Please wait for the next question from the admin.</p>
                    <div class="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
                        <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span class="sr-only">Info</span>
                        <div>
                            <span class="font-medium">Warning!</span> Do not refresh the page or close the tab, otherwise you will lose your progress.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-3xl p-6 border border-gray-200 rounded-lg dark:border-gray-700 ">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        QUESTION NO. {questionIndex + 1}
                    </span>

                    <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {formatTime(seconds)}
                        </div>

                        <span className="text-xs font-medium text-gray-800 px-2 py-1 rounded dark:text-gray-300">
                            MARKS WEIGHT: <span className="font-bold">{question?.marks}</span>
                        </span>
                    </div>
                </div>

                <p className="text-lg font-semibold mb-4 dark:text-white">
                    {question?.question}
                </p>

                <div className="grid gap-4 mb-4 grid-cols-2">
                    {question?.options?.map((opt) => (
                        <div className="col-span-2 sm:col-span-1" key={opt._id}>
                            <div className="flex items-center ps-4 border border-gray-200 rounded-lg dark:border-gray-700">
                                <input
                                    id={`option-${opt._id}`}
                                    type="checkbox"
                                    checked={selectedOptionIds.includes(opt._id)}
                                    onChange={() => handleOptionChange(opt._id)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    htmlFor={`option-${opt._id}`}
                                    className="w-full py-4 ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                                >
                                    {opt.option}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Playground;
