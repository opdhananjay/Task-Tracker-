import axiosInstance from "./api"

export const GetDeveloperDashboardService = (payload) =>{
    return axiosInstance.post('/Dashboard/GetDeveloperDashboard',payload);
}

export const GetTesterDashboardService = (payload) => {
    return axiosInstance.post('/Dashboard/GetTesterDashboard',payload);
}

export const GetTeamLeaderDashboardService = (payload) => {
  return axiosInstance.post('/Dashboard/GetTeamLeaderDashboard',payload);  
};

export const GetManagerDashboardService = (payload) => {
  return axiosInstance.post('/Dashboard/GetManagerDashboard',payload);  
};