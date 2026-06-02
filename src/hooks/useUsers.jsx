import { useContext, useState } from "react";
import { CreateOrganizationService, CreateUserService, GetOrganizationService, GetUserService, GetUsersListService, UpdateOrganizationService, UpdateUserOrganizationService, UpdateUserService } from "../services/userService";
import { LoaderContext } from "../context/LoaderProvider";

const useUsers = () => {
    
    const context = useContext(LoaderContext);
    
    if(!context){
        throw new Error('Loader Context Error');
    }
        
    const { setLoading } = context;

    const [error,setError] = useState(null);

    const createUser = async (payload) => {
        try{
            setLoading(true);
            setError(null);
            // call api to create user
            const response = await CreateUserService(payload);
            return response.data;
        }
        catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Failed to create user");
        }
        finally{
            setLoading(false);
        }
    }

    const updateUser = async (payload) => {
        try{
            setLoading(true);
            setError(null);
            // call api to update user
            const response = await UpdateUserService(payload);
            return response.data;
        }
        catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Failed to update user");
        }
        finally{
            setLoading(false);
        }
    }


    const getUserProfile = async (userId) => {
        try{
            setLoading(true);
            setError(null);
            const response = await GetUserService(userId);
            return response.data;
        }
        catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch user profile");
            return null;
        }
        finally{
            setLoading(false);
        }
    }

    const getUsersListByOrgId = async (orgId) => {
        try{
            setLoading(true);
            setError(null);
            const response = await GetUsersListService(orgId);
            return response.data;
        }
        catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch users list");
            return null;
        }
        finally{
            setLoading(false);
        }
    }


    const getOrganization = async (orgId) => {
        try{
            setLoading(true);
            setError(null);
            const response = await GetOrganizationService(orgId);
            return response.data;
        }   
        catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch organization");
            return null;
        }
        finally{
            setLoading(false);
        } 
    }


    const createOrganization = async (payload) => {
        try{
            setLoading(true);
            setError(null);
            // call api to create organization
            const response = await CreateOrganizationService(payload);
            return response.data;

        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Failed to create organization");
        }   
        finally{
            setLoading(false);
        }
    }

    const updateOrganization = async (payload) => {
        try{
            setLoading(true);
            setError(null);
            // call api to create organization
            const response = await UpdateOrganizationService(payload);
            return response.data;
        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Failed to update organization");
        }   
        finally{
            setLoading(false);
        }
    }

    const updateUserOrg  = async (payload) => {
        try{
            setLoading(true);
            setError(null);
            // call api to create organization
            const response = await UpdateUserOrganizationService(payload);
            return response.data;
        }
        catch(err){ 
            console.error(err);
            setError(err.response?.data?.message || "Failed to update user's organization");
        }
        finally{
            setLoading(false);
        }
    }


    return {createUser, updateUser, getUserProfile, getUsersListByOrgId, getOrganization, createOrganization, updateOrganization,updateUserOrg, error};
}

export default useUsers;

// use this hook in form - 1. create user component , 2 get users component
// refer useTask.jsx Hook code  

