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

export const SaveProgressService = (payload) => {
    return axiosInstance.put('/Tracker/SaveProgress', payload);
}

export const SaveTestCasesService = (payload) => {
    return axiosInstance.post(`/Tracker/CreateUpdateTestCase/`, payload);
}

export const GetTestCasesByTaskIdService = (taskId) => {
    return axiosInstance.get(`/Tracker/GetTestCases/${taskId}`);
}

export const CreateTaskHistoryService = (payload) => {
    return axiosInstance.post('/Tracker/CreateTaskHistory', payload);
}

export const GetTaskStatusHistoryService = (taskId) => {
    return axiosInstance.get(`/Tracker/GetTaskStatusHistory/${taskId}`);
}

export const CreateTaskCommentService = (payload) => {
    return axiosInstance.post('/Tracker/CreateTaskComment', payload);
}

export const GetTaskCommentsByTaskIdService = (taskId) => {
    return axiosInstance.get(`/Tracker/GetTaskComments/${taskId}`);
}