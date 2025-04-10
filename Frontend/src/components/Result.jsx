import React from 'react'
import ResultTable from './ResultTable'
import Leaderboard from './Leaderboard'

const Result = () => {
    return (
        <>
            <section class="bg-white dark:bg-gray-900">
                <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div class="max-w-screen-md mb-8 lg:mb-16">
                        <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Quiz Result & Rankings</h2>
                        <p class="text-gray-500 sm:text-xl dark:text-gray-400">Check your performance and explore the leaderboard to see who's leading.</p>
                    </div>

                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-10 sm:gap-6">
                        <div className="col-span-1 lg:col-span-7">
                            <ResultTable />
                        </div>
                        <div className="col-span-3">
                            <Leaderboard />
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default Result