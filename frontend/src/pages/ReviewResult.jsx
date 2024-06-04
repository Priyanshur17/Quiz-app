import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from '../context/ContextProvider';
import { TbFidgetSpinner } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropdownMenu from './../components/miscellaneous/DropdownMenu';

const ReviewResult = () => {
    const { user, darkMode } = useAppContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(0);

    const fetchReviewResult = async () => {
        try {
            const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`,
              }                
            }
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/review-result/${id}`, config);
            setResult(data.result);
          } 
          catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }
    
    useEffect(() => {
        if(user) {
            fetchReviewResult();
        }
    }, [id, user]);

    const handlePrev = () => {
        if (questionNumber - 1 >= 0) {
            setQuestionNumber(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (questionNumber + 1 < result.questions.length) {
            setQuestionNumber(prev => prev + 1);
        }
    };

    const getOptionStyle = (optionIndex, correctAnswerIndexes, selectedAnswerIndexes) => {
        if (selectedAnswerIndexes.includes(optionIndex)) {
            return correctAnswerIndexes.includes(optionIndex) ? 'bg-green-500 text-white dark:text-black' : 'bg-red-300 dark:bg-red-700';
        }
        return correctAnswerIndexes.includes(optionIndex) ? 'bg-green-300 dark:bg-green-700 text-black dark:text-white' : 'bg-white dark:bg-gray-800 text-black dark:text-white';
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
            <div className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Review Result</h1>
                <DropdownMenu />
            </div>
            <div className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200">
                {result ? (
                    <div className='w-full flex flex-col justify-between'>
                            <button 
                                type="button" 
                                onClick={()=>navigate(-1)} 
                                className="w-24 h-10 self-end bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
                            >
                                Back
                            </button>
                        <div className='mb-6'>
                            <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>Question {questionNumber + 1}:</h2>
                            <p className='text-base text-gray-700 dark:text-gray-200 mb-2'>
                                {result.questions[questionNumber].questionId.title}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                {result.questions[questionNumber].numberOfAnswers === 1
                                    ? 'Single answer correct'
                                    : 'Multiple answers correct'}
                            </p>
                        </div>
                        <div className='w-full flex flex-col justify-center gap-4 mb-6'>
                            {result.questions[questionNumber].questionId.options.map((option, index) => (
                                <div key={index} className={`p-4 rounded-md shadow-md dark:shadow-gray-900 ${getOptionStyle(index, result.questions[questionNumber].questionId.answers, result.questions[questionNumber].answers)}`}>
                                    <input 
                                        type="checkbox" 
                                        name="selected_option" 
                                        id={`option${index + 1}`} 
                                        value={option}
                                        checked={result.questions[questionNumber].answers.includes(index)}
                                        className='mr-2' 
                                        readOnly
                                    />
                                    <label htmlFor={`option${index + 1}`}>
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
                                disabled={questionNumber===0}
                            >
                                Prev
                            </button>
                            <button 
                                type="button" 
                                onClick={handleNext} 
                                className="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300 disabled:opacity-50"
                                disabled={questionNumber===result.questions.length-1}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    <TbFidgetSpinner className='animate-spin' size={70} />
                )}
                <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
            </div>
        </div>
    );
};

export default ReviewResult;
