import React, { useState, useEffect } from 'react';
import { Datepicker } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import API from "../utils/API";
import Loading from './Loading';

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
    const navigate = useNavigate();
    const [joinURL, setJoinURL] = useState("");


    return (
        <>
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm  dark:bg-gray-800 dark:border-gray-700 ">

                <h3 className=" text-2xl dark:text-whitetext-base font-semibold text-gray-900 dark:text-white mb-5">
                    Join Quiz via URL
                </h3>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    Easily join the quiz by URL provided by instructor.  It's quick, simple, and hassle-free!
                </p>

                <div className="flex gap-2 w-full mt-3">
                    <div className="w-2/3">
                        <div className="relative">
                            <label htmlFor="meeting-url" className="sr-only">Meeting URL</label>
                            <input
                                id="meeting-url"
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                placeholder="Enter the URL"
                                value={joinURL}
                                onChange={(e) => setJoinURL(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={() => navigate(joinURL)}
                    >
                        Go
                    </button>
                </div>
            </div>
        </>
    )
}




const UserLandingHome = () => {
    const [dashboardData, setDashboardData] = useState({
        attempted: 0,
        correct: 0,
        percentage: 0,
    });
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await API.get('/result/dashboard', {
                withCredentials: true,
            });
            if (response.status === 200) {

                setDashboardData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchDashboardData();
    }, []);

    console.log("Dashboard Data:", dashboardData);

    return (
        <>
            {loading && <Loading />}
            <OverallScoreCard
                attempts={dashboardData.attempted}
                correct={dashboardData.correct}
                percentage={
                    dashboardData.attempted > 0
                        ? Math.ceil((dashboardData.correct / dashboardData.attempted) * 100)
                        : 0
                }
            />

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
