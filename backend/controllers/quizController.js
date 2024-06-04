import Quiz from './../models/quizModel.js';
import Question from './../models/questionModel.js';
import Attempt from './../models/attemptModel.js';
import Feedback from '../models/feedbackModel.js';
import { isValidObjectId } from 'mongoose';

const isValidQuestion = (question) => {
	if (
		question.title &&
		question.options &&
		question.options.length >= 2 &&
		question.answers &&
        question.answers.length >= 1 &&
        question.answers.some(answer => answer>=0 && answer<question.options.length)
	) {
		return true;
	} 
    return false;
}

class QuizController {
    static createQuiz = async (req, res) => {
        try {
            const { title, questions } = req.body;
            console.log(questions);
            if(!title) {
                return res.status(400).send({ success: false, message: "Title is empty" });
            }
            if(!questions || !questions.length) {
                return res.status(400).send({ success: false, message: "please add atleast one question" });
            }

            const newQuiz = new Quiz({ title, authorId: req.user._id});

            let validQuestions = [];

            questions.forEach((question) => {
                if(isValidQuestion(question)) {
                    question.quizId = newQuiz._id;
                    question.authorId = req.user._id;
                    validQuestions.push(question);
                }
            });

            const storedQuestions = await Question.insertMany(validQuestions);
            const questionIds = storedQuestions.map((question) => question._id);
            newQuiz.questions = questionIds;
            newQuiz.save();
            return res.status(200).send({ success: true, message: "Quiz created successfully", quiz: newQuiz });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }

    static joinQuiz = async (req, res) => {
        try {
            const { id } = req.params;
            
            if(!id) {
                return res.status(400).send({ success: false, message: 'Invalid request' });
            }
            if(!isValidObjectId(id)) {
                return res.status(400).send({ success: false, message: "Invalid Code" });
            }
            
            const quiz = await Quiz.findById(id).populate("questions").populate("authorId", "name").lean();

            if(!quiz) {
                return res.status(400).send({ success: false, message: "Quiz not found or does not exist" })
            }

            quiz.questions = quiz.questions.map((question) => ({
                ...question,
                numberOfAnswers: question.answers.length,
                answers: undefined  // Removes the answers field
            }));

            console.log(quiz);
            
            return res.status(200).send({ success: true, quiz });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }

    static attemptQuiz = async (req, res) => {
        try {
            const { quizId, questions } = req.body;

            const quiz = await Quiz.findById(quizId).populate("questions");

            if (!quiz) {
                return res.status(404).send({ success: false, message: "Quiz not found" });
            }
            if(quiz.isLocked) {
                return res.status(400).send({ success: false, message: "Quiz is locked" });
            }
        
            let totalScore = 0;
            const serializedQuestionIds = questions.map(question => question.questionId);
            
            const attemptedQuestions = quiz.questions.map(question => {
                const index = serializedQuestionIds.indexOf(String(question._id));
                let score = 0;
                let isCorrect = "false";
                
                if (index !== -1) {
                    const selectedOptions = questions[index].answers;
                    const correctAnswersCount = correctAnswers(selectedOptions, question.answers);
                    const totalCorrectAnswers = question.answers.length;
                    const totalSelectedOptions = selectedOptions.length;
    
                    score = (correctAnswersCount / totalCorrectAnswers) * 4 - ((totalSelectedOptions - correctAnswersCount) / totalCorrectAnswers);
                    isCorrect = correctAnswersCount > 0 ? (totalCorrectAnswers === correctAnswersCount && totalSelectedOptions === correctAnswersCount) ? "true" : "partial" : "false";
    
                    totalScore += score;
                }
        
                return {
                    questionId: question._id,
                    answers: index === -1 ? [] : questions[index].answers,
                    isCorrect,
                    score
                };
            });
        
            let attempt = await Attempt.findOne({ quizId, playerId: req.user._id });
            
            if (attempt) {
                // Update the existing attempt
                attempt.questions = attemptedQuestions;
                attempt.totalScore = totalScore;
                await attempt.save();
            } else {
                // Create a new attempt
                attempt = await Attempt.create({
                    quizId,
                    questions: attemptedQuestions,
                    playerId: req.user._id,
                    totalScore
                });
            }
        
            res.status(200).send({ success: true, resultId: attempt._id });
        } catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }        
    }

    static feedBackQuiz = async (req, res) => {
        try {
            const { id } = req.params;
            const { rating, message } = req.body;

            if(!id) {
                return res.status(400).send({ success: false, message: 'Invalid request' });
            }
            if(!isValidObjectId(id)) {
                return res.status(400).send({ success: false, message: "Quiz result not found or does not exist" });
            }

            const attempt = await Attempt.findById(id);

            if(!attempt) {
                return res.status(404).send({ success: false, message: "Quiz attempt not found" });
            }

            let feedback = await Feedback.findOne({ attemptId: attempt._id });

            if(!feedback) {
                feedback = await Feedback.create({ attemptId: attempt._id, rating, message });
                attempt.feedbackId = feedback._id;
                await attempt.save();
            }
            else {
                feedback.rating = rating;
                feedback.message = message;
                await feedback.save();
            }

            res.status(200).send({ success: true, message: "Feedback submitted successfully" });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }

    static fetchResult = async (req, res) => {
        try {
            const { id } = req.params;

            if(!id) {
                return res.status(400).send({ success: false, message: 'Invalid request' });
            }
            if(!isValidObjectId(id)) {
                return res.status(400).send({ success: false, message: "Quiz result not found or does not exist" });
            }
            const attempt = await Attempt.findById(id);
            if(!attempt) {
                return res.status(404).send({ success: false, message: "Quiz result not found" });
            }
            
            res.status(200).send({ success: true, result: attempt });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }

    static fetchReviewResult = async (req, res) => {
        try {
            const { id } = req.params;

            if(!id) {
                return res.status(400).send({ success: false, message: 'Invalid request' });
            }
            if(!isValidObjectId(id)) {
                return res.status(400).send({ success: false, message: "Quiz result not found or does not exist" });
            }
            const populatedAttempt = await Attempt.findById(id).populate('questions.questionId');
            res.status(200).send({ success: true, result: populatedAttempt });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }

    static fetchSummary = async (req, res) => {
        try {
            const { id } = req.params;

            if(!id) {
                return res.status(400).send({ success: false, message: 'Invalid request' });
            }
            if (!isValidObjectId(id)) {
                return res.status(400).send({ success: false, message: "Quiz result not found or does not exist" });
            }
            
            const attempts = await Attempt.find({ quizId: id })
                .populate('playerId', 'name')
                .populate('feedbackId', 'rating message')
                .select("playerId feedbackId")

            let totalRatings = 0;
            const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            attempts.forEach(attempt => {
                if (attempt.feedbackId && attempt.feedbackId.rating) {
                    ratingCounts[attempt.feedbackId.rating]++;
                    totalRatings += attempt.feedbackId.rating;
                }
            });

            const averageRating = attempts.length > 0 ? totalRatings / attempts.length : 0;

            const feedbackMessages = attempts.map(attempt => {
                return {
                    message: attempt.feedbackId.message,
                    user: attempt.playerId.name,
                };
            });
            
            return res.status(200).send({ success: true, averageRating: averageRating.toFixed(1), starCounts: ratingCounts, feedbackMessages });
        } catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }

    static fetchLeaderboard = async (req, res) => {
        try {
            const { id } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if(!id) {
                return res.status(400).send({ success: false, message: 'Invalid request' });
            }
            if (!isValidObjectId(id)) {
                return res.status(400).send({ success: false, message: "Quiz result not found or does not exist" });
            }
            
            const quiz = await Quiz.findById(id).select("isLocked");
            
            if(!quiz) {
                return res.status(400).send({ success: false, message: "Quiz not found or does not exist" })
            }

            const attempts = await Attempt.find({ quizId: id })
                .populate('playerId', 'name')
                .select("playerId totalScore")
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const leaderboard = attempts.map(attempt => ({
                name: attempt.playerId.name,
                totalScore: attempt.totalScore
            })).sort((a, b) => b.totalScore - a.totalScore);

            const totalAttempts = await Attempt.countDocuments({ quizId: id });
            const totalPages = Math.ceil(totalAttempts / limit);
           
            return res.status(200).send({ success: true, leaderboard, isLocked: quiz.isLocked, totalPages, currentPage: parseInt(page), });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }

    static fetchMyQuizzes = async (req, res) => {
        try {
            const { search } = req.query;
            const keyword = search ? { title: { $regex: search, $options: 'i' } } : {};
            const quizzes = await Quiz.find(keyword).find({ authorId: req.user._id }).populate("authorId", "name").select("title authorId isLocked");
        
            return res.status(200).send({ success: true, quizzes });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }        
    }

    static fetchAttemptedQuizzes = async (req, res) => {
        try {
            const { search } = req.query;
            const keyword = search ? { title: { $regex: search, $options: 'i' } } : {};
            // Find all quizzes that match the keyword
            const matchingQuizzes = await Quiz.find(keyword).select('_id');
            const matchingQuizIds = matchingQuizzes.map(quiz => quiz._id);
            // Find all attempts that match the quiz IDs
            const attempts = await Attempt.find({
                playerId: req.user._id,
                quizId: { $in: matchingQuizIds }
            }).populate({
                path: 'quizId',
                select: 'title authorId isLocked',
                populate: {
                    path: 'authorId',
                    select: 'name'
                }
            });

            return res.status(200).send({ success: true, attempts });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }        
    }

    static showQuiz = async (req, res) => {
        try {
            const { id } = req.params;

            if(!id) {
                return res.status(400).send({ success: false, message: 'Invalid request' });
            }
            if (!isValidObjectId(id)) {
                return res.status(400).send({ success: false, message: "Quiz not found or does not exist" });
            }

            const quiz = await Quiz.findById(id).populate("questions");
            
            if(!quiz) {
                return res.status(404).send({ success: false, message: "quiz not found or doesnt exist" });
            }
            return res.status(200).send({ success: true, questions: quiz.questions });
        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }

    static lockQuiz = async (req, res) => {
        try {
            const { id } = req.body;
            
            if(!id) {
                return res.status(400).send({ success: false, message: 'Invalid request' });
            }
            if (!isValidObjectId(id)) {
                return res.status(400).send({ success: false, message: "Quiz not found or does not exist" });
            }
    
            const quiz = await Quiz.findById(id).populate("questions");
            
            if(!quiz) {
                return res.status(404).send({ success: false, message: "quiz not found or doesnt exist" });
            }
            
            quiz.isLocked = !quiz.isLocked;
            await quiz.save();

            return res.status(200).send({ success: true, message: `Quiz is ${quiz.isLocked ?  'locked' : 'unlocked'} successfully` });

        } 
        catch (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
    }
}

const correctAnswers = (attemptedAnswers, correctAnswers) => {
    return attemptedAnswers.filter(answer => correctAnswers.includes(answer)).length;
}

export default QuizController;