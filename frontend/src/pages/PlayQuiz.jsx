import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/ContextProvider';
import { ImSpinner2 } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlayQuiz = () => {
    const { user, darkMode } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [quiz, setQuiz] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(180*60);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!location.state) {
            navigate('/join-quiz');
            return;
        }
        setQuiz(location.state.quiz);
        const savedTime = localStorage.getItem('quiz_time_remaining');
        setTimeRemaining(savedTime ? parseInt(savedTime, 10) : location.state.quiz.duration*60);
        const savedAttemptedQuestions = JSON.parse(localStorage.getItem('attempted_questions'));
        setQuestions(savedAttemptedQuestions ? savedAttemptedQuestions : []);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeRemaining((prevTime) => {
                const newTime = prevTime - 1;
                localStorage.setItem('quiz_time_remaining', newTime);
                return newTime;
            });
        }, 1000);

        if (timeRemaining <= 0) {
            clearInterval(intervalId);
            handleFinish();
        }

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, [timeRemaining]);

    useEffect(() => {
        const currentQuestion = questions.find(q => q.questionId === quiz.questions[questionNumber]._id);
        if (currentQuestion) {
            setSelectedOptions(currentQuestion.answers);
        } else {
            setSelectedOptions([]);
        }
    }, [questionNumber, questions]);
    

    const handleOptionChange = (index) => {
        const currentQuestion = quiz.questions[questionNumber];
        if (currentQuestion.numberOfAnswers === 1) {
            setSelectedOptions([index]);
        } else {
            if (selectedOptions.includes(index)) {
                setSelectedOptions(selectedOptions.filter(i => i !== index));
            } else {
                setSelectedOptions([...selectedOptions, index]);
            }
        }
    };

    const handleOptionClick = (index) => {
        handleOptionChange(index);
    };

    const handleClearSelection = () => {
        const updatedQuestions = questions.filter((question)=> question.questionId !== quiz.questions[questionNumber]._id);
        localStorage.setItem('attempted_questions', JSON.stringify(updatedQuestions));
        setQuestions(updatedQuestions);
    };

    const handlePrev = () => {
        if (questionNumber - 1 >= 0) {
            setQuestionNumber(questionNumber - 1);
            setSelectedOptions([]);
        }
    };

    const handleNext = () => {
        if (questionNumber + 1 < quiz.questions.length) {
            setQuestionNumber(questionNumber + 1);
            setSelectedOptions([]);
        }
    };

    const handleSubmit = () => {
        if (selectedOptions.length === 0) {
            toast.error("Please select an option");
            return;
        }
        const currentQuestion = quiz.questions[questionNumber];
        const attemptedQuestion = {
            questionId: currentQuestion._id,
            answers: selectedOptions,
        };
        const updatedQuestions = questions.filter(q => q.questionId !== currentQuestion._id);
        updatedQuestions.push(attemptedQuestion);
        localStorage.setItem('attempted_questions', JSON.stringify(updatedQuestions));
        setQuestions(updatedQuestions);
        handleNext();
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-type": "application/json"
                }
            };
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/attempt`, { quizId: quiz._id, questions }, config);
            setQuestionNumber(0);
            setSelectedOptions([]);
            setQuestions([]);
            localStorage.removeItem('quiz_time_remaining');
            localStorage.removeItem('attempted_questions');
            navigate(`/quiz-feedback/${data.resultId}`, { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const isSubmittedAnswer = (questionId, index) => {
        return questions.some(q => q.questionId === questionId && q.answers.includes(index));
    }

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        const pad = (num) => (num < 10 ? '0' : '') + num;
        
        return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    };    

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
            <div className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Play Quiz</h1>
                <div className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
                    Time Remaining: <span className='text-red-500 dark:text-red-400'>{formatTime(timeRemaining)}</span>
                </div>
            </div>
            <div className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200">
                {quiz ? (
                    <div className='w-full flex flex-col justify-between'>
                        <button
                            type="button"
                            onClick={handleFinish}
                            className={`w-24 h-10 ${loading ? 'bg-gray-200 dark:bg-gray-700' : 'bg-red-600 dark:bg-red-400 hover:bg-red-700 dark:hover:bg-red-300 text-white dark:text-black'} self-end font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300`}
                        >
                            {loading ? <ImSpinner2 size={22} className="mx-auto animate-spin dark:text-white" /> : 'Finish'}
                        </button>
                        <div className='mb-6'>
                            <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>Question {questionNumber + 1}:</h2>
                            <p className='text-base text-gray-700 dark:text-gray-200 mb-2'>
                                {quiz.questions[questionNumber].title}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                {quiz.questions[questionNumber].numberOfAnswers === 1
                                    ? 'Single answer correct'
                                    : 'Multiple answers correct'}
                            </p>
                        </div>
                        <div className='w-full flex flex-col justify-center gap-4 mb-6'>
                            {quiz.questions[questionNumber].options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-md shadow-md dark:shadow-gray-900 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedOptions.includes(index) ? isSubmittedAnswer(quiz.questions[questionNumber]._id, index) ? 'bg-blue-200 dark:bg-blue-900' : 'bg-gray-200 dark:bg-gray-600' : ''}`}
                                    onClick={() => handleOptionClick(index)}
                                >
                                    <input
                                        type="checkbox"
                                        name="selected_option"
                                        id={`option${index + 1}`}
                                        value={option}
                                        checked={selectedOptions.includes(index)}
                                        onChange={() => handleOptionChange(index)}
                                        className='mr-2'
                                    />
                                    <label htmlFor={`option${index + 1}`} className='text-base text-gray-700 dark:text-gray-200'>
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className='w-full flex justify-between mb-4'>
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300 disabled:opacity-50"
                                disabled={questionNumber === 0}
                            >
                                Prev
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300 disabled:opacity-50"
                                disabled={questionNumber === quiz.questions.length - 1}
                            >
                                Next
                            </button>
                        </div>
                        <div className='flex flex-wrap items-center justify-center gap-4'>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full max-w-32 h-10 bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={handleClearSelection}
                                className="w-full max-w-32 h-10 bg-yellow-600 dark:bg-yellow-400 hover:bg-yellow-700 dark:hover:bg-yellow-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='text-base text-gray-800 dark:text-gray-200'>No questions found!</div>
                )}
                <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
            </div>
        </div>
    );
};

export default PlayQuiz;
