import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/ContextProvider';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { TbFidgetSpinner } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropdownMenu from '../components/miscellaneous/DropdownMenu';

const QuizSummary = () => {
  const { user, darkMode } = useAppContext();
  const { id }= useParams();
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(null);
  const [starCounts, setStarCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [feedbackMessages, setFeedbackMessages] = useState(null);

  const fetchResult = async () => {
    try {
      const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }                
      }
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/summary/${id}`, config);
      setAverageRating(data.averageRating);
      setStarCounts(data.starCounts);
      setFeedbackMessages(data.feedbackMessages.filter(feedback => feedback.message.trim() !== ''));
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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} size={30} className="text-yellow-500" />);
      } else if (i - rating < 1) {
        stars.push(<FaStarHalfAlt key={i} size={30} className="text-yellow-500" />);
      } else {
        stars.push(<FaStar key={i} size={30} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const renderStarCount = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<FaStar key={i} size={18} className={`${i<count ? 'text-yellow-500' : 'text-gray-300'} mr-1`} />);
    }
    return stars;
  };
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
      <div className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Summary</h1>
        <DropdownMenu />
      </div>
      <div className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200">
        <div className='w-full max-w-2xl'>
          <div className="w-full flex justify-between items-center gap-5 mb-6">
            <button
              type='button'
              onClick={() => navigate(`/quiz-leaderboard/${id}`)}
              className="h-10 w-28 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black rounded-lg font-semibold cursor-pointer"
            >
                Leaderboard
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="w-24 h-10 bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
            >
              Back
            </button>
          </div>
          <div className="w-full mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Average Rating</h2>
            {!averageRating ? <TbFidgetSpinner className='mx-auto animate-spin' size={40} /> : (
              <div className="flex items-center p-3 space-x-2">
                {renderStars(averageRating)}
                <span className="text-3xl text-yellow-500">{averageRating}</span>
              </div>
            )}
            {!starCounts ? <TbFidgetSpinner className='mx-auto animate-spin' size={40} /> : (
              <div className="p-3 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center">
                    {renderStarCount(star)}
                    <span className="text-gray-600 dark:text-gray-400 ml-2">{star} stars: {starCounts[star]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Feedbacks</h2>
            {!feedbackMessages ? <TbFidgetSpinner className='mx-auto animate-spin' size={40} /> : (
              <div className="max-h-96 p-3 space-y-4 overflow-y-auto no-scrollbar">
                {feedbackMessages.length > 0 ? (
                  feedbackMessages.map((feedback, index) => (
                    <div key={index} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md dark:shadow-gray-900 text-gray-700 dark:text-gray-200">
                      <div className="font-semibold text-blue-600 dark:text-blue-400">{feedback.user}</div>
                      <div className="mt-2">{feedback.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-lg text-gray-700 dark:text-gray-200">No feedback available.</div>
                )}
              </div>
            )}
          </div>
        </div>
        <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
      </div>
    </div>
  )
}

export default QuizSummary