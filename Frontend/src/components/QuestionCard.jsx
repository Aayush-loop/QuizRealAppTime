import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import API from '../utils/API';
import Loading from './Loading';
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

const QuestionCard = () => {
    // const [question, setQuestion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // const [seconds, setSeconds] = useState(0);

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setSeconds(prev => prev + 1);
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, []);

    // const formatTime = (totalSeconds) => {
    //     const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    //     const secs = String(totalSeconds % 60).padStart(2, '0');
    //     return `${mins}:${secs}`;
    // };
    const [question, setQuestion] = useState(null);

    useEffect(() => {
        socket.on("update-question", (data) => {
            console.log("Received question from admin:", data);
            setQuestion(data.question);
        });

        return () => {
            socket.off("admin-question-change");
        };
    }, []);




    return isLoading ? (
        <Loading />
    ) : (
        // <div className="p-6 bg-white rounded-lg border dark:bg-gray-800">
        //     <div className="flex justify-between items-start mb-4">
        //         <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        //             QUESTION NO. {questionIndex + 1}
        //         </span>

        //         <div className="flex items-center gap-4">
        //             <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        //                 {/* ⏱ {formatTime(seconds)} */} 5:00
        //             </div>

        //             <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
        //                 MARKS WEIGHT: <span className="font-bold">{question?.marks}</span>
        //             </span>

        //             <button title="Bookmark" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
        //                 <Bookmark />
        //             </button>

        //             <button title="More options" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
        //                 ⋮
        //             </button>
        //         </div>
        //     </div>

        //     <p className="text-lg font-semibold mb-4 dark:text-white">
        //         {question?.question}
        //     </p>
        //     <div className="grid gap-4 mb-4 grid-cols-2">
        //         {question?.options?.map((opt, index) => (
        //             <div className="col-span-2 sm:col-span-1" key={index}>
        //                 <div className="flex items-center ps-4 border border-gray-200 rounded-lg dark:border-gray-700">
        //                     <input
        //                         id={`option-${index}`}
        //                         type="checkbox"
        //                         name={`option-${index}`}
        //                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        //                     />
        //                     <label
        //                         htmlFor={`option-${index}`}
        //                         className="w-full py-4 ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
        //                     >
        //                         {opt.option}
        //                     </label>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>


        // </div>
        <>
            Hello
        </>
    );
}


export default QuestionCard;
