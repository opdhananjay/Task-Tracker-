import axiosInstance from "./api"

export const CreateTaskService = (dataToSend) => {
    return axiosInstance.post('/Tracker/CreateTask',dataToSend);
}

export const UpdateTaskService = (dataToSend) => {
    return axiosInstance.post('/Tracker/UpdateTask',dataToSend);
}

export const GetTaksService = (organizationId) => {
    return axiosInstance.get(`/Tracker/GetTasks/${organizationId}`);
}

export const GetTaskByIdService = (taskId) => {
    return axiosInstance.get(`/Tracker/GetTaskById/${taskId}`);
}