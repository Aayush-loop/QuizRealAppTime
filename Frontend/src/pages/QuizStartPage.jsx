import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import socket from '../utils/socket';

const JoinViaUrl = () => {
    const [copied, setCopied] = useState(false);
    const { quizId } = useParams();
    const url = `/lobby/${quizId}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('URL copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy!');
            console.error('Clipboard copy failed', err);
        }
    };

    return (
        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-2xl dark:text-whitetext-base font-semibold text-gray-900 dark:text-white mb-5">
                Share the Quiz Link
            </h3>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                Share this link with your participants to allow them to join the quiz.
            </p>
            <div className="flex gap-2 w-full mt-3">
                <div className="w-2/3">
                    <div className="relative">
                        <label htmlFor="meeting-url" className="sr-only">Meeting URL</label>
                        <input
                            id="meeting-url"
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            value={url}
                            disabled
                            readOnly
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Copy
                </button>
            </div>
        </div>
    );
};


const QuizStartPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);


    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on('studentListUpdated', (data) => {
            console.log("Updated student list:", data);
            setParticipants(data);
        });
        // Clean up listener
        return () => {
            socket.off('studentListUpdated');
        };
    }, []);



    return (
        <>
            <section className="bg-white dark:bg-gray-900 min-h-screen">
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
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

                            <JoinViaUrl />

                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md dark:bg-yellow-200 dark:text-yellow-900 mt-4 ">
                                Waiting for participants to join the quiz session. Please keep this page open. Once all participants are ready, you can begin the quiz.
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto mt-6">
                                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={() => {
                                        socket.emit('startQuiz', { quizId });
                                        navigate(`/admin-quiz-controller/${quizId}`);
                                    }}>
                                    Start Now
                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="col-span-3">
                            <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Participants</h5>
                                    <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                                        View all
                                    </a>
                                </div>
                                <div className="flow-root">
                                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">

                                        {participants.length === 0 && (
                                            <li className="text-sm text-gray-500 dark:text-gray-400">No participants yet.</li>
                                        )}

                                        {
                                            participants.map((participant) => {
                                                return (
                                                    <>
                                                        <li className="py-3 sm:py-4">
                                                            <div className="flex items-center">
                                                                <div className="shrink-0">
                                                                    <img className="w-8 h-8 rounded-full" src={participant.image || "/images/avatar.jpg"} alt="Neil image" />
                                                                </div>
                                                                <div className="flex-1 min-w-0 ms-4">
                                                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                                        {participant.name}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                                        {participant.email}
                                                                    </p>
                                                                </div>

                                                            </div>
                                                        </li>
                                                    </>
                                                )

                                            })
                                        }
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
