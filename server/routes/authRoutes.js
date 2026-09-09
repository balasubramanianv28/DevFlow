const express = require("express");

const router = express.Router();

const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    uploadProfileImage,
    removeProfileImage,
} = require("../controllers/authController");

const protect =
    require("../middleware/authMiddleware");

const uploadProfileImageMiddleware =
    require("../middleware/uploadMiddleware");


// AUTH

router.post(
    "/register",
    register
);

router.post(
    "/login",
    login
);


// PROFILE

router.get(
    "/profile",
    protect,
    getProfile
);

router.patch(
    "/profile",
    protect,
    updateProfile
);


// PASSWORD

router.patch(
    "/change-password",
    protect,
    changePassword
);


// PROFILE IMAGE

router.patch(
    "/profile/image",
    protect,
    uploadProfileImageMiddleware.single(
        "profileImage"
    ),
    uploadProfileImage
);

router.delete(
    "/profile/image",
    protect,
    removeProfileImage
);


module.exports = router;