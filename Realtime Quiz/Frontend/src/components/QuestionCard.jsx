import React from 'react';

const QuestionCard = () => {
    return (
        <div className="p-6 bg-white rounded-lg border dark:bg-gray-800">

            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    QUESTION NO. 1
                </span>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                        MARKS WEIGHT: <span className="font-bold">1</span>
                    </span>
                    <button
                        title="Bookmark"
                        className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                    >
                        🔖
                    </button>
                    <button
                        title="More options"
                        className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                    >
                        ⋮
                    </button>
                </div>
            </div>

            <p className="text-lg font-semibold mb-4 dark:text-white">
                Orange is
            </p>

            {/* Options */}
            <div className="grid gap-4 mb-4 grid-cols-2">
                {/* Option A - Correct */}
                <div className="col-span-2 sm:col-span-1">
                    <div className="flex items-center ps-4 border border-gray-200 rounded-lg bg-green-50 dark:border-gray-700">
                        <input
                            id="option-a"
                            type="checkbox"
                            name="option-a"
                            disabled
                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                            htmlFor="option-a"
                            className="w-full py-4 ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                        >
                            Fruit
                        </label>
                    </div>
                </div>


                <div className="col-span-2 sm:col-span-1">
                    <div className="flex items-center ps-4 border border-gray-200 rounded-lg bg-red-100 dark:border-gray-700">
                        <input
                            id="option-b"
                            type="checkbox"
                            name="option-b"
                            defaultChecked
                            disabled
                            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                            htmlFor="option-b"
                            className="w-full py-4 ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                        >
                            Colour
                        </label>
                    </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <div className="flex items-center ps-4 border border-gray-200 rounded-lg dark:border-gray-700">
                        <input
                            id="option-c"
                            type="checkbox"
                            name="option-c"
                            disabled
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                            htmlFor="option-c"
                            className="w-full py-4 ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                        >
                            None
                        </label>
                    </div>
                </div>


                <div className="col-span-2 sm:col-span-1">
                    <div className="flex items-center ps-4 border border-gray-200 rounded-lg dark:border-gray-700">
                        <input
                            id="option-d"
                            type="checkbox"
                            name="option-d"
                            disabled
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                            htmlFor="option-d"
                            className="w-full py-4 ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                        >
                            Both A and B
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
