import React, { useState } from 'react'
import ModalHandler from '../utils/Modalhandler';
import Loading from '../components/Loading'
import QuizInformation from '../components/QuizInformation'


export const AdminLandingHome = () => {

    const [loading, setLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const openModal = (modal) => setActiveModal(modal);
    const closeModal = () => setActiveModal(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submitted')
    }

    const handleChange = (e) => {
        console.log(e.target.value)
    }


    return (
        <>
            <div className=' mx-auto border rounded-lg p-5  bg-white mb-5 dark:bg-gray-800 dark:border-gray-700'>
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 mb-3">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Create Quiz
                    </h3>

                    <button className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => openModal('CreateQuizModal')}>
                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                        Create
                    </button>
                </div>
            </div>


            {/* <div className=' mx-auto border rounded-lg p-5  bg-white mb-5 dark:bg-gray-800 dark:border-gray-700'>
                <div className="flex items-center justify-between p-4 md:p-5  rounded-t dark:border-gray-600 mb-3">

                </div>
            </div> */}

            <div className='flex flex-col gap-3'>
                <QuizInformation
                    title='This is the sample quiz name'
                    date='2021-09-12'
                    attempts='10'
                    passRate='80'
                    status='Completed'
                />

                <QuizInformation
                    title='This is the sample quiz name'
                    date='2021-09-12'
                    attempts='10'
                    passRate='80'
                    status='Upcoming'
                />

                <QuizInformation
                    title='This is the sample quiz name'
                    date='2021-09-12'
                    attempts='10'
                    passRate='80'
                    status='Completed'
                />

                <QuizInformation
                    title='This is the sample quiz name'
                    date='2021-09-12'
                    attempts='10'
                    passRate='80'
                    status='Upcoming'
                />

            </div>



            <ModalHandler title='Create Quiz' isVisible={activeModal === 'CreateQuizModal'} onClose={closeModal}>
                {
                    loading ? <Loading /> : (
                        <>
                            <form method='post' encType='multipart/form-data' onSubmit={handleSubmit} className="p-2 pt-0">
                                <div className="grid gap-4 mb-2 grid-cols-2">
                                    <div className="col-span-2">
                                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                        <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Title " onChange={handleChange} />
                                    </div>

                                    <div className="col-span-2">
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                        <textarea id="description" rows="3" name='description' className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write description here" onChange={handleChange} ></textarea>
                                    </div>
                                </div>


                                <div class="grid gap-4 mb-4 grid-cols-2">
                                    <div class="col-span-2 sm:col-span-1">
                                        <label for="date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                                        <input type="date" name="date" id="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" onChange={handleChange} />
                                    </div>
                                    <div class="col-span-2 sm:col-span-1">


                                        <label for="time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time</label>
                                        <div class="relative">
                                            <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                            <input type="time" id="time" name='time' class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handleChange} />
                                        </div>


                                    </div>
                                </div>

                                <div class="grid gap-4 mb-2 grid-cols-2">

                                    <div class="col-span-2 sm:col-span-1">
                                        <label for="full_marks" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Marks</label>
                                        <input type="text" name="full_marks" id="full_marks" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" onChange={handleChange} />
                                    </div>
                                    <div class="col-span-2 sm:col-span-1">
                                        <label for="pass_marks" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pass Marks</label>
                                        <input type="text" name="pass_marks" id="pass_marks" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" onChange={handleChange} />

                                    </div>

                                </div>


                                <div class="grid gap-4 mb-2 grid-cols-2">

                                    <div class="col-span-2 sm:col-span-1">
                                        <label for="topic" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Topic</label>
                                        <input type="text" name="topic" id="topic" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" onChange={handleChange} />
                                    </div>
                                    <div class="col-span-2 sm:col-span-1">
                                        <label for="no_questions" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No of Questions</label>
                                        <input type="text" name="no_questions" id="no_questions" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" onChange={handleChange} />

                                    </div>

                                </div>


                                <div class="grid mb-2 grid-cols-1">
                                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="attachment">Banner Image</label>
                                    <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="attachment" name='attachment' type="file" onChange={handleChange} />
                                </div>

                                <div className='flex justify-end items-center'>
                                    <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                        Create
                                    </button>
                                </div>
                            </form>
                        </>
                    )
                }
            </ModalHandler>

        </>
    )
}


