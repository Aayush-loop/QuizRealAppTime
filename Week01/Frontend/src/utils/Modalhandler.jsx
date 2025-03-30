import React from 'react';

const ModalHandler = ({ title, isVisible, onClose, children }) => {
    if (!isVisible) return null;

    return (
        <div>
            {/* Overlay */}
            <div className="fixed inset-0 z-40 bg-black opacity-50"></div>

            {/* Modal */}
            <div id="modal" className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="relative p-4 w-full max-w-4xl">

                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                data-modal-toggle="crud-modal"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div className="p-4 md:p-5 overflow-y-auto max-h-[70vh]">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalHandler;
