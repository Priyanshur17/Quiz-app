import axios from "axios";
import { useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from "../../context/ContextProvider";
import { ImSpinner2 } from "react-icons/im";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const { darkMode } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(email === '' || password === '') {
            toast.error("Please enter all the fields");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }                
            }
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, { email, password }, config);
            toast.success("Login successful");
            setEmail('');
            setPassword('');
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            const from = location.state?.from?.pathname || '/';
            setTimeout(() => navigate(from), 1000);
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
            <div className="mb-4 relative">
                <label htmlFor="password" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Password</label>
                <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    id="password" 
                    className="w-full mt-2 p-3 pr-11 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                    value={password} 
                    onChange={handleChangePassword} 
                />
                <button 
                    type="button" 
                    onClick={()=>setShowPassword(!showPassword)} 
                    className="h-[43%] absolute inset-y-0 right-0 top-9 px-3 flex items-center text-gray-600 dark:text-gray-400"
                >
                    {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                </button>
                <div className="mt-2 text-right">
                    <a href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</a>
                </div>
            </div>
            <div className="flex justify-center">
                <button 
                    type="submit" 
                    className={`w-24 h-12 ${loading ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-600 dark:bg-blue-400 text-white dark:text-black hover:bg-blue-700 dark:hover:bg-blue-300'} rounded-lg hover:scale-105 transition-colors duration-300`} 
                >
                    {loading ? <ImSpinner2 size={22} className="mx-auto animate-spin dark:text-white" /> : 'Login'}
                </button>
            </div>
            <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
        </form>
    );
}

export default Login;
