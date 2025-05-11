import React, { useEffect, useState } from 'react'
import API from '../utils/API';

const Leaderboard = () => {
    //const { quizId } = useParams();
    const [leaders, setLeaders] = useState([]);

    const fetchLeaderboard = async () => {
        try {
            const response = await API.get(`/result/leaderboard`, { withCredentials: true });

            if (response.data.success) {
                setLeaders(response.data.data);
            }
        } catch (error) {
            console.error("Failed to load leaderboard", error);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);
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
                        {
                            leaders && leaders.map((leader) => {
                                return (
                                    <>
                                        <li class="py-3 sm:py-4">
                                            <div class="flex items-center ">
                                                <div class="shrink-0">
                                                    <img class="w-8 h-8 rounded-full" src="./images/avatar.jpg" alt="Bonnie image" />
                                                </div>
                                                <div class="flex-1 min-w-0 ms-4">
                                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        {leader.name}
                                                    </p>
                                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        {leader.email}
                                                    </p>
                                                </div>
                                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                    {leader.percentage}%
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


        </>
    )
}

export default Leaderboard


