import { useState } from "react";

const QuizListItem = ({ id, quiz, isAuthor, handleClick, handleLock }) => {
  const [isLocked, setIsLocked] = useState(quiz.isLocked);

  return (
    <div  
      className="w-full p-6 rounded-lg flex items-center justify-between gap-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg dark:shadow-gray-900 transition-transform duration-300 transform hover:-translate-y-1"
    >
      <div onClick={() => handleClick(id)} className="flex-1 cursor-pointer">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{quiz.title}</h1>
        <p className="text-lg text-gray-500">{quiz.authorId.name}</p>
      </div>
      {isAuthor ? (
          <button
              onClick={()=>handleLock(quiz._id, isLocked, setIsLocked)}
              className={`px-4 py-2 rounded-lg text-white dark:text-black font-semibold cursor-pointer ${isLocked ? 'bg-red-600 dark:bg-red-400 hover:bg-red-700 dark:hover:bg-red-300' : 'bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300'}`}
          >
              {isLocked ? 'Unlock' : 'Lock'}
          </button>
      ) : (
          <p className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${isLocked ? 'bg-red-600 dark:bg-red-400 text-white dark:text-black' : 'bg-green-600 dark:bg-green-400 text-white dark:text-black'}`}>
              {isLocked ? 'Locked' : 'Unlocked'}
          </p>
      )}
    </div>
  );
}

export default QuizListItem;
