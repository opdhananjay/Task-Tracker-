import axiosInstance from "./api";

export const GetUserByRoleService = (payload) => {
    return axiosInstance.post(`/Auth/GetUsersByRole`, payload);
}

export const GetOrganizationService = (organizationId) => {
    return axiosInstance.get(`/Tracker/GetOrganization?orgId=${organizationId}`);
}