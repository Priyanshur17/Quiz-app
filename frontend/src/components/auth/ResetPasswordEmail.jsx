import axios from "axios";
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/ContextProvider';
import { ImSpinner2 } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordEmail = () => {
  const { darkMode } = useAppContext();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(email === '') {
      toast.error("Please enter email");
      setLoading(false);
      return;
    }
    
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/send-reset-password-email`, { email }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      toast.success(data.message);
      setEmail('');
      setTimeout(()=>navigate('/auth'), 5000);
    } 
    catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <form method="POST" className="w-full px-6 py-8 bg-white dark:bg-gray-800 rounded-lg" onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input 
              type="email" 
              name="email" 
              id="email" 
              className="w-full mt-2 p-3 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
              value={email} 
              onChange={handleChangeEmail} 
          />
      </div>
      <div className="flex justify-center">
        <button 
            type="submit" 
            className={`w-24 h-12 ${loading ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-600 dark:bg-blue-400 text-white dark:text-black hover:bg-blue-700 dark:hover:bg-blue-300'} rounded-lg hover:scale-105 transition-colors duration-300`} 
        >
            {loading ? <ImSpinner2 size={22} className="mx-auto animate-spin dark:text-white" /> : 'Submit'}
        </button>
      </div>
      <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
    </form>
  )
}

export default ResetPasswordEmail