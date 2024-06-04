import User from '../models/userModel.js';
import sendMail from '../utils/sendEmail.js';
import { generateToken, verifyToken } from '../utils/token.js';
import { validationResult } from 'express-validator';

class UserController {
    static loginUser = async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email: email });

            if(!user) {
                return res.status(400).send({ success: false, message: "User is not registered" });
            }
            if(!await user.matchPassword(password)) {
                return res.status(400).send({ success: false, message: "Incorrect password" });
            }
            if(!user.isVerified) {
                return res.status(400).send({ success: false, message: "Email is not verified" });
            }

            const userInfo = {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id, '30d')
            }

            return res.status(200).send({ success: true, message: "Login successful", user: userInfo });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }
    static sendResetPasswordEmail = async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { email } = req.body;

            const user = await User.findOne({ email: email });

            if(!user) {
                return res.status(400).send({ success: false, message: "User is not registered" });
            }

            const token = generateToken(user._id, '10m');
            const link = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`;
            console.log(link);
            const from = process.env.USER_EMAIL;
            const to = email;
            const subject = "Reset Password"
            const text = "Verify your email"
            const html = `<p>Click <a href=${link}>here</a> to reset your password</p>
            <P>This link is valid for 10 minutes</p>`;
            // sendMail(from, to, subject, text, html);
            return res.status(200).send({ success: true, message: "Reset Password link is sent to your email" })
        }   
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }
    static resetPassword = async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { id, token } = req.params;
            const { password } = req.body;

            if(!id || !token) {
                return res.status(400).send({ success: false, message: "Id or token is missing" });
            }

            const decoded = verifyToken(token);

            if(decoded._id !== id) {
                return res.status(401).send({ success: false, message: "Id and token does not match" });
            }

            await User.findByIdAndUpdate(id, { password: password }, { new: true });
            return res.status(200).send({ success: true, message: "Password reset successful" });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }
    static registerUser = async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { name, email, password } = req.body;

            const userExists = await User.findOne({ email: email });

            if(userExists) {
                return res.status(400).send({ success: false, message: "User already registered" });
            }

            const newUser = await User.create({ name: name, email: email, password: password });
            setTimeout(async ()=>{
                try {
                    await User.findOneAndDelete({ _id: newUser._id, isVerified: false });
                } catch (error) {
                    console.error('Error deleting unverified user:', error);
                }
            }, 60 * 1000);
            
            const token = generateToken(newUser._id, '10m');
            const link = `${process.env.FRONTEND_URL}/verify-email/${newUser._id}/${token}`;
            console.log(link);
            const from = process.env.USER_EMAIL;
            const to = email;
            const subject = "Email Verification"
            const text = "Verify your email"
            const html = `<p>Click <a href=${link}>here</a> to verify your email</p>
            <P>This link is valid for 10 minutes</p>`;
            // sendMail(from, to, subject, text, html);
            return res.status(201).send({ success: true, message: "User registration successful. Verify you email." })  
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }
    static verifyEmail = async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { id, token } = req.params;
            
            if(!id || !token) {
                return res.status(400).send({ success: false, message: "Id or token is missing" });
            }

            const decoded = verifyToken(token);

            if(decoded._id !== id) {
                return res.status(401).send({ success: false, message: "Id and token does not match" });
            }

            const user = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
            const userInfo = {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id, '30d')
            }
            return res.status(200).send({ success: true, message: "Email verification successful", user: userInfo});
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }
}

export default UserController;