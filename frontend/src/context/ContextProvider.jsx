import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation, matchPath } from 'react-router-dom';

const Context = createContext(null);

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('dark-mode') === 'true';
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo) {
            if(location.pathname === '/auth' || matchPath('/verify-email/:id/:token', location.pathname) || location.pathname === '/forgot-password' || matchPath('/reset-password/:id/:token', location.pathname)) {
                return;
            }
            navigate('/auth', { state: { from: location } });
        }
    }, [navigate]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('dark-mode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

  return (
    <Context.Provider value={{user, setUser, darkMode, toggleDarkMode}}>
        {children}
    </Context.Provider>
  )
}

export const useAppContext = () => {
    return useContext(Context);
}

export default ContextProvider