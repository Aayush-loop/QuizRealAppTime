import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import API from '../utils/API';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminResult = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [leaderBoard, setLeaderboard] = useState([]);
    const [boardLoading, setBoardLoading] = useState(false);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const response = await API.get('/quiz');
            if (response.status === 200) {
                setQuizzes(Array.isArray(response.data.data) ? response.data.data : []);
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaderBoard = async () => {
        try {
            setBoardLoading(true);
            const response = await API.get(`/result/leaderboard/${selectedQuiz}`);
            if (response.status === 200) {
                setLeaderboard(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            toast.error("Failed to fetch leaderboard data");
        } finally {
            setBoardLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (selectedQuiz) {
            fetchLeaderBoard();
        }
    }, [selectedQuiz]);

    return (
        <>
            <div className='mx-auto border rounded-lg p-5 bg-white mb-5 dark:bg-gray-800 dark:border-gray-700'>
                <form>
                    <label htmlFor="quiz" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Select Quiz
                    </label>
                    <select
                        id="quiz"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => setSelectedQuiz(e.target.value)}
                        value={selectedQuiz}
                    >
                        <option value="" >Choose a Quiz</option>
                        {loading ? (
                            <option disabled>Loading...</option>
                        ) : (
                            quizzes.map((quiz) => (
                                <option key={quiz._id} value={quiz._id}>
                                    {quiz.title}
                                </option>
                            ))
                        )}
                    </select>
                </form>
            </div>

            {boardLoading ? (
                <Loading />
            ) : (leaderBoard.length === 0) ? (

                <div className="text-center p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-300 text-lg">No leaderboard data available for this quiz.</p>
                </div>
            ) : (
                <div class="bg-white dark:bg-gray-800 relative border sm:rounded-lg overflow-hidden dark:border-gray-700">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-4 py-3">S.N.</th>
                                    <th scope="col" class="px-4 py-3">Name</th>
                                    <th scope="col" class="px-4 py-3">Score</th>
                                    <th scope="col" class="px-4 py-3">Rank</th>
                                    <th scope="col" class="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderBoard.map((item, index) => (
                                    <tr key={index} class="border-b dark:border-gray-700">
                                        <td class="px-4 py-3">{index + 1}</td>
                                        <th scope="row" class="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <img src={item.profileImage || '/images/avatar.jpg'} alt="User Image" class="w-auto h-8 mr-3 rounded-full" />
                                            {item.name}
                                        </th>
                                        <td class="px-4 py-3">{item.score}</td>
                                        <td class="px-4 py-3">{item.rank}</td>
                                        <td class="px-4 py-3 flex items-center justify-start gap-2">
                                            <button type="button" class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                                                onClick={() => navigate(`/result-analysis/${item.resultId}?userId=${item.userId}`)}>
                                                Result
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminResult;