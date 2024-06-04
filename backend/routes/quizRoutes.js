import express from 'express';
import protect from './../middlewares/authMiddleware.js';
import QuizController from '../controllers/quizController.js';

const router = express.Router();

router.post('/create', protect, QuizController.createQuiz);
router.get('/show/:id', protect, QuizController.showQuiz);
router.post('/lock', protect, QuizController.lockQuiz);
router.get('/join/:id', protect, QuizController.joinQuiz);
router.post('/attempt', protect, QuizController.attemptQuiz);
router.post('/feedback/:id', protect, QuizController.feedBackQuiz);
router.get('/result/:id', protect, QuizController.fetchResult);
router.get('/review-result/:id', protect, QuizController.fetchReviewResult);
router.get('/summary/:id', protect, QuizController.fetchSummary);
router.get('/leaderboard/:id', protect, QuizController.fetchLeaderboard);
router.get('/my-quizzes',protect, QuizController.fetchMyQuizzes);
router.get('/attempted-quizzes',protect, QuizController.fetchAttemptedQuizzes);

export default router;