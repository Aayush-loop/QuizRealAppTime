import React, { useState, useEffect } from 'react';
import { Datepicker } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from "../utils/API";
import Loading from './Loading';

const StatBox = ({ label, value, colorClass }) => (
    <div className="relative flex flex-col items-center justify-center pt-3 pb-3 px-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 w-full sm:w-1/3">
        <div
            className={`absolute -top-3 left-5 px-3 py-1 text-md font-semibold rounded-md text-white shadow-md ${colorClass}`}
        >
            {value}
        </div>
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {label}
        </span>
    </div>
);

const OverallScoreCard = ({ attempts, correct, percentage }) => {
    return (
        <div className="border rounded-lg px-6 py-4 bg-white dark:bg-gray-800 dark:border-gray-700 w-full">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">
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
                    value={percentage + '%'}
                    colorClass="bg-gradient-to-r from-green-400 to-cyan-400"
                />
            </div>
        </div>
    );
};

const JoinViaUrl = () => {
    const navigate = useNavigate();
    const [joinCode, setJoinCode] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchQuizId = async () => {
        if (!joinCode) {
            toast.error("Please enter a join code");
            return;
        }

        try {
            setLoading(true);
            const response = await API.get(`/quiz/joinCode/${joinCode}`);
            if (response.status === 200) {
                const { _id } = response.data.data;
                if (_id) {
                    navigate(`/lobby/${_id}`);
                } else {
                    toast.error("Invalid Join Code");
                }
            }
        } catch (error) {
            toast.error("Unable to join quiz. Try again.");
            console.error("Error fetching join code:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">
                Join Quiz via Code
            </h3>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                Easily join the quiz by the code provided by your instructor. It's quick and simple!
            </p>

            <div className="flex gap-2 w-full mt-3">
                <div className="w-2/3">
                    <label htmlFor="join-code" className="sr-only">Join Code</label>
                    <input
                        id="join-code"
                        type="text"
                        placeholder="Enter the Join Code"
                        className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    disabled={!joinCode || loading}
                    onClick={fetchQuizId}
                    className="text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    {loading ? 'Loading...' : 'Go'}
                </button>
            </div>
        </div>
    );
};

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
            const response = await API.get('/result/dashboard', { withCredentials: true });
            if (response.status === 200) {
                const { attempted, correct } = response.data.data;
                const percentage = attempted > 0 ? Math.ceil((correct / attempted) * 100) : 0;
                setDashboardData({ attempted, correct, percentage });
            }
        } catch (error) {
            toast.error("Failed to load dashboard data");
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <>
            {loading && <Loading />}

            <OverallScoreCard
                attempts={dashboardData.attempted}
                correct={dashboardData.correct}
                percentage={dashboardData.percentage}
            />

            <div className="flex flex-col lg:flex-row gap-4 mt-5">
                <div className="flex flex-col gap-4 w-full">
                    <JoinViaUrl />
                </div>
                <div className="flex flex-col w-fit border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                    <Datepicker inline />
                </div>
            </div>
        </>
    );
};

export default UserLandingHome;
