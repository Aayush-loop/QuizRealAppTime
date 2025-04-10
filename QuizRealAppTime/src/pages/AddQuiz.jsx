import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import ModalHandler from '../utils/Modalhandler'
import Loading from '../components/Loading'

const quizzes = [
    {
        id: 1,
        name: "Math Quiz",
        topic: "Algebra",
        duration: "30 minutes",
        noOfQuestions: 10,
        deadline: "2024-12-20",
        noOfAttempts: 3,
        fullMarks: 100,
        passMarks: 40
    },
    {
        id: 2,
        name: "Science Quiz",
        topic: "Physics",
        duration: "45 minutes",
        noOfQuestions: 15,
        deadline: "2024-12-22",
        noOfAttempts: 2,
        fullMarks: 150,
        passMarks: 75
    },
    {
        id: 3,
        name: "History Quiz",
        topic: "World Wars",
        duration: "20 minutes",
        noOfQuestions: 8,
        deadline: "2024-12-18",
        noOfAttempts: 4,
        fullMarks: 80,
        passMarks: 35
    },
    {
        id: 4,
        name: "English Quiz",
        topic: "Grammar",
        duration: "25 minutes",
        noOfQuestions: 12,
        deadline: "2024-12-19",
        noOfAttempts: 3,
        fullMarks: 120,
        passMarks: 50
    },
    {
        id: 5,
        name: "Programming Quiz",
        topic: "JavaScript",
        duration: "40 minutes",
        noOfQuestions: 20,
        deadline: "2024-12-21",
        noOfAttempts: 5,
        fullMarks: 200,
        passMarks: 100
    }
];
const AddQuiz = () => {

    const [loading, setLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const openModal = (modal) => setActiveModal(modal);
    const closeModal = () => setActiveModal(null);
    const [selectedQuiz, setSelectedQuiz] = useState('');
    const [questionAnswerAccumulator, setQuestionAnswerAccumulator] = useState([]);
    const [questionAnswer, setQuestionAnswer] = useState({
        question_text: '',
        point: '',
        difficulty: '',
        options: [
            {
                option_text: '',
                is_correct: false
            },
            {
                option_text: '',
                is_correct: false
            },
            {
                option_text: '',
                is_correct: false
            },
            {
                option_text: '',
                is_correct: false
            }
        ]
    });

    const handleChange = (e) => {
        const { name, value, checked, type, dataset } = e.target;

        if (dataset.index !== undefined) {
            const index = Number(dataset.index); // Get the option index
            const fieldType = dataset.type; // Get the type of input (text or checkbox)

            setQuestionAnswer((prev) => {
                const updatedOptions = [...prev.options];

                if (fieldType === "text") {
                    updatedOptions[index].option_text = value;
                } else if (fieldType === "checkbox") {
                    updatedOptions[index].is_correct = checked;
                }

                return { ...prev, options: updatedOptions };
            });
        } else {
            setQuestionAnswer((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
        console.log(questionAnswer);
    };

    const handleUpdate = (index) => {
    }

    const handleDelete = (index) => {

    }




    return (
        <>
            <Navbar />
            <div className=' mx-auto border rounded-lg p-5  bg-white mb-5 dark:bg-gray-800 dark:border-gray-700'>
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 mb-3">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Quiz
                    </h3>

                    <button className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >
                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                        Publish
                    </button>
                </div>
            </div>

            <div className='mx-auto border rounded-lg p-5 bg-white mb-5 dark:bg-gray-800 dark:border-gray-700'>
                <form>
                    <label htmlFor="quiz" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Select Quiz
                    </label>
                    <select
                        id="quiz"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => setSelectedQuiz(e.target.value)}
                    >
                        <option defaultChecked>Choose a Quiz</option>
                        {loading ? (
                            <Loading />
                        ) : (
                            quizzes &&
                            quizzes.map((quiz) => (
                                <option key={quiz.id} value={quiz.id}>
                                    {quiz.name}
                                </option>
                            ))
                        )}
                    </select>

                    {selectedQuiz && (
                        <div className="flex items-center justify-center mt-5">
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                onClick={() => openModal('question_answer')}
                            >
                                Add Question
                            </button>
                        </div>
                    )}
                </form>
            </div>


            <div className='mx-auto border rounded-lg p-5 bg-white mb-5 dark:bg-gray-800 dark:border-gray-700'>
                <div className="flex items-center justify-between p-4 md:p-5  dark:border-gray-600 mb-3">
                    <p className='dark:text-white'>Question 1</p>
                    <div className="flex items-center gap-4">
                        <button
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                            onClick={() => handleEdit(index)}
                        >
                            <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                            </svg>

                            Edit
                        </button>

                        <button
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
                            onClick={() => handleDelete(index)}
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Delete
                        </button>
                    </div>

                </div>

                <p className='dark:text-white'> This is sample question</p>
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2 sm:col-span-1">
                        <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                            <input id="checkbox-1" type="checkbox" value="" name="checkbox-1" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label for="checkbox-1" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default checkbox</label>
                        </div>
                    </div>

                    <div class="col-span-2 sm:col-span-1">
                        <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                            <input checked id="checkbox-2" type="checkbox" value="" name="checkbox-2" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label for="checkbox-2" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Checked state</label>
                        </div>
                    </div>

                    <div class="col-span-2 sm:col-span-1">
                        <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                            <input id="checkbox-3" type="checkbox" value="" name="checkbox-3" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label for="checkbox-3" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default checkbox</label>
                        </div>
                    </div>

                    <div class="col-span-2 sm:col-span-1">
                        <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                            <input id="checkbox-4" type="checkbox" value="" name="checkbox-4" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label for="checkbox-4" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default checkbox</label>
                        </div>
                    </div>
                </div>

            </div>


            <ModalHandler title="Add Question" isVisible={activeModal === 'question_answer'} onClose={closeModal}>
                <form className="space-y-4 md:space-y-6 p-4" encType="multipart/form-data">
                    <div className="flex justify-center">
                        <div class="flex items-center justify-center w-full">
                            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
                                </div>
                                <input id="dropzone-file" type="file" class="hidden" />
                            </label>
                        </div>
                    </div>
                    <div class="grid gap-4 mb-4 grid-cols-2">
                        <div class="col-span-2">
                            <label for="question_text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question Text :</label>
                            <input type="text" name="question_text" id="question_text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required onChange={handleChange} value={questionAnswer.question_text} />
                        </div>

                        <div class="col-span-2 sm:col-span-1">
                            <label for="point" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Point :</label>
                            <input type="number" name="point" id="point" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required onChange={handleChange} value={questionAnswer.point} />
                        </div>
                        <div class="col-span-2 sm:col-span-1">
                            <label for="difficulty" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Difficulty :</label>
                            <select id="difficulty" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                name='difficulty' onChange={handleChange} value={questionAnswer.difficulty}>
                                <option selected="">Select Difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="moderate">Moderate</option>
                                <option value="hard">Hard</option>

                            </select>
                        </div>


                        {
                            questionAnswer.options.map((option, index) => (
                                <div className="col-span-2" key={index}>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-3/4">
                                            <label
                                                htmlFor={`option_${index + 1}`}
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Option {index + 1}:
                                            </label>
                                            <input
                                                type="text"
                                                name={`option_${index + 1}`}
                                                id={`option_${index + 1}`}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Enter option text"
                                                required
                                                value={option.option_text}
                                                onChange={handleChange}
                                                data-index={index}
                                                data-type="text"
                                            />
                                        </div>
                                        <div className="w-1/4 flex items-center">
                                            <input
                                                id={`option_${index + 1}_correct`}
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                checked={option.is_correct}
                                                onChange={handleChange}
                                                data-index={index}
                                                data-type="checkbox"
                                            />
                                            <label
                                                htmlFor={`option_${index + 1}_correct`}
                                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Mark Correct
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                    <button type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                        Add Question
                    </button>
                </form>
            </ModalHandler>

        </>
    )
}

export default AddQuiz