import axiosInstance from "./api"

export const CreateTaskService = (dataToSend) => {
    return axiosInstance.post('',dataToSend);
}

export const GetTaksService = (dataToSend) => {
    return axiosInstance.post('',dataToSend);
}

