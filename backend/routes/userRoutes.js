import express from 'express';
import UserController from '../controllers/userController.js';
import { loginValidator, sendResetPasswordEmailValidator, resetPasswordValidator, registerValidator } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/login', loginValidator, UserController.loginUser);
router.post('/send-reset-password-email', sendResetPasswordEmailValidator, UserController.sendResetPasswordEmail);
router.post('/reset-password/:id/:token', resetPasswordValidator, UserController.resetPassword);
router.post('/register', registerValidator, UserController.registerUser);
router.get('/verify-email/:id/:token', UserController.verifyEmail);

export default router;