import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../../context/ContextProvider";
import { HiMenu, HiX } from 'react-icons/hi';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { MdHistoryToggleOff } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import { FaUserCircle } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";

const DropdownMenu = () => {
    const { user, darkMode, toggleDarkMode } = useAppContext();
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem("userInfo")));
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(user) {
            setLoggedUser(user);
        }
    }, [user])

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate('/auth');
    };

    return (
        <div className="relative inline-block text-left">
            <div className="sm:hidden">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="inline-flex justify-center items-center gap-x-1.5 rounded-lg bg-teal-600 dark:bg-teal-400 px-4 py-3 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-teal-700 dark:hover:bg-teal-300 focus:outline-none"
                    id="menu-button"
                    aria-expanded={open}
                    aria-haspopup="true"
                >
                    <span className="sr-only">Open options</span>
                    {open ? (
                        <HiX className="h-5 w-5" aria-hidden="true" />
                    ) : (
                        <HiMenu className="h-5 w-5" aria-hidden="true" />
                    )}
                </button>
            </div>
            <div className="hidden sm:block">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="inline-flex justify-center items-center gap-x-1.5 rounded-lg bg-teal-600 dark:bg-teal-400 px-4 py-3 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-teal-700 dark:hover:bg-teal-300 focus:outline-none"
                    id="menu-button"
                    aria-expanded={open}
                    aria-haspopup="true"
                >
                    <span>Options</span>
                    <svg className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {open && (
                <div
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-800 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                >
                    <div className="py-2 bg-teal-600 dark:bg-teal-400 text-white dark:text-black rounded-t-md flex items-center gap-2 px-4">
                        <FaUserCircle className="h-6 w-6" />
                        <span className="block text-sm">
                            Signed in as {loggedUser ? loggedUser.email : 'guest'}
                        </span>
                    </div>
                    <div className="py-1 bg-gray-50 dark:bg-gray-800" role="none">
                        <span
                            type="button"
                            onClick={toggleDarkMode}
                            className="flex flex-wrap items-center justify-start gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-700 cursor-pointer"
                        >
                            { darkMode ? <MdDarkMode size={20} /> : <MdLightMode size={20} /> }
                            { darkMode ? "Dark Mode" : "Light Mode" }
                        </span>
                    </div>
                    <div className="py-1 bg-gray-50 dark:bg-gray-800" role="none">
                        <a
                            href="/my-quizzes"
                            className="flex flex-wrap items-center justify-start gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-700"
                            role="menuitem"
                            tabIndex="-1"
                            id="menu-item-2"
                        >
                            <MdHistoryToggleOff size={20} />
                            My Quizzes
                        </a>
                        <a
                            href="/attempted-quizzes"
                            className="flex flex-wrap items-center justify-start gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-700"
                            role="menuitem"
                            tabIndex="-1"
                            id="menu-item-3"
                        >
                            <MdHistory size={20} />
                            Attempted Quizzes
                        </a>
                    </div>
                    <div className="py-1 bg-gray-50 dark:bg-gray-800 rounded-b-md" role="none">
                        <span
                            onClick={handleLogout}
                            className="flex flex-wrap items-center justify-start gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-700 cursor-pointer"
                            role="menuitem"
                            tabIndex="-1"
                            id="menu-item-4"
                        >
                            <BiLogOut size={20} /> Logout
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
