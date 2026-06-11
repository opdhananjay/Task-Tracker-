import { ArrowLeft, BadgeCheckIcon, CalendarClock, Code, Edit, EllipsisVertical, FolderDot, Info, Logs, MessageCircle, Play, ShieldAlert, ShieldCheck, SkipBack, TestTube, User } from "lucide-react";
import { useParams } from "react-router-dom";
import Modal from "../shared/Modal";
import { useEffect, useState } from "react";
import TestCases from "./TestCases";
import { TASK_STATUS } from "../../Enums/appEnums";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import ConfirmationModal from "../shared/ConfirmationModal";
import useDeveloper from "../../hooks/useDeveloper";
import toast from "react-hot-toast";
import { formatDateTime } from "../../utils/dateUtils";
import useMaster from "../../hooks/useMaster";

const TaskDetails = () => {

    const { organizationId, action, taskId } = useParams();

    const { GetTaskDetails,TaskSaveProgressService, error } = useDeveloper();

    const { fetchDevelopersAndTestersAndOrg,developerMap,testerMap,organizationMap,userMap } = useMaster();

    console.log("TaskDetails Route Params:", { organizationId, action, taskId });

    const [openTestCases,setOpenTestCases] = useState(false);

    const [overAllTaskStatus, setOverAllTaskStatus] = useState(TASK_STATUS["TESTING_FAILED"]);

    const { register, control, handleSubmit, getValues, reset } = useForm();

    const [startTaskConfirm, setStartTaskConfirm] = useState(false);

    const [markReadyConfirm, setMarkReadyConfirm] = useState(false);


    const [taskDetails, setTaskDetails] = useState(null);

    const [comments, setComments] = useState([]);

    const [testCases, setTestCases] = useState([]);

    const [statusHistory, setStatusHistory] = useState([]);

    useEffect(() => {
        
        if(taskId){
            // Fetch task details using taskId
            console.log("Fetch details for taskId:", taskId);

            

            

            const fetchTaskDetails = async () => {
                const response = await GetTaskDetails(taskId);
                if(response?.success && response?.data){
                    console.log("Task details fetched successfully:", response.data);
                    const task = response.data[0];
                    setTaskDetails(task);
                    setOverAllTaskStatus(TASK_STATUS[task.status] || '-');
                    reset({
                        DevNote: task.devNote || '',
                        DevStartDateTime: task.devStartDateTime ? new Date(task.devStartDateTime) : null,
                        DevEndDateTime: task.devEndDateTime ? new Date(task.devEndDateTime) : null,
                        devUnitTestingNote: task.devUnitTestingNote || ''
                    });
                }
                else{
                    toast.error(response?.message || "Failed to fetch task details");
                }
            }

            fetchDevelopersAndTestersAndOrg(organizationId); 
            fetchTaskDetails();
        }
        
    },[taskId])

    const handleTestCasesBtn = () => {
        setOpenTestCases(true);
    }

    const handleStartTaskConfirm = () => {
        console.log("Task started");
        setStartTaskConfirm(false);
    };

    const handleMarkReadyConfirm = () => {
        console.log("Task marked as ready for testing");
        setMarkReadyConfirm(false);
    };

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

    const handleSaveProgress = async (formData) => {
        // formData will be provided by react-hook-form's handleSubmit
        // fallback to getValues() if needed
        const values = formData || getValues();

        if(!taskId || Number.isNaN(Number(taskId))){
            toast.error("No task found. Cannot save progress.");
            return;
        }
        
        const dataToSend = {
            taskId: Number(taskId),
            devNote:values.DevNote,
            devUnitTestingNotes:values.devUnitTestingNote,
            devStartDateTime: getDateValue(values.DevStartDateTime),
            devEndDateTime: getDateValue(values.DevEndDateTime)
        }
        
        console.log('save progress', dataToSend);
        // TODO: call API to persist development progress
        
        var response = await TaskSaveProgressService(dataToSend);

        if(!response){
            toast.error(error || "Failed to save progress");
            return;
        }

        if(response?.success && response.statusCode === 200){
            toast.success(response.message || "Progress saved successfully");
        }
        else{
            toast.error(response?.message || "Failed to save progress");
        }
    }

    return (
        <>

        <Modal
            isOpen={openTestCases}
            onClose={() => setOpenTestCases(false)}
            title={`Test Cases for Task - ${taskId}`}
            width="max-w-4xl"
            >
            <TestCases />
        </Modal>
       
        <ConfirmationModal
            isOpen={startTaskConfirm}
            title="Start Task?"
            description="Are you sure you want to start this task? You can update the status and add development notes."
            confirmText="Yes, Start Task"
            cancelText="No, Cancel"
            onConfirm={handleStartTaskConfirm}
            onCancel={() => setStartTaskConfirm(false)}
        />

        <ConfirmationModal
            isOpen={markReadyConfirm}
            title="Confirm Action"
            description="Are you sure you want to mark this task as Ready for Testing? This action cannot be undone."
            confirmText="Yes, Mark as Ready"
            cancelText="No, Keep in Progress"
            onConfirm={handleMarkReadyConfirm}
            onCancel={() => setMarkReadyConfirm(false)}
        />

        <div className="w-full px-4 bg-gray-50">

           <div className="flex flex-col sm:flex-row sm:justify-between gap-3 p-4">
                <div className="flex items-center gap-2 cursor-pointer text-blue-600 font-bold text-sm">
                    <ArrowLeft size={16} />
                    <span>Back to My Tasks</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-1 items-center justify-center bg-gray-200 text-gray-700 text-sm rounded-sm px-3 py-2 gap-1">
                    <MessageCircle size={16} />
                    <span>Add Comment</span>
                    </div>

                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-sm">
                    <EllipsisVertical size={16} />
                    </div>
                </div>
           </div>

          <div className="flex flex-col justify-center gap-2 p-4 bg-white rounded-sm shadow-sm">
                <div>
                    <span className="text-sm font-bold flex items-center gap-1 bg-blue-100 text-blue-600 rounded-sm px-2 py-1 w-fit">
                    Task - {taskId}
                    </span>
                </div>

                <div className="flex justify-between items-center gap-2">

                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{taskDetails?.title || "Task Title"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setStartTaskConfirm(true)} className="flex items-center gap-1 bg-white-600  text-sm rounded-sm px-3 py-2 border border-gray-300 hover:bg-gray-100">
                            <Play size={16} />  Start Task
                        </button>

                        <button type="button" className="flex items-center gap-1 bg-orange-600  text-sm text-white rounded-sm px-3 py-2 border border-gray-300 hover:bg-white-100 ml-2">
                            <Edit size={16} />  Update Status
                        </button>
                    </div>
                    
                </div>

                <div className="flex justify-start items-center gap-2">

                    <div className="">
                        <span className="text-sm text-gray-500 bg-gray-100 text-red-600 rounded-sm px-2 py-1 w-fit font-semibold">
                            {taskDetails?.priority || '-'}
                        </span>
                    </div>
                    
                    <div className="">
                        <span className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 text-gray-600 rounded-sm px-2 py-1 w-fit font-semibold"> <CalendarClock size={16} />  Due : {formatDateTime(taskDetails?.dueDateTime) || '-'}</span>
                    </div>


                    <div className={``}>
                        <span className={`flex items-center gap-2 text-sm text-gray-500 text-gray-600 rounded-sm px-2 py-1 w-fit font-semibold ${overAllTaskStatus.color}`}> Status : {overAllTaskStatus.label} </span>
                    </div>

                </div>
           </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 rounded-sm shadow-sm mt-4 h-auto">

                <div className="bg-white rounded-sm shadow-sm p-4">

                    <div className="flex flex-col gap-2 text-sm mb-2">
                        <h4 className="font-bold">Task Description</h4>
                        <p className="text-sm text-gray-600 mt-2">
                        {taskDetails?.description || "-"}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                        <h4 className="font-bold ">Acceptance Criteria</h4>
                        <p className="text-sm text-gray-600 mt-2">
                        {taskDetails?.acceptanceCriteria || "-"}
                        </p>
                    </div>

                </div>

                <div className="bg-white rounded-sm shadow-sm p-4">
                    
                     <div className="flex flex-col gap-2 text-sm mb-2">
                        
                        <h4 className="font-bold ">Task Information</h4>
                        
                        <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <FolderDot size={16} />
                                <span>Project</span>
                            </div>
                            <div>
                                User Management
                            </div>
                        </div>

                        <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>Created By</span>
                            </div>
                            <div>
                                {userMap[taskDetails?.createdBy] || '-'}
                            </div>
                        </div>

                        <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <CalendarClock size={16} />
                                <span>Created on</span>
                            </div>
                            <div>
                                {formatDateTime(taskDetails?.createdAt) || '-'}
                            </div>
                        </div>

                        <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Code size={16} />
                                <span>Developer</span>
                            </div>
                            <div>
                                {developerMap[taskDetails?.developerId] || '-'} (you)
                            </div>
                        </div>


                        <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <TestTube size={16} />
                                <span>Tester</span>
                            </div>
                            <div>
                               {testerMap[taskDetails?.testerId] || '-'}
                            </div>
                        </div>

                         <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <ShieldAlert size={16} />
                                <span>Priority</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500 bg-gray-100 text-red-600 rounded-sm px-2 py-1 w-fit font-semibold">
                                    {taskDetails?.priority || '-'}
                                </span>
                            </div>
                        </div>

                         <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Logs size={16} />
                                <span>Task Type</span>
                            </div>
                            <div>
                                {taskDetails?.taskType || '-'}
                            </div>
                        </div>

                     </div>

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 rounded-sm mt-4">

                <div className="bg-white rounded-sm p-4">
                    
                    <div className="">
                        <h4 className="font-bold mb-2">Development Details</h4>
                    </div>

                    <div className="flex flex-col gap-2 text-sm mb-2">

                        <div className="flex flex-col gap-2 text-sm">
                            <h5 className="flex items-center gap-2 ">Development Notes <Info size={16} /></h5>
                            <textarea name="DevNote"
                            {...register("DevNote")}
                            className="w-full h-32 resize-none p-2 border border-gray-300 rounded-sm text-sm"
                            placeholder="Add development notes here..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-sm mt-4 mb-2">
                            
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-sm">
                                    Started At
                                </label>

                                <div className="relative w-full">
                                    <Controller 
                                        name="DevStartDateTime"
                                        control={control}
                                        render={
                                            ({field}) => (
                                                <DatePicker
                                                    plugins={[<TimePicker position="bottom" />]}
                                                    value={field.value}
                                                    onChange={(date) => field.onChange(date)}
                                                    format="DD/MM/YYYY hh:mm A"
                                                    className="w-full"
                                                    inputClass="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-sm text-sm"
                                                    editable={false}
                                                />
                                            )
                                        }
                                    />

                                    {/* <CalendarClock
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    /> */}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-sm">
                                    Ended At
                                </label>

                                <div className="relative w-full">
                                    <Controller 
                                        name="DevEndDateTime"
                                        control={control}
                                        defaultValue={taskDetails?.devEndDateTime ? new Date(taskDetails.devEndDateTime) : null}
                                        render={
                                            ({field}) => (
                                                <DatePicker
                                                    plugins={[<TimePicker position="bottom" />]}
                                                    value={field.value}
                                                    onChange={(date) => field.onChange(date)}
                                                    format="DD/MM/YYYY hh:mm A"
                                                    className="w-full"
                                                    inputClass="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-sm text-sm"
                                                    editable={false}
                                                />
                                            )
                                        }
                                    />

                                    {/* <CalendarClock
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    /> */}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-sm">
                                    Time Spent
                                </label>
                                <input type="text" className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm" placeholder="Duration" />
                            </div>

                        </div>


                        <div className="flex flex-col gap-2 text-sm">
                            <h5 className="flex items-center gap-2 ">Unit Testing Notes <Info size={16} /></h5>
                            <textarea name="devUnitTestingNote"
                            {...register("devUnitTestingNote")}
                            className="w-full h-32 resize-none p-2 border border-gray-300 rounded-sm text-sm"
                            placeholder="Add development notes here..."
                            ></textarea>
                        </div>


                    </div>

                </div>

                <div className="bg-white rounded-sm shadow-sm p-3 h-64 overflow-y-auto">
                    <h4 className="font-semibold text-sm mb-2">
                        Testing Status Updates
                    </h4>

                    <div className="flex justify-between gap-2 text-xs border p-2 rounded-sm mb-2">
                        <div>
                        <h2 className="font-semibold text-xs">
                            Not Started
                        </h2>
                        <span className="text-gray-600 text-wrap">
                            Login API Started Remarks
                        </span>
                        </div>

                        <span className="text-[10px] text-red-600 bg-gray-100 rounded px-1.5 py-0.5 h-fit font-medium whitespace-nowrap">
                        10 May 2024, 10:30 AM
                        </span>
                    </div>


                    <div className="flex justify-between gap-2 text-xs border p-2 rounded-sm mb-2">
                        <div>
                        <h2 className="font-semibold text-xs">
                            Not Started
                        </h2>
                        <span className="text-gray-600 text-wrap">
                            Login API Started Remarks
                        </span>
                        </div>

                        <span className="text-[10px] text-red-600 bg-gray-100 rounded px-1.5 py-0.5 h-fit font-medium whitespace-nowrap">
                        10 May 2024, 10:30 AM
                        </span>
                    </div>

                    <div className="flex justify-between gap-2 text-xs border p-2 rounded-sm mb-2">
                        <div>
                        <h2 className="font-semibold text-xs">
                            Not Started
                        </h2>
                        <span className="text-gray-600 text-wrap">
                            Login API Started Remarks
                        </span>
                        </div>

                        <span className="text-[10px] text-red-600 bg-gray-100 rounded px-1.5 py-0.5 h-fit font-medium whitespace-nowrap">
                        10 May 2024, 10:30 AM
                        </span>
                    </div>

                    <div className="flex justify-between gap-2 text-xs border p-2 rounded-sm mb-2">
                        <div>
                        <h2 className="font-semibold text-xs">
                            Not Started
                        </h2>
                        <span className="text-gray-600 text-wrap">
                            Login API Started Remarks
                        </span>
                        </div>

                        <span className="text-[10px] text-red-600 bg-gray-100 rounded px-1.5 py-0.5 h-fit font-medium whitespace-nowrap">
                        10 May 2024, 10:30 AM
                        </span>
                    </div>


                </div>
        
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-sm shadow-sm mt-4 mb-2">

                <div className="bg-white rounded-sm shadow-sm p-4">
                    
                    <div className="flex gap-2 text-sm mb-2">

                        <button onClick={handleSubmit(handleSaveProgress)} type="button" className="flex items-center gap-1 bg-white-600 text-sm rounded-sm px-2.5 py-1.5 border border-gray-300 hover:bg-white-100 ml-2">
                            <Edit size={16} /> Save Progress
                        </button>


                        <button onClick={handleTestCasesBtn} type="button" className="flex items-center gap-1 bg-blue-600  text-sm text-white rounded-sm px-2.5 py-1.5 border border-blue-300 hover:bg-white-100 ml-2">
                            <ShieldCheck size={16} /> Test Cases
                        </button>

                    </div>

                </div>

                <div className="bg-white rounded-sm shadow-sm p-3 flex flex-wrap items-center justify-end gap-2">

                    <button
                        type="button"
                        onClick={() => setMarkReadyConfirm(true)}
                        className="inline-flex items-center gap-1.5 bg-blue-600 text-xs font-medium text-white rounded-sm px-2.5 py-1.5 border border-blue-700 hover:bg-blue-700 transition-colors"
                    >
                        <BadgeCheckIcon size={14} /> Dev Done
                    </button>

                    <button
                        type="button"
                        onClick={() => setMarkReadyConfirm(true)}
                        className="inline-flex items-center gap-1.5 bg-white text-xs font-medium text-gray-700 rounded-sm px-2.5 py-1.5 border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <SkipBack size={14} /> Reopen
                    </button>

                    <button
                        type="button"
                        onClick={() => setMarkReadyConfirm(true)}
                        className="inline-flex items-center gap-1.5 bg-green-600 text-xs font-medium text-white rounded-sm px-2.5 py-1.5 border border-green-700 hover:bg-green-700 transition-colors"
                    >
                        <ShieldCheck size={14} /> Mark Ready for Testing
                    </button>

                </div>

            </div>

        </div>
        </>
    )
}

export default TaskDetails;