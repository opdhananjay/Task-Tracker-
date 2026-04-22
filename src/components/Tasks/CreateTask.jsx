import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

const CreateTask = () => {

    useEffect(()=>{
        toast.success('Create your Task');
    },[]);

    const { register,control, handleSubmit, formState:{errors,isValid}, reset} = useForm();

    const onSubmit = (e) => {
        
    }

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
                                    <option value="BUG">Bug</option>
                                    <option value="FEATURE">Feature</option>
                                    <option value="IMPROVEMENT">Improvement</option>
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

                                <option value="1">Dhananjay</option>
                                <option value="2">Rahul</option>
                                <option value="3">Amit</option>
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

                                <option value="4">Neha</option>
                                <option value="5">Priya</option>
                                <option value="6">Karan</option>
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
                                                onChange={(date)=>field.onChange(date?.toDate())}
                                                format="YYYY-MM-DD HH:mm:ss"
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
                                                onChange={(date)=>field.onChange(date?.toDate())}
                                                format="YYYY-MM-DD HH:mm:ss"
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

                                    {/* Low */}
                                    <label className="flex items-center gap-2 cursor-pointer leading-none">
                                        <input
                                            type="radio"
                                            value="LOW"
                                            {...register("priority", { required: "Priority is required" })}
                                            className="mt-[1px] text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">Low</span>
                                    </label>

                                    {/* Medium */}
                                    <label className="flex items-center gap-2 cursor-pointer leading-none">
                                        <input
                                            type="radio"
                                            value="MEDIUM"
                                            {...register("priority")}
                                            className="mt-[1px] text-yellow-600 focus:ring-yellow-500"
                                        />
                                        <span className="text-sm text-gray-700">Medium</span>
                                    </label>

                                    {/* High */}
                                    <label className="flex items-center gap-2 cursor-pointer leading-none">
                                        <input
                                            type="radio"
                                            value="HIGH"
                                            {...register("priority")}
                                            className="mt-[1px] text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-sm text-gray-700">High</span>
                                    </label>

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

                                    <option value="NOT_STARTED">Not Started</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DEV_DONE">Dev Done</option>
                                    <option value="TESTING">Testing</option>
                                    <option value="COMPLETED">Completed</option>
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
                                        {...register('requiredUnitTesting')}
                                        value="YES"
                                        />
                                        <span className="text-sm text-gray-700">Yes</span>
                                    </label>

                                    {/* No */}
                                    <label className="flex items-center cursor-pointer gap-2 leading-none">
                                        <input type="radio" className="mt-[1px] text-green-600 focus:ring-green-500"
                                        {...register('requiredUnitTesting')}
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
                            <button className="bg-gray-700 rounded-md px-4 py-2 text-white text-md cursor-pointer" >Create Task</button>
                        </div>

                                        
                    </form>

                    
                </div>

            </div>
        </>
    )
}

export default CreateTask;