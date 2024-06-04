import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/ContextProvider';
import { TbFidgetSpinner } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropdownMenu from './../components/miscellaneous/DropdownMenu';

const QuizResult = () => {
  const { user, darkMode } = useAppContext();
  const navigate = useNavigate();
  const { id }= useParams();
  const [result, setResult] = useState(null);

  const fetchResult = async () => {
    try {
      const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }                
      }
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/result/${id}`, config);
      setResult(data.result);
    } 
    catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }

  useEffect(() => {
    if(user) {
      fetchResult();
    }
  }, [id, user])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-white dark:text-gray-100">
      <div className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Quiz Result</h1>
        <DropdownMenu />
      </div>
      <div className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200">
        {!result ? <TbFidgetSpinner className='animate-spin' size={70} /> : (
          <div className="w-full max-w-md">
            <table className="w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg dark:shadow-gray-950 mb-6 overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-600">
                  <th className="py-2 px-4 text-left">Details</th>
                  <th className="py-2 px-4 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-gray-600">
                  <td className="py-2 px-4">Total questions</td>
                  <td className="py-2 px-4">{result.questions.length}</td>
                </tr>
                <tr className="border-b dark:border-gray-600">
                  <td className="py-2 px-4">Attempted questions</td>
                  <td className="py-2 px-4">{result.questions.filter((q) => q.answers.length !== 0).length}</td>
                </tr>
                <tr className="border-b dark:border-gray-600">
                  <td className="py-2 px-4">Unattempted questions</td>
                  <td className="py-2 px-4">{result.questions.filter((q) => q.answers.length === 0).length}</td>
                </tr>
                <tr className="border-b dark:border-gray-600">
                  <td className="py-2 px-4">Correct answers</td>
                  <td className="py-2 px-4">{result.questions.filter((q) => q.isCorrect === "true").length}</td>
                </tr>
                <tr className="border-b dark:border-gray-600">
                  <td className="py-2 px-4">Partially Correct answers</td>
                  <td className="py-2 px-4">{result.questions.filter((q) => q.isCorrect === "partial").length}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Incorrect answers</td>
                  <td className="py-2 px-4">{result.questions.filter((q) => q.isCorrect === "false" && q.answers.length !== 0).length}</td>
                </tr>
              </tbody>
            </table>
            <div className="w-full flex flex-wrap items-center justify-center gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/')} 
                className="w-32 h-12 bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
              >
                Home
              </button>
              <button 
                type="button" 
                onClick={() => navigate(`/review-result/${result._id}`)} 
                className="w-32 h-12 bg-orange-600 dark:bg-orange-400 hover:bg-orange-700 dark:hover:bg-orange-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
              >
                Review
              </button>
              <button 
                type="button" 
                onClick={() => navigate(`/quiz-summary/${result.quizId}`)} 
                className="w-32 h-12 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
              >
                Summary
              </button>
            </div>
          </div>
        )}
        <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
      </div>
    </div>
  )
}

export default QuizResult