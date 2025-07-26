import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

/**
 * @api {post} /auth/signup User Signup
 * @apiName UserSignup
 * @apiGroup Auth
 * @apiDescription Registers a new user with full name, email, and password.
 *
 * @apiParam {String} fullName Full name of the user.
 * @apiParam {String} email Email address of the user.
 * @apiParam {String} password Password for the user account (minimum 6 characters).
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} user User details.
 * @apiSuccess {String} user._id User ID.
 * @apiSuccess {String} user.fullName Full name of the user.
 * @apiSuccess {String} user.email Email address of the user.
 * @apiSuccess {String} token Authentication token.
 *
 * @apiError (400) BadRequest Missing required fields, invalid password length, or email already exists.
 * @apiError (500) InternalServerError Internal server error.
 */
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @api {post} /auth/login User Login
 * @apiName UserLogin
 * @apiGroup Auth
 * @apiDescription Authenticates a user with email and password.
 *
 * @apiParam {String} email Email address of the user.
 * @apiParam {String} password Password for the user account.
 *
 * @apiSuccess {Object} user User details.
 * @apiSuccess {String} user._id User ID.
 * @apiSuccess {String} user.fullName Full name of the user.
 * @apiSuccess {String} user.email Email address of the user.
 * @apiSuccess {String} user.profilePic Profile picture URL of the user.
 * @apiSuccess {String} token Authentication token.
 *
 * @apiError (400) BadRequest Invalid credentials.
 * @apiError (500) InternalServerError Internal server error.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @api {post} /auth/logout User Logout
 * @apiName UserLogout
 * @apiGroup Auth
 * @apiDescription Logs out the authenticated user by clearing the JWT token.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError (500) InternalServerError Internal server error.
 */
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
