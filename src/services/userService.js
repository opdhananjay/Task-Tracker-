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