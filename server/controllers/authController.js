const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const User = require("../models/User");


// REGEX

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const nameRegex =
    /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;


// DELETE PROFILE IMAGE FILE

const deleteProfileImageFile = (
    profileImage
) => {
    try {

        if (!profileImage) {
            return;
        }

        const fileName =
            path.basename(profileImage);

        const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            "profiles",
            fileName
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

    } catch (error) {

        console.error(
            "Delete profile image file error:",
            error
        );

    }
};


// REGISTER

const register = async (
    req,
    res
) => {
    try {

        const {
            name,
            email,
            password,
        } = req.body;

        if (
            !name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required",
            });
        }

        if (!nameRegex.test(name.trim())) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid name",
            });
        }

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email",
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
            });
        }

        const existingUser =
            await User.findOne({
                email: email
                    .trim()
                    .toLowerCase(),
            });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "User with this email already exists",
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const user =
            await User.create({
                name: name.trim(),
                email: email
                    .trim()
                    .toLowerCase(),
                password: hashedPassword,
            });

        return res.status(201).json({
            success: true,
            message:
                "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage:
                    user.profileImage || "",
                createdAt:
                    user.createdAt,
            },
        });

    } catch (error) {

        console.error(
            "Register error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong during registration",
        });

    }
};


// LOGIN

const login = async (
    req,
    res
) => {
    try {

        const {
            email,
            password,
        } = req.body;

        if (
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }

        const user =
            await User.findOne({
                email: email
                    .trim()
                    .toLowerCase(),
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        const token =
            jwt.sign(
                {
                    userId: user._id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d",
                }
            );

        return res.status(200).json({
            success: true,
            message:
                "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage:
                    user.profileImage || "",
                createdAt:
                    user.createdAt,
                updatedAt:
                    user.updatedAt,
            },
        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong during login",
        });

    }
};


// GET PROFILE

const getProfile = async (
    req,
    res
) => {
    try {

        const user =
            await User.findById(
                req.userId
            ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage:
                    user.profileImage || "",
                createdAt:
                    user.createdAt,
                updatedAt:
                    user.updatedAt,
            },
        });

    } catch (error) {

        console.error(
            "Get profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while fetching profile",
        });

    }
};


// UPDATE PROFILE

const updateProfile = async (
    req,
    res
) => {
    try {

        const {
            name,
            email,
        } = req.body;

        if (
            !name ||
            !email
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name and email are required",
            });
        }

        if (!nameRegex.test(name.trim())) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid name",
            });
        }

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email",
            });
        }

        const existingUser =
            await User.findOne({
                email: email
                    .trim()
                    .toLowerCase(),
                _id: {
                    $ne: req.userId,
                },
            });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "Email is already in use",
            });
        }

        const user =
            await User.findById(
                req.userId
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }

        user.name =
            name.trim();

        user.email =
            email
                .trim()
                .toLowerCase();

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage:
                    user.profileImage || "",
                createdAt:
                    user.createdAt,
                updatedAt:
                    user.updatedAt,
            },
        });

    } catch (error) {

        console.error(
            "Update profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while updating profile",
        });

    }
};


// CHANGE PASSWORD

const changePassword = async (
    req,
    res
) => {
    try {

        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = req.body;

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All password fields are required",
            });
        }

        if (
            newPassword !==
            confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "New passwords do not match",
            });
        }

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
            });
        }

        const user =
            await User.findById(
                req.userId
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }

        const isCurrentPasswordValid =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password is incorrect",
            });
        }

        const isSamePassword =
            await bcrypt.compare(
                newPassword,
                user.password
            );

        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from current password",
            });
        }

        user.password =
            await bcrypt.hash(
                newPassword,
                10
            );

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully",
        });

    } catch (error) {

        console.error(
            "Change password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while changing password",
        });

    }
};


// UPLOAD PROFILE IMAGE

const uploadProfileImage = async (
    req,
    res
) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "Profile image is required",
            });
        }

        const user =
            await User.findById(
                req.userId
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }

        // SAVE OLD IMAGE PATH

        const oldProfileImage =
            user.profileImage;

        const imageUrl =
            `/uploads/profiles/${req.file.filename}`;

        user.profileImage =
            imageUrl;

        await user.save();

        // DELETE OLD IMAGE

        if (
            oldProfileImage &&
            oldProfileImage !==
            imageUrl
        ) {
            deleteProfileImageFile(
                oldProfileImage
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Profile image uploaded successfully",
            profileImage:
                imageUrl,
        });

    } catch (error) {

        console.error(
            "Upload profile image error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while uploading profile image",
        });

    }
};


// REMOVE PROFILE IMAGE

const removeProfileImage = async (
    req,
    res
) => {
    try {

        const user =
            await User.findById(
                req.userId
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }

        const oldProfileImage =
            user.profileImage;

        user.profileImage = "";

        await user.save();

        // DELETE IMAGE FILE

        if (oldProfileImage) {
            deleteProfileImageFile(
                oldProfileImage
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Profile image removed successfully",
            profileImage: "",
        });

    } catch (error) {

        console.error(
            "Remove profile image error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while removing profile image",
        });

    }
};


// EXPORTS

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    uploadProfileImage,
    removeProfileImage,
};