import axios from "axios";
import { useState } from "react";
import { useAppContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { FaMinus } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateQuizForm = () => {
  const { user, darkMode } = useAppContext();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(180);
  const [questions, setQuestions] = useState([{
    title: "",
    options: ['', '', '', ''],
    answers: []
  }]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeDuration = (e) => {
    setDuration(e.target.value);
  }

  const handleChangeQuestion = (e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].title = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleChangeOption = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options[index] = value;
    setQuestions(updatedQuestions);
  };

  const handleChangeAnswer = (index) => {
    const updatedQuestions = [...questions];
    const answers = updatedQuestions[currentQuestionIndex].answers;
    if (answers.includes(index)) {
      updatedQuestions[currentQuestionIndex].answers = answers.filter(answer => answer !== index);
    } else {
      updatedQuestions[currentQuestionIndex].answers.push(index);
    }
    setQuestions(updatedQuestions);
  };

  const handleAddOption = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options.push('');
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.title === "" || currentQuestion.options.some(option => option === '') || currentQuestion.answers.length === 0) {
      toast.error("Please fill out all fields before adding a new question");
      return;
    }

    const newQuestion = { title: "", options: ['', '', '', ''], answers: [] };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const handleUpdateQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.title === "" || currentQuestion.options.some(option => option === '') || currentQuestion.answers.length === 0) {
      toast.error("Please fill out all fields to update a question");
      return;
    }

    toast.success("Question updated successfully");
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    if (updatedQuestions.length === 0) {
      setQuestions([{
        title: "",
        options: ['', '', '', ''],
        answers: []
      }]);
      setCurrentQuestionIndex(0);
    } else {
      setQuestions(updatedQuestions);
      setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
    }
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (title === '') {
      toast.error("Please enter a title");
      setLoading(false);
      return;
    }

    if(questions.length === 0) {
      toast.error("Atleast one question is required");
      setLoading(false);
      return; 
    }

    if (questions.some(question => question.title === '' || question.options.some(option => option === '') || question.answers.length === 0)) {
      toast.error("Please complete all questions before submitting");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json"
        }
      };
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/create`, { title, questions, duration }, config);
      toast.success("Quiz created successfully");
      setTitle('');
      setQuestions([{
        title: "",
        options: ['', '', '', ''],
        answers: []
      }]);
      setCurrentQuestionIndex(0);
      setTimeout(() => navigate('/quiz-details', { state: { id: data.quiz._id }, replace: true }), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form method="POST" className="w-full flex flex-col items-center gap-6" onSubmit={handleSubmit} noValidate>
      <div className="w-full flex flex-col gap-3">
        <label htmlFor="title" className="text-xl max-sm:text-lg text-gray-700 dark:text-gray-200">Title</label>
        <input type="text" name="title" id="title" className="h-12 w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md text-lg max-sm:text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500" required value={title} onChange={handleChangeTitle} />
      </div>
      <div className="w-full flex flex-col gap-3">
        <label htmlFor="duration" className="text-xl max-sm:text-lg text-gray-700 dark:text-gray-200">Duration (minutes)</label>
        <input type="number" name="duration" id="duration" className="h-12 w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md text-lg max-sm:text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500" required value={duration} onChange={handleChangeDuration} min="1" />
      </div>
      <div className="w-full flex flex-col gap-3">
        <label htmlFor="question" className="text-xl max-sm:text-lg text-gray-700 dark:text-gray-200">Question {currentQuestionIndex+1}</label>
        <textarea rows={3} name="question" id="question" className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md text-lg max-sm:text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500" required value={questions[currentQuestionIndex].title} onChange={handleChangeQuestion} />
      </div>
      <div className="w-full flex flex-col gap-3">
        <label className="text-xl max-sm:text-lg text-gray-700 dark:text-gray-200">Options</label>
        {questions[currentQuestionIndex].options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="text"
              name={`option${index + 1}`}
              placeholder={`Option ${index + 1}`}
              className="h-12 w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md text-lg max-sm:text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              required
              value={option}
              onChange={(e) => handleChangeOption(index, e.target.value)}
            />
            <input
              type="checkbox"
              className="h-5 w-5 text-blue-500"
              checked={questions[currentQuestionIndex].answers.includes(index)}
              onChange={() => handleChangeAnswer(index)}
            />
            {questions[currentQuestionIndex].options.length > 2 && (
              <button
                type="button"
                className="h-10 w-10 bg-red-500 hover:bg-red-600 dark:hover:bg-red-400 rounded-full text-white dark:text-black"
                onClick={() => handleRemoveOption(index)}
              >
                <FaMinus className="mx-auto" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="mt-2 h-12 w-16 bg-green-500 hover:bg-green-600 dark:hover:bg-green-400 rounded-md text-xl max-sm:text-lg text-white dark:text-black"
          onClick={handleAddOption}
        >
          <IoMdAdd size={30} className="mx-auto" />
        </button>
      </div>
      <div className="w-full flex items-center justify-between gap-4">
        <button type="button" onClick={handlePrev} className="h-12 w-24 bg-gray-600 dark:bg-gray-400 hover:bg-gray-700 dark:hover:bg-gray-300 rounded-md text-xl max-sm:text-lg text-white dark:text-black disabled:opacity-50" disabled={currentQuestionIndex === 0}>Prev</button>
        <button type="button" onClick={handleNext} className="h-12 w-24 bg-gray-600 dark:bg-gray-400 hover:bg-gray-700 dark:hover:bg-gray-300 rounded-md text-xl max-sm:text-lg text-white dark:text-black disabled:opacity-50" disabled={currentQuestionIndex === questions.length - 1}>Next</button>
      </div>
      <div className="w-full flex items-center justify-center gap-4">
        {currentQuestionIndex === questions.length - 1 ? (
          <button type="button" className="h-12 w-40 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 rounded-md text-xl max-sm:text-lg text-white dark:text-black" onClick={handleAddQuestion}>New</button>
        ) : (
          <button type="button" className="h-12 w-40 bg-orange-600 dark:bg-orange-400 hover:bg-orange-700 dark:hover:bg-orange-300 rounded-md text-xl max-sm:text-lg text-white dark:text-black" onClick={handleUpdateQuestion}>Update</button>
        )}
        <button
          type="button"
          className="h-12 w-40 bg-yellow-600 dark:bg-yellow-400 hover:bg-yellow-700 dark:hover:bg-yellow-300 rounded-md text-xl max-sm:text-lg text-white dark:text-black"
          onClick={() => handleRemoveQuestion(currentQuestionIndex)}
        >
          Remove
        </button>
      </div>
      <div className="w-full flex items-center justify-center gap-4">
        <button type="submit" className={`h-12 w-40 ${loading ? 'bg-gray-200 dark:bg-gray-700' : 'bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black'} rounded-md text-xl max-sm:text-lg`}>{loading ? <ImSpinner2 size={22} className="mx-auto animate-spin dark:text-white" /> : 'Create'}</button>
        <button type="button" onClick={() => navigate(-1)} className="h-12 w-40 bg-red-600 dark:bg-red-400 hover:bg-red-700 dark:hover:bg-red-300 rounded-md text-xl max-sm:text-lg text-white dark:text-black">Cancel</button>
      </div>
      <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
    </form>
  );
};

export default CreateQuizForm;
