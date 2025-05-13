import { useEffect, useState, useContext } from "react"
import Loading from "./Loading"
import socket from "../utils/socket";
import TimerDisplay from "./TimerDisplay"
import { AuthContext } from '../contexts/AuthContext';
import { useParams, useNavigate } from "react-router-dom";
import ModalHandler from "../utils/Modalhandler";



const Playground = () => {
    const navigate = useNavigate()
    const userId = useContext(AuthContext).user._id;
    const { quizId } = useParams()

    const [questionIndex, setQuestionIndex] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedOptionIds, setSelectedOptionIds] = useState([])
    const [question, setQuestion] = useState(null)
    const [questionStartTime, setQuestionStartTime] = useState(null)
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const [leaderBoard, setLeaderboard] = useState([]);
    const [activeModal, setActiveModal] = useState(null);

    const handleOptionChange = (optionId) => {
        setSelectedOptionIds((prev) =>
            prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
        )
    }
    const closeModal = () => {
        setActiveModal(null);
        setLoading(false);
        navigate('/dashboard');
    };

    const handleSubmit = () => {
        if (!question || !questionStartTime) return

        const timeTakenInSeconds = Math.floor((Date.now() - questionStartTime) / 1000)

        const payload = {
            questionId: question._id,
            userId: userId,
            options: selectedOptionIds,
            timeTaken: timeTakenInSeconds,
            quizId: quizId,
        }

        // console.log("Emitting answer via socket:", payload)
        socket.emit("submitAnswer", payload)
        setSelectedOptionIds([])
        setHasSubmitted(true)
    }


    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on("update-question", (data) => {
            setQuestion(data.question)
            setQuestionStartTime(Date.now())
            setSelectedOptionIds([])
            setHasSubmitted(false)
            setQuestionIndex(data.questionIndex ?? 0)
        })

        return () => {
            socket.off("update-question")
        }
    }, [])

    useEffect(() => {
        socket.on("getLeaderBoard", (data) => {
            console.log("Received leaderboard data:", data);
            setActiveModal('leaderboard')
            setLeaderboard(data.data)
        })
        return () => {
            socket.off("getLeaderBoard")
        }
    }, [])

    if (loading) return <Loading />

    return (

        <>
            {
                hasSubmitted && (
                    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                        <div className="max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                            <div>
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Answer Submitted!</h5>
                            </div>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                Please wait for the next question from the admin.
                            </p>
                            <div
                                className="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
                                role="alert"
                            >
                                <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="sr-only">Info</span>
                                <div>
                                    <span className="font-medium">Warning!</span> Do not refresh the page or close the tab, otherwise you will lose your progress.
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                <div className="w-full max-w-3xl p-6 border border-gray-200 rounded-lg dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            QUESTION NO. {questionIndex + 1}
                        </span>
                        <div className="flex items-center gap-4">
                            <TimerDisplay />
                            <span className="text-xs font-medium text-gray-800 px-2 py-1 rounded dark:text-gray-300">
                                MARKS WEIGHT: <span className="font-bold">{question?.marks}</span>
                            </span>
                        </div>
                    </div>

                    <p className="text-lg font-semibold mb-4 dark:text-white">{question?.question}</p>

                    <div className="grid gap-4 mb-4 grid-cols-2">
                        {question?.options?.map((opt) => (
                            <div className="col-span-2 sm:col-span-1" key={opt._id}>
                                <div className="flex items-center ps-4 border border-gray-200 rounded-lg dark:border-gray-700">
                                    <input
                                        id={`option-${opt._id}`}
                                        type="checkbox"
                                        checked={selectedOptionIds.includes(opt._id)}
                                        onChange={() => handleOptionChange(opt._id)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor={`option-${opt._id}`} className="w-full py-4 ms-2 text-base font-medium text-gray-900 dark:text-gray-300">
                                        {opt.option}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full"
                    >
                        Submit
                    </button>
                </div>
            </div>

            <ModalHandler title="Leaderboard" isVisible={activeModal === 'leaderboard'} onClose={closeModal}>

                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-4 py-3">S.N.</th>
                            <th scope="col" class="px-4 py-3">Name</th>
                            <th scope="col" class="px-4 py-3">Score</th>
                            <th scope="col" class="px-4 py-3">Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderBoard.map((item, index) => (
                            <tr key={index} class="border-b dark:border-gray-700">
                                <td class="px-4 py-3">{index + 1}</td>
                                <th scope="row" class="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <img src={item.profileImage || '/images/avatar.jpg'} alt="User" class="w-auto h-8 mr-3 rounded-full" />
                                    {item.name}
                                </th>
                                <td class="px-4 py-3">{item.score}</td>
                                <td class="px-4 py-3">{item.rank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ModalHandler>
        </>
    )
}

export default Playground
