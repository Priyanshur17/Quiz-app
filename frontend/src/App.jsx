import { BrowserRouter, Routes, Route } from "react-router-dom"
import ContextProvider from './context/ContextProvider'
import Home from "./pages/Home"
import MyQuizzes from './pages/MyQuizzes'
import AttemptedQuizzes from './pages/AttemptedQuizzes'
import CreateQuiz from "./pages/CreateQuiz"
import QuizDetails from "./pages/QuizDetails"
import JoinQuiz from "./pages/JoinQuiz"
import Auth from "./pages/Auth"
import VerifyEmail from "./pages/VerifyEmail"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import StartQuiz from "./pages/StartQuiz"
import PlayQuiz from "./pages/PlayQuiz"
import QuizResult from "./pages/QuizResult"
import ReviewResult from "./pages/ReviewResult"
import QuizSummary from "./pages/QuizSummary"
import ViewQuiz from "./pages/ViewQuiz"
import Error from "./pages/Error"
import QuizFeedback from "./pages/QuizFeedback"
import QuizLeaderboard from "./pages/QuizLeaderboard"


function App() {

  return (
    <BrowserRouter>
      <ContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="my-quizzes" element={<MyQuizzes />} />
          <Route path="attempted-quizzes" element={<AttemptedQuizzes />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="quiz-details" element={<QuizDetails />} />
          <Route path="view-quiz/:id" element={<ViewQuiz />} />
          <Route path="join-quiz" element={<JoinQuiz />} />
          <Route path="start-quiz/:id" element={<StartQuiz />} />
          <Route path="play-quiz" element={<PlayQuiz />} />
          <Route path="quiz-feedback/:id" element={<QuizFeedback />} />
          <Route path="quiz-result/:id" element={<QuizResult />} />
          <Route path="review-result/:id" element={<ReviewResult />} />
          <Route path="quiz-summary/:id" element={<QuizSummary />} />
          <Route path="quiz-leaderboard/:id" element={<QuizLeaderboard />} />
          <Route path="auth" element={<Auth />} />
          <Route path="verify-email/:id/:token" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:id/:token" element={<ResetPassword />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </ContextProvider>
    </BrowserRouter>
  )
}

export default App
