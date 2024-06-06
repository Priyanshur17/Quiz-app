import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/ContextProvider';
import { ImSpinner2 } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail = () => {
    const { darkMode } = useAppContext();
    const { id, token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verify-email/${id}/${token}`, {
                headers: {
                  'Content-Type': 'application/json',
                }
            });
            toast.success(data.message);
            setIsVerified(true);
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            setTimeout(()=>navigate('/auth'), 1000);
        } 
        catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
        finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        handleSubmit();
    }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-[90%] max-w-xl my-5 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Email Verification</h1>
            </div>
            <div className="mt-8">
                <form method="POST" className="w-full px-6 py-8 bg-white dark:bg-gray-800 rounded-lg" noValidate>
                    <div className="flex justify-center">
                        <button 
                            type="button"
                            onClick={handleSubmit} 
                            className={`w-28 h-12 ${loading ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black'} rounded-lg hover:scale-105 transition-colors duration-300`} 
                        >
                            {loading ? <ImSpinner2 size={22} className="mx-auto animate-spin dark:text-white" /> : isVerified ? 'Verified' : 'Not Verified'}
                        </button>
                    </div>
                    <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
                </form>
            </div>
        </div>
    </div>
  )
}

export default VerifyEmail