import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../../context/ContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JoinQuizForm = () => {
    const { darkMode } = useAppContext();
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    const handleChangeCode = (e) => {
        setCode(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(code === '') {
            toast.error("Please enter code");
            return;
        }

        navigate(`/start-quiz/${code}`)
    }

  return (
    <form method="POST" className="w-full max-w-md px-6 py-8 bg-white dark:bg-gray-800 rounded-lg" onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Code</label>
          <input 
              type="code" 
              name="code" 
              id="code" 
              className="w-full mt-2 p-3 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
              value={code} 
              onChange={handleChangeCode} 
          />
      </div>
      <div className="flex justify-center">
          <button 
              type="submit" 
              className="px-6 py-3 bg-blue-600 dark:bg-blue-400 text-white dark:text-black rounded-lg hover:bg-blue-700 dark:hover:bg-blue-300 hover:scale-105 transition-colors duration-300" 
          >
              Join
          </button>
      </div>
      <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
    </form>
  )
}

export default JoinQuizForm