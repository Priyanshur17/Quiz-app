import ResetPasswordEmail from '../components/auth/ResetPasswordEmail'

const ForgotPassword = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[90%] max-w-xl my-5 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950">
          <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Forgot Password</h1>
          </div>
          <div className="mt-8">
            <ResetPasswordEmail />
          </div>
      </div>
    </div>
  )
}

export default ForgotPassword