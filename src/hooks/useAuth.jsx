import { useContext, useState } from "react";
import { loginService } from "../services/authService";
import { LoaderContext } from "../context/LoaderProvider";

const useAuth = () => {

  const [error, setError] = useState(null);
  const { setLoading } = useContext(LoaderContext);

  const login = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      // const response = await loginService(payload);
      const { success, token, data } = { success:true, token:'jwt-token', data:'' }  // response.data;
      // 🔐 Store token
      debugger;
      localStorage.setItem("token", token);
      // 👤 Store user (recommended)
      // localStorage.setItem("user", JSON.stringify(user));
      return { success, token, data };

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return { success: true };

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return { login, logout, error };
};

export default useAuth;