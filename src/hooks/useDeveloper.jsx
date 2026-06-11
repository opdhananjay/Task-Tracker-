import { useContext, useState } from "react";
import { LoaderContext } from "../context/LoaderProvider";
import { GetDeveloperOrgTaskLstService } from "../services/userService";
import { GetTaskByIdService, SaveProgressService } from "../services/taskService";

const useDeveloper = () => {

    
    const context = useContext(LoaderContext);
    
    if(!context){
        throw new Error('Loader Context Error');
    }

    const { setLoading } = context;
    const [error,setError] = useState(null);

    const GetOrgDevTasksLst = async (payload) => {
        try{
            setLoading(true);
            setError(null);
            const response = await GetDeveloperOrgTaskLstService(payload);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to fetch tasks");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const GetTaskDetails = async (taskId) => {
        try{
            setLoading(true);
            setError(null);
            const response = await GetTaskByIdService(taskId);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to fetch task details");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const TaskSaveProgressService = async (payload) => {
        try{
            setLoading(true);
            setError(null);
            const response = await SaveProgressService(payload);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to save task progress");
            return null;
        }
        finally{
            setLoading(false);
        }
    }
 

    return { GetOrgDevTasksLst, GetTaskDetails, TaskSaveProgressService, error };
    
}

export default useDeveloper;