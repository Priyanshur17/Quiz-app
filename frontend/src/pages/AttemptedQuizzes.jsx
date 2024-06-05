import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './../context/ContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropdownMenu from "../components/miscellaneous/DropdownMenu";
import QuizListItem from "../components/miscellaneous/QuizListItem";
import Skeleton from '../components/miscellaneous/Skeleton';

const AttemptedQuizzes = () => {
  const { user, darkMode } = useAppContext(); 
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  }
  const handleSearch = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }                
      }
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/attempted-quizzes?search=${search}`, config);
      setAttempts(data.attempts);
    } 
    catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(user) {
      handleSearch();
    }
  }, [user, search])

  const handleClick = (id) => {
    navigate(`/quiz-result/${id}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Attempted Quizzes</h1>
        <DropdownMenu />
      </div>
      <div className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-start text-gray-700 dark:text-gray-200">
        <form className="w-full max-w-xl px-3 mx-auto mb-8">   
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              id="search" 
              value={search} 
              onChange={handleChangeSearch} 
              className="block w-full p-4 pl-10 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 hover:focus:ring-indigo-400 dark:focus:border-indigo-600" 
              placeholder="Search Quizzes" 
            />
          </div>
          <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
        </form>
        <div className="h-96 w-full max-w-xl p-3 flex flex-col items-center gap-4 overflow-y-auto no-scrollbar">
          {loading ? <Skeleton /> : (
            attempts.length ? attempts.map((attempt) => (
              <QuizListItem key={attempt._id} id={attempt._id} quiz={attempt.quizId} isAuthor={false} handleClick={handleClick} />
            )) : (
              <div className="text-2xl text-gray-700 dark:text-gray-200">No quizzes found</div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default AttemptedQuizzes