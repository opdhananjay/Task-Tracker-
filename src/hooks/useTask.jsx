import { useContext, useState } from "react";
import { LoaderContext } from "../context/LoaderProvider";
import { CreateTaskService, GetTaksService, GetTaskByIdService } from "../services/taskService";

const useTask = () => {

    const context = useContext(LoaderContext);

    if(!context){
        throw new Error('Loader Context Error');
    }
    
    const { setLoading } = context;

    const [error,setError] = useState(null);

    const createTaks = async (dataToSend) => {
        try{
            setLoading(true);
            setError(null);

            const response = await CreateTaskService(dataToSend);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to Create Task");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const updateTaks = async (dataToSend) => {
        try{
            setLoading(true);
            setError(null);

            const response = await CreateTaskService(dataToSend);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to Create Task");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const getTasks = async (organizationId) => {
        try{
            setLoading(true);
            setError(null);

            const response = await GetTaksService(organizationId);
            return response.data;

        }
        catch(err){
            setError(err.response.data.message || "Failed to Create Task");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const getTaskById = async (taskId) => {
        try{
            setLoading(true);
            setError(null);

            const response = await GetTaskByIdService(taskId);
            return response.data;

        }
        catch(err){
            setError(err.response.data.message || "Failed to Fetch Task");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    return { createTaks, updateTaks, getTasks, getTaskById, error };
}

export default useTask;