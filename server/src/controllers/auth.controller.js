import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/auth.utils.js";

export async function register(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  try {

    // Confirm password check
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {

    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

    const accessToken = createAccessToken({
        userId: user._id,
    })

    const refreshToken = createRefreshToken({
        userId: user._id,
    })

    await userModel.findOneAndUpdate({
        email
    }, {
        refreshToken
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    })

        res.status(200).json({
            message: "Login successful",
            data :{
                user:{
                    id: user._id,
                    name: user.name,
                    email: user.email},
                accessToken
                }
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMe(req, res) { 
    const userId = req.user.id.userId;

    const user = await userModel.findById(userId)
  

    res.status(200).json({
        message: "User found successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
    });
}

export async function refreshToken(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found in the request header"
        })
    }
    try {
        const decoded = verifyRefreshToken(refreshToken)
        console.log(decoded)
        const userId = decoded.userId;
        console.log(userId)

        const user = await userModel.findById(userId)

        if (!user || user.refreshToken !== refreshToken) {

            return res.status(401).json({
                message: "Invalid or expired refresh token"
            })
        }

        const accessToken = createAccessToken({userId : user._id})

        const newRefreshToken = createRefreshToken({userId : user._id})

        await userModel.findByIdAndUpdate(userId, {
            refreshToken: newRefreshToken
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true
        })

        return res.status(200).json({
            message: "Token refreshed successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                accessToken
            }
        })
    }
         catch (err) {
            console.log("REFRESH ERROR:", err);
        res.status(401).json({
            message: "Invalid or expired refresh token"
        })
    }

} 

export async function logout(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found in the request header"
        })
    }
    if(refreshToken){
        await userModel.findOneAndUpdate({refreshToken}, {
            refreshToken: null
        })
    }
    res.clearCookie("refreshToken");
    res.status(200).json({
        message: "Logged out successfully"
    });}