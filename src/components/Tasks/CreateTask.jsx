import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { TASK_PRIORITY, TASK_STATUS, TASK_TYPE } from "../../Enums/appEnums";
import useAuth from "../../hooks/useAuth";
import useTask from "../../hooks/useTask";
import useMaster from "../../hooks/useMaster";
import { formatDateTime } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const CreateTask = ({ taskId, action }) => {

    console.log("Received Props:", { taskId, action });

    // const [developers, setDevelopers] = useState([]);
    // const [testers, setTesters] = useState([]);

    const { register,control, handleSubmit, formState:{errors,isValid}, reset} = useForm();

    const { createTaks, updateTaks, getTaskById, error: taskError } = useTask();

    const { getUserFromToken } = useAuth();

    const { fetchDevelopersAndTestersAndOrg, developers, testers, error: masterError } = useMaster();

    const navigate = useNavigate();

    useEffect(() => {

        if(!taskId){
            console.log("Edit/View mode for taskId:", taskId, "with action:", action);
            reset({
                title: '',
                description: '',
                taskType: '',
                assignedTo: '',
                testerId: '',
                startDateTime: null,
                dueDateTime: null,
                priority: '',
                status: '',
                unitTestingStatus: '',
                acceptanceCriteria: ''
            }); // Clear form for create mode
            return;
        }

        const fetchUsers = async () => {
            
            const orgId = getUserFromToken()?.organizationId;

            await fetchDevelopersAndTestersAndOrg(orgId);

            if (taskId) {

                const response = await getTaskById(taskId);

                if (response?.success && response?.data) {

                    const data = response.data[0];

                    const taksData = {
                        ...data,
                        assignedTo:data.developerId
                    }

                    reset(taksData);
                }
            }
        };

        fetchUsers();

    }, [taskId,action]);

    const getDateValue = (val) => {
        // If it's a custom picker object with .toDate(), use it
        if (val && typeof val.toDate === "function") {
            return val.toDate().toISOString();
        }
        // If it's a JS Date object, use it directly
        if (val instanceof Date) {
            return val.toISOString();
        }
        // If it's already a string, return as is (or handle as needed)
        return val || null;
    };

    const onSubmit = async (data) => {

        console.log("Form Data:", data);

        const getUserFromTokenData = getUserFromToken();

        const payload = {

            id: taskId ? Number(taskId) : null, // for update only

            title: data.title,

            description: data.description,

            taskType: data.taskType,

            developerId: Number(data.assignedTo), 
            // assignedTo → developerId

            testerId: data.testerId
                ? Number(data.testerId)
                : null,

            createdBy: Number(getUserFromTokenData.userId), 
            // logged in user id

            startDateTime: getDateValue(data.startDateTime),

            dueDateTime: getDateValue(data.dueDateTime),

            priority: data.priority,

            status: data.status,

            unitTestingStatus: data.unitTestingStatus, // field mapping

            acceptanceCriteria: data.acceptanceCriteria,

            OrganizationId:Number(getUserFromTokenData.organizationId)
            // from user context
        };

        console.log("Final Payload:", payload);

        if (taskId) {
            // update API
            
            const res = await updateTaks(payload);

            if(!res){
                toast.error(taskError || "Failed to update task");
                return;
            }

            if(res.success && res.statusCode === 200){
                
                toast.success(res.message || "Task updated successfully");

                navigate("/tasks/all");
            }
            else{
                toast.error(res.message || "Failed to update task");
            }

        }
        else {
            // create API

            const res = await createTaks(payload);

            if(!res){
                toast.error(taskError || "Failed to create task");
                return;
            }

            if(res.success && res.statusCode === 200){
                
                toast.success(res.message || "Task created successfully");

                reset();

                navigate("/tasks/all");
            }
            else{
                toast.error(res.message || "Failed to create task");
            }
        }
    };

    return (
        <>
            <div className="bg-gray-100 min-h-screen py-5 w-full p-4">

                <div className="bg-green-600 p-4 rounded-xl shadow mb-2">
                    <h2 className="font-semibold text-white">Create Task</h2>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"> 
                                <label className="md:w-20 text-sm font-medium text-gray-700">Title</label>
                                <div className="flex flex-1 flex-col">
                                    <input {...register('title',{
                                        required:'title is required',
                                        minLength:{value:3,message:'title must be at least 3 characters'},
                                        maxLength:{value:50,message:'title must be less than 50 character'}
                                    })} type="text" name="title" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 outline-none"/>
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                                </div>
                                
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                    Task Type
                                </label>

                                <div className="flex flex-1 flex-col">
                                    <select
                                    className="px-3 py-2 rounded-md border border-gray-300 bg-white
                                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                                                transition duration-150 ease-in-out shadow-sm"
                                    {...register('taskType', { required: 'Task type is required' })}
                                    >
                                    <option value="">
                                        Select Task Type
                                    </option>
                                    {
                                        Object.values(TASK_TYPE).map((type)=>(
                                            <option key={type} value={type}>{type}</option>
                                        ))
                                    }
                                    </select>

                                    {errors.taskType && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.taskType.message}
                                    </p>
                                    )}
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1">
                            
                            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">Description</label>
                                <div className="flex flex-1 flex-col">
                                    <textarea {...register('description')} name="description" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-2 outline-none max-h-64">
                                    </textarea>
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Developer */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"> 
                            <label className="md:w-20 text-sm font-medium text-gray-700">
                            Developer
                            </label>

                            <div className="flex flex-1 flex-col">
                            <select
                                {...register('assignedTo', { required: 'Developer is required' })}
                                className={`px-3 py-2 rounded-md border bg-white
                                ${errors.assignedTo ? 'border-red-500' : 'border-gray-300'}
                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                                transition duration-150 ease-in-out shadow-sm`}
                            >
                                <option value="">
                                Select Developer
                                </option>

                                {developers.map((dev) => (
                                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                                ))}
                            </select>

                            {errors.assignedTo && (
                                <p className="text-red-500 text-sm mt-1">
                                {errors.assignedTo.message}
                                </p>
                            )}
                            </div>
                        </div>

                        {/* Tester */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <label className="md:w-20 text-sm font-medium text-gray-700">
                            Tester
                            </label>

                            <div className="flex flex-1 flex-col">
                            <select
                                {...register('testerId')}
                                className="px-3 py-2 rounded-md border border-gray-300 bg-white
                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                                transition duration-150 ease-in-out shadow-sm"
                            >
                                <option value="">
                                Select Tester
                                </option>

                                {testers.map((tester) => (
                                    <option key={tester.id} value={tester.id}>{tester.name}</option>
                                ))}
                            </select>
                            </div>
                        </div>

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"> 
                                <label className="md:w-20 text-sm font-medium text-gray-700">Start</label>
                                <div className="flex flex-1 flex-col">
                                    <Controller 
                                        name="startDateTime"
                                        control={control}
                                        rules={{required:'Start date time is required'}}
                                        render={({field}) => (
                                            <DatePicker
                                                plugins={[<TimePicker position="bottom" />]}
                                                value={field.value}
                                                onChange={(date)=>field.onChange(date)}
                                                format="DD/MM/YYYY hh:mm A"
                                                className="w-full"
                                                inputClass="w-full px-3 py-2 border rounded-md"
                                                editable={false}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"> 
                                <label className="md:w-20 text-sm font-medium text-gray-700">Due</label>
                                <div className="flex flex-1 flex-col">
                                    <Controller 
                                        name="dueDateTime"
                                        control={control}
                                        rules={{required:'Due date time is required'}}
                                        render={({field}) => (
                                            <DatePicker
                                                plugins={[<TimePicker position="bottom" />]}
                                                value={field.value}
                                                onChange={(date)=>field.onChange(date)}
                                                format="DD/MM/YYYY hh:mm A"
                                                className="w-full"
                                                inputClass="w-full px-3 py-2 border rounded-md"
                                                editable={false}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"> 

                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                    Priority
                                </label>

                                <div className="flex flex-1 items-center gap-6">

                                    {
                                        Object.values(TASK_PRIORITY).map((priority) => (
                                            <label key={priority} className="flex items-center gap-2 cursor-pointer leading-none">
                                                <input
                                                    type="radio"
                                                    value={priority}
                                                    {...register("priority", { required: "Priority is required" })}
                                                    className="mt-[1px] text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-700">{priority}</span>
                                            </label>
                                        ))
                                    }

                                    {errors.priority && (
                                        <p className="text-red-500 text-sm ml-8 mt-1">
                                            {errors.priority.message}
                                        </p>
                                    )}
                                    
                                </div>

                            </div>


                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                    Status
                                </label>

                                <div className="flex flex-1 flex-col">
                                    <select
                                    {...register('status', { required: 'Status is required' })}
                                    className={`px-3 py-2 rounded-md border bg-white
                                        ${errors.status ? 'border-red-500' : 'border-gray-300'}
                                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                                        transition duration-150 ease-in-out shadow-sm`}
                                    >
                                    <option value="" disabled>
                                        Select Status
                                    </option>

                                    {
                                        Object.values(TASK_STATUS).map((status)=>(
                                            <option key={status} value={status}>
                                                {status.replaceAll("_"," ")}
                                            </option>
                                        ))
                                    }


                                    {/* <option value="NOT_STARTED">Not Started</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DEV_DONE">Dev Done</option>
                                    <option value="TESTING">Testing</option>
                                    <option value="COMPLETED">Completed</option> */}
                                    </select>

                                    {errors.status && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.status.message}
                                    </p>
                                    )}
                                </div>
                            </div>

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"> 
                                
                                <label className="md:w-20 text-sm font-medium text-gray-700">
                                    Unit Testing
                                </label>

                                <div className="flex flex-1 items-center gap-6">
                                    
                                    {/* Yes */}
                                    <label className="flex items-center cursor-pointer gap-2 leading-none">
                                        <input type="radio" className="mt-[1px] text-green-600 focus:ring-green-500"
                                        {...register('unitTestingStatus')}
                                        value="YES"
                                        />
                                        <span className="text-sm text-gray-700">Yes</span>
                                    </label>

                                    {/* No */}
                                    <label className="flex items-center cursor-pointer gap-2 leading-none">
                                        <input type="radio" className="mt-[1px] text-green-600 focus:ring-green-500"
                                        {...register('unitTestingStatus')}
                                        value="NO"
                                        />
                                        <span className="text-sm text-gray-700">No</span>
                                    </label>
                                    
                                </div>

                            </div>

                            
                            
                                
                        </div>

                        <div className="grid grid-cols-1">
                            
                            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                                <label className="md:w-20 text-sm font-medium text-gray-700">Acceptance Criteria</label>
                                <div className="flex flex-1 flex-col">
                                    <textarea {...register('acceptanceCriteria')} name="acceptanceCriteria" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-2 outline-none max-h-screen">
                                    </textarea>
                                </div>
                            </div>

                        </div>


                        <div className="flex justify-end mt-5">
                            <button className="bg-gray-700 rounded-md px-4 py-2 text-white text-md cursor-pointer" >
                                {(taskId && action == 'view') ? "Update Task" : (taskId && action == 'close') ? "Close Task" : "Create Task"}
                            </button>
                        </div>

                                        
                    </form>

                    
                </div>

            </div>
        </>
    )
}

export default CreateTask;