import { useContext, useState } from "react";
import { LoaderContext } from "../context/LoaderProvider";
import { GetDeveloperOrgTaskLstService } from "../services/userService";
import { CreateTaskCommentService, CreateTaskHistoryService, GetTaskByIdService, GetTaskCommentsByTaskIdService, GetTaskStatusHistoryService, SaveProgressService, SaveTestCasesService,GetTestCasesByTaskIdService } from "../services/taskService";

/**
 * @typedef {Object} TaskHistoryPayload
 * @property {number} taskId
 * @property {string} previousStatus
 * @property {string} newStatus
 * @property {string} remarks
 * @property {number} changedBy
 */

/**
 * Guards task history payload to avoid sending bad data to API.
 * @param {TaskHistoryPayload} payload
 */
const validateTaskHistoryPayload = (payload) => {
    if (!payload || typeof payload !== "object") {
        return "Payload is required";
    }

    const { taskId, previousStatus, newStatus, remarks, changedBy } = payload;

    if (!Number.isInteger(taskId) || taskId <= 0) return "taskId must be a positive integer";
    if (typeof previousStatus !== "string" || !previousStatus.trim()) return "previousStatus is required";
    if (typeof newStatus !== "string" || !newStatus.trim()) return "newStatus is required";
    if (typeof remarks !== "string") return "remarks must be a string";
    if (!Number.isInteger(changedBy) || changedBy <= 0) return "changedBy must be a positive integer";

    return null;
}

const validateTaskCommentPayload = (payload) => {
    if (!payload || typeof payload !== "object") {
        return "Payload is required";
    }

    const { taskId, comment, createdBy } = payload;

    if (!Number.isInteger(taskId) || taskId <= 0) return "taskId must be a positive integer";
    if (typeof comment !== "string" || !comment.trim()) return "comment is required";
    if (!Number.isInteger(createdBy) || createdBy <= 0) return "createdBy must be a positive integer";

    return null;
}

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

    const TestCasesSaveUpdateService = async (payload) => {
        try{
            setLoading(true);
            setError(null);
            const response = await SaveTestCasesService(payload);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to save test cases");
            return null;
        }
        finally{
            setLoading(false);
        }
    }
    
    const GetTestCasesByTaskId = async (taskId) => {
        try{
            setLoading(true);
            setError(null);
            const response = await GetTestCasesByTaskIdService(taskId);
            return response.data;
        }
        catch(err){
            setError(err.response.data.message || "Failed to fetch test cases");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const GetTaskStatusHistoryByTaskId = async (taskId) => {
        try{
            setLoading(true);
            setError(null);
            const response = await GetTaskStatusHistoryService(taskId);
            return response.data;
        }
        catch(err){
            setError(err.response?.data?.message || "Failed to fetch task status history");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const GetTaskCommentsByTaskId = async (taskId) => {
        try{
            setLoading(true);
            setError(null);
            const response = await GetTaskCommentsByTaskIdService(taskId);
            return response.data;
        }
        catch(err){
            setError(err.response?.data?.message || "Failed to fetch task comments");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const CreateTaskComment = async (payload) => {
        try{
            const validationError = validateTaskCommentPayload(payload);
            if (validationError) {
                setError(validationError);
                return null;
            }

            setLoading(true);
            setError(null);
            const response = await CreateTaskCommentService(payload);
            return response.data;
        }
        catch(err){
            setError(err.response?.data?.message || "Failed to create task comment");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    /**
     * @param {TaskHistoryPayload} payload
     */
    const CreateTaskHistory = async (payload) => {
        try{
            const validationError = validateTaskHistoryPayload(payload);
            if (validationError) {
                setError(validationError);
                return null;
            }

            setLoading(true);
            setError(null);
            const response = await CreateTaskHistoryService(payload);
            return response.data;
        }
        catch(err){
            setError(err.response?.data?.message || "Failed to create task history");
            return null;
        }
        finally{
            setLoading(false);
        }
    }
    
    return { GetOrgDevTasksLst, GetTaskDetails, TaskSaveProgressService, TestCasesSaveUpdateService, GetTestCasesByTaskId, GetTaskStatusHistoryByTaskId, GetTaskCommentsByTaskId, CreateTaskHistory, CreateTaskComment, error };
    
}

export default useDeveloper;