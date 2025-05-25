const User = require('../models/user.model');
const uploadFileToCloudinary = require('../middlewares/cloudinary.middleware');
const apiResponse = require('../utils/apiResponse');
const apiError = require('../utils/apiError');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/sendMail');

const generateVerificationCode = () => {
    const length = 4;
    let verificationCode = "";
    for (let i = 0; i < length; i++) {
        verificationCode += Math.floor(Math.random() * 10);
    }
    return verificationCode;
};

const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password, role } = req.body;

        if ([name, phone, email, password, role].some(field => !field || field.trim() === "")) {
            throw new apiError(400, "All fields are required");
        }

        const isUserAlreadyExists = await User.findOne({ email });
        if (isUserAlreadyExists) {
            throw new apiError(400, "User already exists");
        }

        const imageUrl = req.file ? await uploadFileToCloudinary(req.file.path) : null;

        const user = new User({
            name,
            phone,
            email,
            password,
            role,
            image: imageUrl
        });


        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        user.verificationCodeExpiry = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        try {
            await sendVerificationEmail(email, verificationCode);
        } catch (emailError) {

            throw new apiError(500, "Failed to send verification email.Check your email address or try again later.");
        }


        await user.save();

        res.status(201).json(new apiResponse(201, "Verification code sent to email.", {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }));

    } catch (error) {
        console.log("Registration Error:", error);
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if ([email, password].some(field => !field || field.trim() === "")) {
            throw new apiError(400, "All fields are required");
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new apiError(400, "Invalid credentials");
        }

        const isPasswordMatched = await user.isPasswordMatched(password);
        if (!isPasswordMatched) {
            throw new apiError(400, "Invalid credentials");
        }

        if (!user.isVerified) {
            const verificationCode = generateVerificationCode();
            user.verificationCode = verificationCode;
            user.verificationCodeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

            try {
                await sendVerificationEmail(email, verificationCode);
                await user.save();
            } catch (emailError) {
                console.error("Verification email error:", emailError);
                throw new apiError(500, "Failed to send verification email. Check your email address or try again later.");
            }

            return res.status(403).json(new apiResponse(403, "Please verify your email first", {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }));
        }


        const _id = user._id.toString();
        const accessToken = generateAccessToken({ id: _id, email, role: user.role });
        const refreshToken = generateRefreshToken({ id: _id });

        const updatedUser = await User.findByIdAndUpdate(user._id, { refreshToken });
        if (!updatedUser) {
            throw new apiError(500, "Failed to update refresh token");
        }

        return res.status(200)
            .cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'None' })
            .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None' })
            .json(new apiResponse(200, "User logged in successfully", {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            }));

    } catch (error) {
        console.error("Login error:", error);
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};


const logoutuser = async (req, res) => {

    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            throw new apiError(404, 'User not found');
        }

        const removeRefreshToken = await User.findByIdAndUpdate(id, {
            refreshToken: ''
        }, { new: true });

        if (!removeRefreshToken) {
            throw new apiError(500, 'Error in removing refresh token');
        }

        res.status(200)
            .clearCookie('accessToken', { httpOnly: true, secure: true })
            .clearCookie('refreshToken', { httpOnly: true, secure: true })
            .json(new apiResponse(200, "User logged out successfully", {}));

    } catch (error) {
        console.error('Error in logOutUser function:', error);
        res.status(error.statusCode || 500).json({
            message: error.message || 'Internal Server Error',
            success: false,
        });
    }

}

const getProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id).select('-refreshToken -password -__v');

        if (!user) {
            throw new apiError(404, 'User not found');
        }

        res.status(200).json(new apiResponse(200, 'User profile fetched successfully', user));

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || 'Internal Server Error',
            success: false,
        });
    }
};


const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.params;
        if (!otp) {
            res.status(400).json(new apiResponse(400, "OTP is required"));
            return;
        }
        const user = await User.findOne({
            verificationCode: otp,
            verificationCodeExpiry: { $gt: new Date() },
        }).select('-refreshToken -password -__v');
        if (!user) {
            res.status(400).json(new apiResponse(400, "Invalid or expired OTP"));
            return;
        }
        user.verificationCode = undefined;
        user.verificationCodeExpiry = undefined;
        user.isVerified = true;
        await user.save();

        res.status(200).json(new apiResponse(200, "OTP verified successfully", user));

    } catch (error) {
        Logger.error("Error in verifyOtp: ", error);
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    logoutuser,
    getProfile,
    verifyOtp
}