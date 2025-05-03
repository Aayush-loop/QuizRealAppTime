import React, { useEffect, useState } from 'react';
import ModalHandler from '../utils/Modalhandler';
import Loading from '../components/Loading';
import API from '../utils/API';
import { toast } from 'react-toastify';
import { use } from 'react';

const AddQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [questionAnswerAccumulator, setQuestionAnswerAccumulator] = useState([]);


    const [questionAnswer, setQuestionAnswer] = useState({
        question: '',
        marks: '',
        difficulty: '',
        imageFile: null,
        options: [
            { option: '', isCorrect: false },
            { option: '', isCorrect: false },
            { option: '', isCorrect: false },
            { option: '', isCorrect: false }
        ]
    });

    const openModal = (modal) => setActiveModal(modal);
    const closeModal = () => {
        setActiveModal(null);
        setEditingIndex(null);
        resetForm();
    };

    const resetForm = () => {
        setQuestionAnswer({
            question: '',
            marks: '',
            difficulty: '',
            imageFile: null,
            options: [
                { option: '', isCorrect: false },
                { option: '', isCorrect: false },
                { option: '', isCorrect: false },
                { option: '', isCorrect: false }
            ]
        });
    };

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

    const fetchQuestions = async (quizId) => {
        try {
            setLoading(true);
            const res = await API.get(`/quiz/${quizId}/question`);
            if (res.status === 200) {
                setQuestionAnswerAccumulator(res.data.data.questions || []);
                //console.log(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (selectedQuiz) {
            fetchQuestions(selectedQuiz);
        } else {
            setQuestionAnswerAccumulator([]);
        }
    }, [selectedQuiz]);


    const handleChange = (e) => {
        const { name, value, checked, type, dataset } = e.target;

        if (dataset && dataset.index !== undefined) {
            const index = Number(dataset.index);
            const fieldType = dataset.type;

            setQuestionAnswer((prev) => {
                const updatedOptions = [...prev.options];
                if (fieldType === "text") {
                    updatedOptions[index].option = value;
                } else if (fieldType === "checkbox") {
                    updatedOptions[index].isCorrect = checked;
                }
                return { ...prev, options: updatedOptions };
            });
        } else {
            setQuestionAnswer((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };

    const handleSubmitQuestion = async (e) => {
        try {
            console.log("Submitting question:", questionAnswer);
            setLoading(true);
            e.preventDefault();
            const formData = new FormData();
            formData.append('question', questionAnswer.question);
            formData.append('marks', questionAnswer.marks);
            formData.append('difficulty', questionAnswer.difficulty);
            formData.append('quizId', selectedQuiz);
            formData.append('image', questionAnswer.imageFile);

            questionAnswer.options.forEach((option, index) => {
                formData.append(`options[${index}][option]`, option.option);
                formData.append(`options[${index}][isCorrect]`, option.isCorrect);
            });

            const response = await API.patch(`/quiz/add/${selectedQuiz}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })


            if (response.status === 201) {
                toast.success('Question added successfully!');
                resetForm();
                fetchQuestions(selectedQuiz);
                closeModal();
            }
            else {
                toast.error('Failed to add question. Please try again.', response.data.message);
            }

        } catch (error) {
            console.error("Error submitting question:", error.message);
            toast.error("Error submitting question. Please try again.");
        } finally {
            setLoading(false);
        }

    };

    const handleEdit = (index) => {

    };

    const handleDelete = (index) => {

    };

    const handlePublish = async () => {

    };

    return (
        <>
            <div className=' mx-auto border rounded-lg p-5  bg-white mb-5 dark:bg-gray-800 dark:border-gray-700'>
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 mb-3">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Quiz
                    </h3>

                    <button
                        onClick={handlePublish}
                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >
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
                        value={selectedQuiz}
                    >
                        <option value="" >Choose a Quiz</option>
                        {loading ? (
                            <Loading />
                        ) : (
                            quizzes &&
                            quizzes.map((quiz) => (
                                <option key={quiz._id} value={quiz._id}>
                                    {quiz.title}
                                </option>
                            ))
                        )}
                    </select>

                    {selectedQuiz !== '' && (
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
            </div >

            {
                loading ? (
                    <Loading />
                ) : selectedQuiz ? (
                    questionAnswerAccumulator?.length > 0 ? (
                        questionAnswerAccumulator.map((qa, index) => (
                            <div className="col-span-1 lg:col-span-6" key={index}>
                                <div className="p-6 bg-white rounded-lg border dark:bg-gray-800 dark:border-gray-700 mb-3">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                            QUESTION NO. {index + 1}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                                                MARKS WEIGHT: <span className="font-bold">{qa.marks}</span>
                                            </span>
                                            <button
                                                type="button"
                                                className="px-3 py-2 text-xs font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800"
                                                onClick={() => handleEdit(index)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="px-3 py-2 text-xs font-medium text-white rounded-lg bg-red-700 hover:bg-red-800"
                                                onClick={() => handleDelete(index)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-lg font-semibold mb-4 dark:text-white">{qa.question}</p>

                                    <div className="grid gap-4 mb-4 grid-cols-2">
                                        {qa.options.map((opt, i) => (
                                            <div className="col-span-2 sm:col-span-1" key={i}>
                                                <div className="flex items-center ps-4 border border-gray-200 rounded-lg dark:border-gray-700">
                                                    <input
                                                        id={`option-${index}-${i}`}
                                                        type="checkbox"
                                                        checked={opt.isCorrect}
                                                        disabled
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <label
                                                        htmlFor={`option-${index}-${i}`}
                                                        className="w-full py-4 ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                                                    >
                                                        {opt.option}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
                            No questions added yet.
                        </div>
                    )
                ) : null
            }


            <ModalHandler title="Add Question" isVisible={activeModal === 'question_answer'} onClose={closeModal}>
                {
                    loading ? <Loading /> : (
                        <>
                            <form className="space-y-4 md:space-y-6 p-4" encType="multipart/form-data" onSubmit={handleSubmitQuestion}>
                                <div className="flex justify-center">
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
                                            </div>
                                            <input
                                                id="dropzone-file"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setQuestionAnswer((prev) => ({
                                                        ...prev,
                                                        imageFile: e.target.files[0] || null,
                                                    }))
                                                }
                                            />
                                        </label>
                                    </div>
                                </div>

                                {questionAnswer.imageFile && (
                                    <div className="flex justify-center">
                                        <img
                                            src={URL.createObjectURL(questionAnswer.imageFile)}
                                            alt="Preview"
                                            className="mt-3 max-w-xs rounded shadow"
                                        />
                                    </div>
                                )}

                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="col-span-2">
                                        <label htmlFor="question" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question Text :</label>
                                        <input
                                            type="text"
                                            name="question"
                                            id="question"
                                            required
                                            onChange={handleChange}
                                            value={questionAnswer.question}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                        />
                                    </div>

                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="marks" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Marks :</label>
                                        <input
                                            type="number"
                                            name="marks"
                                            id="marks"
                                            required
                                            onChange={handleChange}
                                            value={questionAnswer.marks}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                        />
                                    </div>

                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="difficulty" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Difficulty :</label>
                                        <select
                                            id="difficulty"
                                            name="difficulty"
                                            value={questionAnswer.difficulty}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                        >
                                            <option value="">Select Difficulty</option>
                                            <option value="easy">Easy</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>

                                    {questionAnswer.options.map((option, index) => (
                                        <div className="col-span-2" key={index}>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-3/4">
                                                    <label htmlFor={`option_${index + 1}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                        Option {index + 1}:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name={`option_${index + 1}`}
                                                        id={`option_${index + 1}`}
                                                        required
                                                        value={option.option}
                                                        onChange={handleChange}
                                                        data-index={index}
                                                        data-type="text"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                                    />
                                                </div>
                                                <div className="w-1/4 flex items-center">
                                                    <input
                                                        id={`option_${index + 1}_correct`}
                                                        type="checkbox"
                                                        checked={option.isCorrect}
                                                        onChange={handleChange}
                                                        data-index={index}
                                                        data-type="checkbox"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor={`option_${index + 1}_correct`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        Mark Correct
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add Question
                                </button>
                            </form>
                        </>
                    )
                }

            </ModalHandler>

        </>
    )
}

export default AddQuiz