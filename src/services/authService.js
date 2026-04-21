import axiosInstance from "./api"

export const loginService = (data) => {
    return axiosInstance.post('/login',data);
}

