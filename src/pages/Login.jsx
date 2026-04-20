import logo from "../assets/logo.png";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">

        {/* Header */}
        <div className="flex flex-col items-center mb-6 border-b pb-4">

            <img
                src={logo}
                alt="App Logo"
                className="h-12 w-auto object-contain"
            />

            <div className="text-sm text-gray-500 mt-2 text-center">
                
            </div>

        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">

          <h2 className="text-center text-gray-600 font-medium">
            Sign in to your account
          </h2>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Button */}
          <button className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
            Sign In
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;