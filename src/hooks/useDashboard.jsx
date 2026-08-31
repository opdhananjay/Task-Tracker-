import { useContext, useState } from "react";
import { LoaderContext } from "../context/LoaderProvider";
import { GetDeveloperDashboardService, GetManagerDashboardService, GetTeamLeaderDashboardService, GetTesterDashboardService } from "../services/dashboardService";


const useDashboard = () => {

    const context = useContext(LoaderContext);

    if(!context){
        throw new Error('Loader Context Errro');
    }
    
    const {setLoading} = context;
    const [error,setError] = useState(null);

    const GetDeveloperDashboard = async (payload) => {
        try{
            setError(null);
            setLoading(true);
            const response = await GetDeveloperDashboardService(payload);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to fetch");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const GetTesterDashboard = async (payload) => {
        try{
            setError(null);
            setLoading(true);
            const response = await GetTesterDashboardService(payload);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to fetch");
            return null;
        }
        finally{
            setLoading(false);
        }
    }


    const GetTeamLeaderDashboard = async (payload) => {
        try{
            setError(null);
            setLoading(true);
            const response = await GetTeamLeaderDashboardService(payload);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to fetch");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const GetManagerDashboard = async (payload) => {
        try{
            setError(null);
            setLoading(true);
            const response = await GetManagerDashboardService(payload);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to fetch");
            return null;
        }
        finally{
            setLoading(false);
        }
    }


    return {
        GetDeveloperDashboard,
        GetTesterDashboard,
        GetTeamLeaderDashboard,
        GetManagerDashboard,
        error
    }
    
}

export default useDashboard;
