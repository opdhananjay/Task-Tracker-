import React, { useEffect } from "react";
import { ORG_TYPES } from "../../Enums/appEnums";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import useUsers from "../../hooks/useUsers";

const OrganizationProfileComp = () => {



    useEffect(() => {
        
        const user = getUserFromToken();
        
        if(!user){
            navigate("/login")
        }

        const orgId = user?.organizationId;

        if(!orgId){
            toast.error("User does not belong to any organization");
            return;
        }

        const fetchOrganization = async () => {
            const orgData = await getOrganization(orgId);
            if(orgData?.success && orgData?.data){
                const { organizationName, email, phoneNumber, organizationType, address } = orgData.data[0];
                // Pre-fill form fields
                reset({
                    organizationName: organizationName,
                    email,
                    phoneNumber,
                    organizationType,
                    address
                });
            }
        }

        fetchOrganization();
        
    },[])

    const  { getOrganization , createOrganization, updateOrganization, updateUserOrg, error } = useUsers();

    const { getUserFromToken , removeToken } = useAuth();

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        
        console.log('Form Data:', data);
        
        const user = getUserFromToken();

        if(user.organizationId){

            const payload = {
                ...data,
                id: user.organizationId
            }
           
            const res = await updateOrganization(payload);

            if(res?.success){
                toast.success(res.message || "Organization updated successfully");
            }
            else{
                toast.error(res.message || "Failed to update organization");
            }   

        }
        else{
            
            const payload = {
                ...data,
                createdBy: user.userId
            }

            const res = await createOrganization(payload);

            if(res?.success){
                debugger;
                toast.success(res.message || "Organization created successfully");
                
                // Update user's organizationId after creating organization
                const updateOrgPayload = {
                    userId: user.userId.toString(),
                    organizationId: res.data.id.toString()
                };

                const updateOrgRes = await updateUserOrg(updateOrgPayload);

                if(updateOrgRes?.success){
                    toast.success(updateOrgRes.message || "User's organization updated successfully");
                    // Optionally, you can also update the token or user context here to reflect the new organization   
                    toast.success('Kindly re-login to access organization features');
                    
                    setTimeout(() => {
                       removeToken(); // Clear token to force re-login and refresh user context with new organization data
                       navigate('/');   
                    }, 3000);              
                }
                else{
                    toast.error(updateOrgRes.message || "Failed to update user's organization");
                }

            }
            else{
                toast.error(res.message || "Failed to create organization");
            }

        }


    }

    return (
        <div className="bg-gray-100 min-h-screen p-2">

            <div className="bg-gray-600 p-4 rounded-xl shadow-md mb-2">
                <h2 className="font-semibold text-white">Organization</h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"> 
                                <label className="md:w-20 text-sm font-medium text-gray-700">Org. Name</label>
                                <div className="flex flex-1 flex-col">
                                    <input {...register('organizationName',{
                                        required:"Organization name is required",
                                        minLength:{value:3,message:'Organization name should be atleast 3 characters',
                                        maxLength:{value:50,message:'Organization name should be less than 50 characters'}
                                        }
                                    })}  type="text" name="organizationName" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 outline-none"/>
                                    {errors.organizationName && <p className="text-red-500 text-sm mt-1">{errors.organizationName.message}</p>}
                                </div>
                                
                            </div>


                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">

                            <label className="md:w-20 text-sm font-medium text-gray-700">Org. email</label>
                            
                            <div {...register('email',{
                                required:"Email is required",
                                pattern:{
                                    value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message:"Invalid email address"
                                }
                            })} className="flex flex-1 flex-col">
                                <input type="email" name="email" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 outline-none" />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}   
                            </div>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Phone Number */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <label className="md:w-20 text-sm font-medium text-gray-700">Phone</label>
                            <div className="flex flex-1 flex-col">
                                <input {...register('phoneNumber',{
                                    required:'Phone number is required',
                                    pattern:{
                                        value:/^\+?[1-9]\d{1,14}$/,
                                        message:'Invalid phone number'
                                    }
                                })} type="tel" name="phoneNumber" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 outline-none" />
                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">

                            <label className="md:w-20 text-sm font-medium text-gray-700">Org. Type</label>
                            <div className="flex flex-1 flex-col">
                                <select {...register('organizationType',{
                                    required:"Organization type is required"
                                })} className="px-3 py-2 rounded-md border border-gray-300 ">

                                    <option value="">Select Type</option>

                                    {
                                        Object.values(ORG_TYPES).map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))
                                    }
                                </select>   

                                {errors.organizationType && <p className="text-red-500 text-sm mt-1">{errors.organizationType.message}</p>}
                            </div>
                        </div>

                    </div>

                    <div className="grid grid-cols-1">
                        
                        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">

                            <label className="md:w-20 text-sm font-medium text-gray-700">
                                Address
                            </label>

                            <div className="flex flex-1 flex-col">
                                <textarea {...register('address',{
                                    required:"Address is required",
                                    minLength:{value:10,message:'Address should be atleast 10 characters'},
                                    maxLength:{value:200,message:'Address should be less than 200 characters'}
                                })} name="address" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-2 outline-none max-h-64" >
                                </textarea>
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                            </div>

                        </div>

                    </div>

                    <div className="flex justify-end mt-5 gap-2">

                            <button className="bg-gray-700 rounded-md px-4 py-2 text-white text-md cursor-pointer" >
                                {getUserFromToken().organizationId ? 'Update Organization':'Create Organization'} 
                            </button>

                            {
                                getUserFromToken().organizationId && (
                                    <button type="button" className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigate("/users/create")}>
                                        Create Users
                                    </button>
                                )
                            }

                    </div>

                </form>

            </div>


        </div>
    );
}

export default OrganizationProfileComp;