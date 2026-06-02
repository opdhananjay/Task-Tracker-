import axiosInstance from "./api";

export const GetOrganizationService = (orgId) => {
    return axiosInstance.get(`/Tracker/GetOrganization?orgId=${orgId}`);
}

export const CreateOrganizationService = (dataToSend) => {
    return axiosInstance.post('/Tracker/CreateOrg',dataToSend);
}

export const UpdateOrganizationService = (dataToSend) => {
    return axiosInstance.put('/Tracker/UpdateOrg',dataToSend);
}

export const UpdateUserOrganizationService = (payload) => {
    return axiosInstance.post('/Tracker/UpdateUserOrganization',payload);
}

export const CreateUserService = (payload) => {
    return axiosInstance.post('/Auth/Registration',payload); 
}

export const UpdateUserService = (payload) => {
    return axiosInstance.put('/Auth/UpdateUser',payload);
}

export const GetUserService = (userId) => {
    return axiosInstance.get(`/Auth/GetUserProfile/${userId}`);
}

export const GetUsersListService = (orgId) => {
    return axiosInstance.get(`/Auth/GetUsers?OrgId=${orgId}`);
}