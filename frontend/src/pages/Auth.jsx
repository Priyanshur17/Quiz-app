import { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const Auth = () => {
    const [login, setLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-[90%] max-w-xl my-5 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Welcome to QuizMaster</h1>
                </div>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <button
                        className={`px-6 py-3 rounded-lg focus:outline-none transition-colors duration-300 ${
                            login
                                ? 'bg-blue-600 dark:bg-blue-400 text-white dark:text-black'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setLogin(true)}
                    >
                        Sign In
                    </button>
                    <button
                        className={`px-6 py-3 rounded-lg focus:outline-none transition-colors duration-300 ${
                            !login
                                ? 'bg-blue-600 dark:bg-blue-400 text-white dark:text-black'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>
                <div className="mt-8">
                    {login ? <Login /> : <Register />}
                </div>
            </div>
        </div>
    );
};

export default Auth;
