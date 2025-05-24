import React, { useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SocketContext } from '../contexts/SocketContext';


const quizRules = [
    "Use of any external help such as notes, internet, or AI tools is strictly prohibited.",
    "Join the quiz within 5 minutes after the code/link is provided.",
    "Only one device is allowed per participant. Switching devices is not permitted.",
    "Do not refresh or close the quiz page once it has started.",
    "Participants must not communicate or collaborate with others during the quiz.",
    "Any form of cheating or suspicious activity will lead to disqualification.",
    "Be respectful and follow any additional instructions provided by the instructor."
];

const Lobby = () => {
    const navigate = useNavigate();
    const { quizId } = useParams();
    const user = useContext(AuthContext).user;
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on("startQuiz", (data) => {
            console.log(data);
            navigate(`/playground/${quizId}`);
        });

        return () => {
            socket.off("startQuiz");
        };
    }, []);

    useEffect(() => {
        socket.emit("joinQuiz", {
            ...user,
            quizId: quizId
        })
    }, [user, quizId]);

    useEffect(() => {

        socket.on('studentListUpdated', (data) => {
            console.log("Student List Updated", data);

        });

        return () => {
            socket.off('studentListUpdated');
        };
    }, [quizId]);




    return (
        <>
            <section class="bg-white dark:bg-gray-900 min-h-screen">
                <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="max-w-screen-xl mb-8 lg:mb-16">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                            Your Quiz Will Begin Soon
                        </h2>
                        <p className="text-gray-500 sm:text-xl dark:text-gray-400 mb-6">
                            Welcome to the quiz! You’ve successfully joined the session. Please stay on this page while we wait for all participants to connect. The quiz will begin once everyone is ready. Make sure your internet connection is stable, and avoid refreshing or closing the tab. Good luck!
                        </p>
                    </div>

                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md dark:bg-yellow-200 dark:text-yellow-900">
                        The quiz will begin once the instructor starts the session.
                    </div>

                    <div className='p-4 mt-4 rounded-lg bg-gray-50 dark:bg-gray-800' id="rules" role="tabpanel" aria-labelledby="rules-tab">

                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Rules:</h2>
                        <ul className="w-full space-y-1 text-gray-500 list-inside dark:text-gray-400">

                            {
                                quizRules.map((rule) => {
                                    return (
                                        <>
                                            <li className="flex items-center">
                                                <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                </svg>
                                                {rule}
                                            </li>
                                        </>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Lobby