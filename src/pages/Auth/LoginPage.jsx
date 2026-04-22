import { useContext, useState } from "react";
import logo from "../../assets/logo.png";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LoaderContext } from "../../context/LoaderProvider";
import toast from "react-hot-toast";

const LoginPage = () => {

  const { login,logout } = useAuth();
  
  const navigate = useNavigate();
  
  const [formData,setFormData] = useState({
    email:'',
    password:''
  });

  const handleChange = (e) => {

    const { name,value } = e.target;

    setFormData((prev)=>({
      ...prev,
      [name]:value
    }));
    
  }

  const handleLogin = async (e) => {
    
    e.preventDefault();

    if(!handleValidations()) return false;

    // API CALL 
    const response = await login(formData);

    if(response.success && response.token){
        toast.success(response.message);
        navigate('/dashboard');
    }
    else{
        toast.success(response.message || 'Failed to Login');
    }

    setFormData({
      email:'',
      password:''
    });
  }

  const handleValidations = () => {
    
    if(!formData.email.trim()){
      return false;
    } 

    if(!formData.password.trim()){
      return false;
    }

    return true;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">

        {/* Header */}
        {/* <div className="flex flex-col items-center mb-6 border-b pb-4">

            <img
                src={logo}
                alt="App Logo"
                className="h-12 w-auto object-contain"
            />

            <div className="text-sm text-gray-500 mt-2 text-center">
                
            </div>

        </div> */}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <h2 className="text-center text-gray-600 font-medium">
            Sign in to your account
          </h2>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
            value={formData.email}
            onChange={(e)=>{handleChange(e)}}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
            value={formData.password}
            onChange={(e)=>{handleChange(e)}}
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

export default LoginPage;