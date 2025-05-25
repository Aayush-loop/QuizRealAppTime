import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../utils/API';
import Loading from '../components/Loading';

const OTPVerification = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputsRef = useRef([]);

    const [loading, setLoading] = useState(false);



    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("text").trim().slice(0, 4);
        if (!/^\d{4}$/.test(pasteData)) return;

        const newOtp = pasteData.split("");
        setOtp(newOtp);
        inputsRef.current[3]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const finalOtp = otp.join("");
        if (finalOtp.length < 4) {
            toast.error("Please enter complete OTP.");
            return;
        }

        try {
            const response = await API.post(`/auth/verify-otp/${finalOtp}`);
            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/login');
            } else {
                toast.error(response.data.message || "Failed to verify OTP.");
            }

        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error("Failed to verify OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? <Loading /> : <section className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg w-full max-w-sm">
                    <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Enter OTP</h2>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                        We have sent a 4-digit OTP to your registered email. Please enter it below to verify your account.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between mb-6" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    ref={el => inputsRef.current[index] = el}
                                    className="w-12 h-12 text-center text-xl border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            {otp.every(d => d !== "") ? "Next" : "Verify"}
                        </button>
                    </form>
                </div>
            </section>}

        </>
    );
};

export default OTPVerification;
