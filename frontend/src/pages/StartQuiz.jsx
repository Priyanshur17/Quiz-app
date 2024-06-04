import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/ContextProvider';
import { TbFidgetSpinner } from "react-icons/tb";
import { ImSpinner2 } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropdownMenu from './../components/miscellaneous/DropdownMenu';

const StartQuiz = () => {
    const { user, darkMode } = useAppContext();
    const { id } = useParams(); 
    const navigate = useNavigate();
    const navigateCalled = useRef(false);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchQuiz = async () => {
      try {
        const config = {
          headers: {
              Authorization: `Bearer ${user.token}`,
          }                
        }
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/join/${id}`, config);
        setQuiz(data.quiz);
        navigateCalled.current = false;
      } 
      catch (error) {
        if (!navigateCalled.current) {
          toast.error(error.response?.data?.message || "An error occurred");
          navigateCalled.current = true; // Set navigation state to prevent multiple calls
          setTimeout(() => navigate('/join-quiz', { replace: true }), 1000);
        }
      }
    }

    useEffect(() => {
      if(user) {
        fetchQuiz();
      }
    }, [user])

    const startQuiz = () => {
      setLoading(true);
      if(!quiz) {
        toast.error("Quiz not found");
        setLoading(false);
        return;
      }
      if(quiz.isLocked) {
        toast.error("Quiz is locked. Please try again later.");
        setLoading(false);
        return;
      }
      navigate('/play-quiz', { state: { quiz } })
      setLoading(false);
    }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Start Quiz</h1>
        <DropdownMenu />
      </div>
      <div className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200">
        <div className="w-full max-w-md flex items-center justify-center">
          {!quiz ? (
            <TbFidgetSpinner className='animate-spin' size={70} />
          ) : (
              <div className='w-full flex flex-col items-center justify-center gap-8'>
                  <div className='w-full p-6 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center'>
                      <div className='text-4xl font-bold text-gray-800 dark:text-gray-200'>
                          {quiz.title}
                      </div>
                      <div className='text-lg text-gray-600 dark:text-gray-300 mt-2'>
                          by {quiz.authorId.name}
                      </div>
                  </div>
                  <div className='w-full flex items-center justify-center gap-4'>
                      <button 
                          type="button" 
                          onClick={startQuiz} 
                          className={`h-12 w-28 ${loading ? 'bg-gray-200 dark:bg-gray-700' : 'bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black'} rounded-md transition transform hover:scale-105 text-xl`}
                      >
                          {loading ? <ImSpinner2 size={22} className="mx-auto animate-spin dark:text-white" /> : 'Start'}
                      </button>
                      <button 
                          type="button" 
                          onClick={() => navigate(-1)} 
                          className="h-12 w-28 rounded-md bg-red-600 dark:bg-red-400 hover:bg-red-700 dark:hover:bg-red-300 transition transform hover:scale-105 text-xl text-white dark:text-black"
                      >
                          Cancel
                      </button>
                  </div>
              </div>
            )}
            <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
        </div>
      </div>
    </div>
  )
}

export default StartQuiz