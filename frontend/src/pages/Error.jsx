import { useNavigate } from "react-router-dom"
import DropdownMenu from "../components/miscellaneous/DropdownMenu"

const Error = () => {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Error Page</h1>
        <DropdownMenu />
      </div>
      <div className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200">
        <h1 className="text-3xl max-sm:text-2xl mb-6"><span className="text-red-500 text-4xl max-sm:text-3xl font-semibold">404</span> Page not found!</h1>
        <button
            className="h-12 w-28 rounded-md bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 transition transform hover:scale-105 text-xl text-white dark:text-black"
            onClick={()=>navigate('/', { replace: true })}
          >
            Home
        </button>
      </div>
    </div>
  )
}

export default Error