import { useContext, useState } from "react";
import { LoaderContext } from "../context/LoaderProvider";
import { CreateTaskService, GetTaksService } from "../services/taskService";

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

    const getTasks = async (dataToSend) => {
        try{
            setLoading(true);
            setError(null);

            const response = await GetTaksService(dataToSend);
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


    return { createTaks, getTasks, error };
}

export default useTask;