import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Datepicker } from 'flowbite-react';

const StatBox = ({ label, value, colorClass }) => (
    <div className="relative flex flex-col items-center justify-center pt-3 pb-3 px-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 w-full sm:w-1/3">
        <div
            className={`absolute -top-3 left-5 px-3 py-1 text-md font-semibold rounded-md text-white shadow-md ${colorClass}`}
        >
            {value}
        </div>
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300 ">
            {label}
        </span>
    </div>
);

const OverallScoreCard = ({ attempts, correct, percentage }) => {
    return (
        <div className="border rounded-lg px-6 py-4 bg-white dark:bg-gray-800 dark:border-gray-700 w-full">
            <h3 className=" text-2xl dark:text-whitetext-base font-semibold text-gray-900 dark:text-white mb-5">
                Overall Score
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <StatBox
                    label="Attempts"
                    value={attempts}
                    colorClass="bg-gradient-to-r from-purple-500 to-pink-500"
                />
                <StatBox
                    label="Correct"
                    value={correct}
                    colorClass="bg-yellow-400 text-gray-900"
                />
                <StatBox
                    label="Percentage"
                    value={percentage}
                    colorClass="bg-gradient-to-r from-green-400 to-cyan-400"
                />
            </div>
        </div>
    );
};




const JoinViaUrl = () => {
    const [copied, setCopied] = useState(false);
    const url = 'https://example.com/abc123';

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <>
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm  dark:bg-gray-800 dark:border-gray-700 ">

                <h3 className=" text-2xl dark:text-whitetext-base font-semibold text-gray-900 dark:text-white mb-5">
                    Join Quiz via URL
                </h3>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    Easily join the quiz by copying the meeting URL provided below.  It's quick, simple, and hassle-free!
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
                            <button
                                onClick={handleCopy}
                                className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
                            >
                                {copied ? (
                                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        Go
                    </button>
                </div>

                {copied &&
                    toast.success('URL copied to clipboard!')
                }
            </div>
        </>
    )
}




const UserLandingHome = () => {
    return (
        <>
            <OverallScoreCard attempts={5} correct={4} percentage={80} />

            <div className="flex flex-col lg:flex-row gap-4 mt-5">
                <div className="flex flex-col gap-4 w-full">
                    <JoinViaUrl />
                </div>

                <div className="flex flex-col w-fit  border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                    <Datepicker inline />
                </div>
            </div>

        </>
    );
};

export default UserLandingHome;
