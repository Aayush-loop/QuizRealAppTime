import React from 'react'

const Leaderboard = () => {
    return (
        <>

            <div class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Overall Leaderboard</h5>
                    <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                        View all
                    </a>
                </div>
                <div class="flow-root">
                    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                        <li class="py-3 sm:py-4">
                            <div class="flex items-center ">
                                <div class="shrink-0">
                                    <img class="w-8 h-8 rounded-full" src="./images/avatar.jpg" alt="Bonnie image" />
                                </div>
                                <div class="flex-1 min-w-0 ms-4">
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        Bibek
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        bibek@gmail.com
                                    </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    99%
                                </div>
                            </div>
                        </li>
                        <li class="py-3 sm:py-4">
                            <div class="flex items-center">
                                <div class="shrink-0">
                                    <img class="w-8 h-8 rounded-full" src="./images/avatar.jpg" alt="Michael image" />
                                </div>
                                <div class="flex-1 min-w-0 ms-4">
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        Sandy
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        Sandy@gmail.com
                                    </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    98%
                                </div>
                            </div>
                        </li>

                        <li class="pt-3 pb-0 sm:pt-4">
                            <div class="flex items-center ">
                                <div class="shrink-0">
                                    <img class="w-8 h-8 rounded-full" src="./images/avatar.jpg" alt="Thomas image" />
                                </div>
                                <div class="flex-1 min-w-0 ms-4">
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        Utsab
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        chomu@gmail.com
                                    </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    97%
                                </div>
                            </div>
                        </li>

                        <li class="pt-3 pb-0 sm:pt-4">
                            <div class="flex items-center ">
                                <div class="shrink-0">
                                    <img class="w-8 h-8 rounded-full" src="./images/avatar.jpg" alt="Thomas image" />
                                </div>
                                <div class="flex-1 min-w-0 ms-4">
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        Saroj
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        chamma@gmail.com
                                    </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    96%
                                </div>
                            </div>
                        </li>
                        <li class="pt-3 pb-0 sm:pt-4">
                            <div class="flex items-center ">
                                <div class="shrink-0">
                                    <img class="w-8 h-8 rounded-full" src="./images/avatar.jpg" alt="Thomas image" />
                                </div>
                                <div class="flex-1 min-w-0 ms-4">
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        Bipul
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        notgate@gmail.com
                                    </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    96%
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>


        </>
    )
}

export default Leaderboard