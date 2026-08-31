import { useForm } from "react-hook-form";
import useUsers from "../../hooks/useUsers";
import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/dateUtils";

const Profile = () => {

    const { register,handleSubmit,formState: { errors }, reset } = useForm();

    const { getUserProfile } = useUsers(); 

    const { getUserFromToken } = useAuth();

    useEffect(()=>{
        
        const fetchProfile = async () => {
            const user = getUserFromToken();
            const response = await getUserProfile(user.userId);
            if(response?.success && response?.data){
              reset({...response.data,createdAt:formatDate(response.data.createdAt),updatedAt:formatDate(response.data.updatedAt)});
            }
        }

        fetchProfile();

    },[])

    return (
        <div className="min-h-screen bg-gray-100">
            
            <div className="mt-2">

                <div className="bg-gray-400 p-4 rounded-xl shadow-md mb-2">
                    Profile 
                </div> 

                <div className="bg-white p-4 rounded-xl shadow-md">

                    <form className="space-y-4">

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">    

                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text" {...register('firstName',{})}
                                        name="firstName"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text" {...register('lastName',{})}
                                        name="lastName"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                   Email
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text" {...register('email',{})}
                                        name="email"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                   Role
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text" {...register('role',{})}
                                        name="role"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                   Department
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text"  {...register('department',{})}
                                        name="department"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                   Phone Number 
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text" {...register('phoneNumber',{})}
                                        name="phoneNumber"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
   
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                   Employee Id 
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text" {...register('employeeId',{})}
                                        name="employeeId"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                   Company Name
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text" {...register('companyName',{})}
                                        name="companyName"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                        </div>

                        
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
   
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                     Active
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text"  {...register('isActive',{})}
                                        name="isActive"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                   Organization Id
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text"  {...register('organizationId',{})}
                                        name="organizationId"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
   
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                    Created At
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text"  {...register('createdAt',{})}
                                        name="createdAt"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                    Updated At
                                </label>
                                <div className="flex flex-1 flex-col">
                                    <input type="text" {...register('updatedAt',{})}
                                        name="updatedAt"
                                        className="flex-1 border border-gray border-gray-300 rounded-md px-3 py-2 focus:ring-green-500" 
                                    />
                                </div>
                            </div>

                        </div>

                    </form>
                    

                </div>




            </div>


        </div>
    )
}

export default Profile;