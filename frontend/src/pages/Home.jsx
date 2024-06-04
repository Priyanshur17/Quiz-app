import { useNavigate } from 'react-router-dom';
import DropdownMenu from './../components/miscellaneous/DropdownMenu';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateQuiz = () => {
    navigate('/create-quiz');
  }

  const handleJoinQuiz = () => {
    navigate('/join-quiz');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Quiz Master</h1>
        <DropdownMenu />
      </div>
      <div className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200">
        <h1 className="text-4xl max-sm:text-3xl font-bold text-center mb-6">Welcome to QuizMaster!</h1>
        <p className="text-lg max-sm:text-base text-justify mb-8">
          Test your knowledge with our fun and engaging quizzes. Whether you're looking to challenge yourself or compete with friends, QuizMaster has something for everyone. Start a quiz now and see how much you know! Create custom quizzes on any topic, share them with your friends, and see who can score the highest. Or join a quiz created by others and put your skills to the test. From general knowledge to niche subjects, there's always something new to learn. Ready to get started? Click below to begin your quiz journey!
        </p>
        <div className="flex flex-wrap justify-center gap-5">
          <button
            className="h-12 w-40 rounded-md bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 transition transform hover:scale-105 text-xl text-white dark:text-black"
            onClick={handleCreateQuiz}
          >
            Create a Quiz
          </button>
          <button
            className="h-12 w-40 rounded-md bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 transition transform hover:scale-105 text-xl text-white dark:text-black"
            onClick={handleJoinQuiz}
          >
            Join a Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
