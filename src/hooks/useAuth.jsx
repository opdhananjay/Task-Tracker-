import { useContext, useState } from "react";
import { loginService } from "../services/authService";
import { LoaderContext } from "../context/LoaderProvider";
import { data } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {

  const [error, setError] = useState(null);
  const { setLoading } = useContext(LoaderContext);

  const login = async (payload) => {
    debugger;
    try {
      setLoading(true);
      setError(null);

      // const response = await loginService(payload);
      //const { success, token, message, data } = { success:true, token:'jwt-token', message:'Login Successfully', data:'' }  // response.data;
      // 🔐 Store token
      //debugger;
      //localStorage.setItem("token", token);
      // 👤 Store user (recommended)
      // localStorage.setItem("user", JSON.stringify(user));

      const res = await loginService(payload);
      
      debugger;

      return res.data;

    } catch (error) {
      //toast.error(error.response?.data?.message);
      setError(error.response?.data?.message || "Login failed");
      
    } finally {
       setLoading(false);
    }
  };

  const setToken = (token) => {
      localStorage.setItem("token", token);
  };

  const getToken = () => {
      return localStorage.getItem("token");
  };

  const removeToken = () => {
      localStorage.removeItem("token");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

   const getUserFromToken = () => {

      const token = getToken();

      if (!token) return null;

      try {
          return jwtDecode(token);
      }
      catch {
          return null;
      }
   };

  return { login, logout, setToken, getToken, removeToken, getUserFromToken, error };

};

export default useAuth;