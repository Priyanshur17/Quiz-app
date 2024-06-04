import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/ContextProvider';
import { TbFidgetSpinner } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropdownMenu from '../components/miscellaneous/DropdownMenu';

const QuizLeaderboard = () => {
  const { user, darkMode } = useAppContext();
  const { id }= useParams();
  const navigate = useNavigate();
  const [isLocked, setIsLocked] = useState(true);
  const [leaderboard, setLeaderboard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchResult = async (page = 1) => {
    try {
      const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }                
      }
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/leaderboard/${id}?page=${page}`, config);
      setLeaderboard(data.leaderboard);
      setIsLocked(data.isLocked);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } 
    catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }

  useEffect(() => {
    if(user) {
      fetchResult(currentPage);
    }
  }, [id, user, currentPage])

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
      <div className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Summary</h1>
        <DropdownMenu />
      </div>
      <div className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200">
        {!leaderboard ? <TbFidgetSpinner className='animate-spin' size={70} /> : (
            <div className='w-full max-w-md'>
                <div className="w-full flex justify-between items-center gap-5 mb-6">
                    <button className={`h-10 w-24 rounded-lg font-semibold cursor-pointer ${isLocked ? 'bg-red-600 dark:bg-red-400 text-white dark:text-black' : 'bg-green-600 dark:bg-green-400 text-white dark:text-black'}`}>
                        {isLocked ? 'Locked' : 'Unlocked'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)} 
                        className="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
                    >
                        Back
                    </button>
                </div>
                <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-950 overflow-hidden">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-200">Name</th>
                          <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-200">Total Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                            <td className="py-2 px-4 text-gray-600 dark:text-gray-200">{item.name}</td>
                            <td className="py-2 px-4 text-gray-600 dark:text-gray-200">{item.totalScore}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-md dark:shadow-gray-900 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>{`Page ${currentPage} of ${totalPages}`}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-md dark:shadow-gray-900 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
            </div>
        )}
        <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
      </div>
    </div>
  )
}

export default QuizLeaderboard