import React from 'react';
import { Calendar, Users, BarChart2 } from 'lucide-react';

const QuizInformation = ({ title, date, attempts, passRate, status }) => {
    return (
        <div className="border rounded-lg px-6 py-4 bg-white dark:bg-gray-800 dark:border-gray-700 w-full">
            <div className="flex flex-col gap-4  w-full">

                <div className="flex items-center justify-between w-full md:w-auto">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>

                    {
                        (status === 'Completed') ? <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">Upcoming</span> : <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Completed</span>
                    }
                </div>

                <div className='flex items-center justify-between w-full md:w-auto'>
                    <div className="flex flex-wrap md:flex-nowrap justify-start items-center gap-6 text-sm text-gray-700 dark:text-gray-300 w-full">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{attempts} Attempts</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <BarChart2 className="w-4 h-4" />
                            <span>{passRate}% Passed</span>
                        </div>
                    </div>
                    <a
                        href="#"
                        className="text-blue-600 font-medium hover:underline whitespace-nowrap"
                    >
                        View Full Statistics
                    </a>
                </div>
            </div>
        </div>
    );
};

export default QuizInformation;