import { ArrowLeft, BadgeCheckIcon, CalendarClock, Code, Edit, EllipsisVertical, FolderDot, Info, Logs, MessageCircle, Play, ShieldAlert, ShieldCheck, SkipBack, TestTube, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import useAuth from "../../hooks/useAuth";

const TaskDetails = () => {

    const navigate = useNavigate();

    const { organizationId, action, taskId } = useParams();

    const { getUserFromToken }  = useAuth();

    const { GetTaskDetails,TaskSaveProgressService,GetTestCasesByTaskId,GetTaskStatusHistoryByTaskId,GetTaskCommentsByTaskId,TestCasesSaveUpdateService,CreateTaskHistory,CreateTaskComment,error } = useDeveloper();

    const { fetchDevelopersAndTestersAndOrg,developerMap,testerMap,organizationMap,userMap } = useMaster();

    console.log("TaskDetails Route Params:", { organizationId, action, taskId });

    const [openTestCases,setOpenTestCases] = useState(false);

    const [overAllTaskStatus, setOverAllTaskStatus] = useState(TASK_STATUS["TESTING_FAILED"]);

    const { register, control, handleSubmit, getValues, reset } = useForm();

    const [startTaskConfirm, setStartTaskConfirm] = useState(false);

    const [markReadyConfirm, setMarkReadyConfirm] = useState(false);

    const [openCommentsModal, setOpenCommentsModal] = useState(false);

    const [commentText, setCommentText] = useState("");


    const [taskDetails, setTaskDetails] = useState(null);

    const [comments, setComments] = useState([]);

    const [testCases, setTestCases] = useState([]);

    const [statusHistory, setStatusHistory] = useState([]);

    const getStatusMeta = (statusValue) => {
        return TASK_STATUS[statusValue] || {
            label: statusValue || "Unknown",
            color: "bg-gray-100 text-gray-700"
        };
    }

    const fetchTaskDetails = async () => {
        if(!taskId){
            return;
        }

        const response = await GetTaskDetails(taskId);
        if(response?.success && response?.data){
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

    const fetchTaskStatusHistory = async () => {
        if(!taskId){
            setStatusHistory([]);
            return;
        }

        const response = await GetTaskStatusHistoryByTaskId(taskId);
        if(response?.success && Array.isArray(response?.data)){
            const sortedHistory = [...response.data].sort((a, b) => new Date(b.createdAtUtc) - new Date(a.createdAtUtc));
            setStatusHistory(sortedHistory);
            return;
        }

        setStatusHistory([]);
    }

    const fetchTaskComments = async () => {
        if(!taskId){
            setComments([]);
            return;
        }

        const response = await GetTaskCommentsByTaskId(taskId);
        if(response?.success && Array.isArray(response?.data)){
            const sortedComments = [...response.data].sort((a, b) => {
                const aDate = new Date(a?.createdAtUtc || a?.createdAt || 0);
                const bDate = new Date(b?.createdAtUtc || b?.createdAt || 0);
                return bDate - aDate;
            });
            setComments(sortedComments);
            return;
        }

        setComments([]);
    }

    useEffect(() => {
        
        if(taskId){
            fetchDevelopersAndTestersAndOrg(organizationId); 
            fetchTaskDetails();
            fetchTaskStatusHistory();
            fetchTaskComments();
        }
        
    },[taskId, organizationId])

    const handleTestCasesBtn = () => {
        setOpenTestCases(true);
    }

    const handleOpenCommentsModal = async () => {
        await fetchTaskComments();
        setOpenCommentsModal(true);
    }

    const handleAddComment = async () => {
        const createdBy = Number(getUserFromToken()?.userId);

        if(!Number.isInteger(createdBy) || createdBy <= 0){
            toast.error("Invalid user. Please login again.");
            return;
        }

        const response = await CreateTaskComment({
            taskId: Number(taskId),
            comment: commentText.trim(),
            createdBy
        });

        if(!response){
            toast.error(error || "Failed to add comment");
            return;
        }

        if(response?.success){
            toast.success(response?.message || "Comment added successfully");
            setCommentText("");
            await fetchTaskComments();
            return;
        }

        toast.error(response?.message || "Failed to add comment");
    }

    const buildSaveProgressPayload = () => {
        const values = getValues();

        return {
            taskId: Number(taskId),
            devNote: values.DevNote,
            devUnitTestingNotes: values.devUnitTestingNote,
            devStartDateTime: getDateValue(values.DevStartDateTime),
            devEndDateTime: getDateValue(values.DevEndDateTime)
        }
    }

    const saveProgressInternal = async (showToast = true,isModifyPayload = false) => {
        if(!taskId || Number.isNaN(Number(taskId))){
            toast.error("No task found. Cannot save progress.");
            return false;
        }

        var payloadObj = buildSaveProgressPayload();

        if(isModifyPayload){
            payloadObj = {
                ...payloadObj,
                devEndDateTime:getDateValue(new Date())
            }
        }

        const response = await TaskSaveProgressService(payloadObj);

        if(!response){
            if(showToast){
                toast.error(error || "Failed to save progress");
            }
            return false;
        }

        if(response?.success && response.statusCode === 200){
            if(showToast){
                toast.success(response.message || "Progress saved successfully");
            }
            return true;
        }

        if(showToast){
            toast.error(response?.message || "Failed to save progress");
        }
        return false;
    }

    const changeTaskStatus = async (newStatus, remarks, saveProgressFirst = false, isModifyPayload = false) => {
        const changedBy = Number(getUserFromToken()?.userId);

        if(!Number.isInteger(changedBy) || changedBy <= 0){
            toast.error("Invalid user. Please login again.");
            return false;
        }

        if(saveProgressFirst){
            const progressSaved = await saveProgressInternal(false,isModifyPayload);
            if(!progressSaved){
                toast.error("Please save valid progress before updating status.");
                return false;
            }
        }

        const response = await CreateTaskHistory({
            taskId: Number(taskId),
            previousStatus: taskDetails?.status || '',
            newStatus,
            changedBy,
            remarks
        });

        if(!response){
            toast.error(error || "Failed to update task status");
            return false;
        }

        if(response?.success){
            toast.success(response?.message || "Task status updated successfully");
            await fetchTaskDetails();
            await fetchTaskStatusHistory();
            return true;
        }

        toast.error(response?.message || "Failed to update task status");
        return false;
    }

    const handleStartTaskConfirm = async () => {
        await changeTaskStatus(TASK_STATUS.IN_PROGRESS.value, "Task started by developer");
        setStartTaskConfirm(false);
    };

    const handleDevDone = async () => {
        await changeTaskStatus(TASK_STATUS.DEV_DONE.value, "Task marked as development done", true, true);
    }

    const handleReopen = async () => {
        await changeTaskStatus(TASK_STATUS.IN_PROGRESS.value, "Task reopened by developer", true);
    }

    const handleMarkReadyConfirm = async () => {
        await changeTaskStatus(TASK_STATUS.TESTING_QUEUED.value, "Task marked ready for testing");
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
        if(formData){
            reset(formData, { keepValues: true });
        }
        await saveProgressInternal(true);
    }

    const handleBack = () => {
        navigate('/development/mytasks');
    }

    return (
        <>

        <Modal
            isOpen={openTestCases}
            onClose={() => setOpenTestCases(false)}
            title={`Test Cases for Task - ${taskId}`}
            width="max-w-4xl"
            >
            <TestCases taskId={taskId} GetTestCasesByTaskId={GetTestCasesByTaskId} TestCasesSaveUpdateService={TestCasesSaveUpdateService}  getUserFromToken={getUserFromToken}  />
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

        <Modal
            isOpen={openCommentsModal}
            onClose={() => setOpenCommentsModal(false)}
            title={`Task Comments - ${taskId}`}
            width="max-w-2xl"
        >
            <div className="flex flex-col gap-3">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full h-28 resize-none p-2 border border-gray-300 rounded-sm text-sm"
                    placeholder="Write your comment..."
                ></textarea>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleAddComment}
                        className="inline-flex items-center gap-1.5 bg-blue-600 text-xs font-medium text-white rounded-sm px-3 py-2 border border-blue-700 hover:bg-blue-700 transition-colors"
                    >
                        Add Comment
                    </button>
                </div>

                <div className="border-t pt-3 max-h-72 overflow-y-auto">
                    <h4 className="font-semibold text-sm mb-2">All Comments</h4>

                    {comments.length === 0 && (
                        <div className="text-xs text-gray-500 border border-dashed rounded-sm p-3">
                            No comments added yet.
                        </div>
                    )}

                    {comments.map((item) => {
                        const createdByName = userMap[item?.createdBy] || `User ${item?.createdBy || "-"}`;
                        const createdAt = item?.createdAtUtc || item?.createdAt;

                        return (
                            <div key={item?.id} className="border rounded-sm p-2 mb-2">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <span className="text-xs font-semibold text-gray-700 min-w-0 break-words">{createdByName}</span>
                                    <span className="text-[10px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 h-fit font-medium whitespace-nowrap">
                                        {formatDateTime(createdAt) || "-"}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-700 whitespace-pre-wrap break-words">{item?.comment || "-"}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Modal>

        <div className="w-full px-4 bg-gray-50">

           <div className="flex flex-col sm:flex-row sm:justify-between gap-3 p-4">
                <div onClick={handleBack} className="flex items-center gap-2 cursor-pointer text-blue-600 font-bold text-sm">
                    <ArrowLeft size={16} />
                    <span>Back to My Tasks</span>
                </div>

                <div className="flex items-center gap-3">
                    <button type="button" onClick={handleOpenCommentsModal} className="flex flex-1 items-center justify-center bg-gray-200 text-gray-700 text-sm rounded-sm px-3 py-2 gap-1 hover:bg-gray-300 transition-colors">
                    <MessageCircle size={16} />
                    <span>Add Comment</span>
                    </button>

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
                        {
                            taskDetails?.status === TASK_STATUS.NOT_STARTED.value && (

                                <button type="button" onClick={() => setStartTaskConfirm(true)} className="flex items-center gap-1 bg-white-600  text-sm rounded-sm px-3 py-2 border border-gray-300 hover:bg-gray-100">
                                    <Play size={16} />  Start Task
                                </button>
                            )
                        }

                        {/* <button type="button" className="flex items-center gap-1 bg-orange-600  text-sm text-white rounded-sm px-3 py-2 border border-gray-300 hover:bg-white-100 ml-2">
                            <Edit size={16} />  Update Status
                        </button> */}
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
                                                    editable={true}
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
                                                    editable={true}
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

                            {/* <div className="flex flex-col gap-1">
                                <label className="font-semibold text-sm">
                                    Time Spent
                                </label>
                                <input type="text" className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm" placeholder="Duration" />
                            </div> */}

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

                    {statusHistory.length === 0 && (
                        <div className="text-xs text-gray-500 border border-dashed rounded-sm p-3">
                            No status updates found.
                        </div>
                    )}

                    {statusHistory.map((item) => {
                        const statusMeta = getStatusMeta(item?.newStatus);

                        return (
                            <div key={item?.id} className="flex items-start justify-between gap-2 text-xs border p-2 rounded-sm mb-2">
                                <div className="min-w-0 flex-1">
                                    <h2 className="font-semibold text-xs break-words">
                                        {statusMeta.label} 
                                    </h2>
                                    <span className="text-gray-600 whitespace-pre-wrap break-words block">
                                        {item?.remarks || "-"}
                                    </span>
                                </div>

                                <span className={`text-[10px] rounded px-1.5 py-0.5 h-fit font-medium whitespace-nowrap ${statusMeta.color}`}>
                                    {formatDateTime(item?.createdAtUtc) || "-"} | {userMap[item?.changedBy] || "-"}
                                </span>
                            </div>
                        )
                    })}

                </div>
        
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-sm shadow-sm mt-4 mb-2">

                <div className="bg-white rounded-sm shadow-sm p-4">
                    
                    {

                            (taskDetails?.status === TASK_STATUS.NOT_STARTED.value || taskDetails?.status === TASK_STATUS.IN_PROGRESS.value) && (
                                <div className="flex gap-2 text-sm mb-2">

                                    <button onClick={handleSubmit(handleSaveProgress)} type="button" className="flex items-center gap-1 bg-white-600 text-sm rounded-sm px-2.5 py-1.5 border border-gray-300 hover:bg-white-100 ml-2">
                                        <Edit size={16} /> Save Progress
                                    </button>


                                    <button onClick={handleTestCasesBtn} type="button" className="flex items-center gap-1 bg-blue-600  text-sm text-white rounded-sm px-2.5 py-1.5 border border-blue-300 hover:bg-white-100 ml-2">
                                        <ShieldCheck size={16} /> Test Cases
                                    </button>

                                </div>

                            )

                        }

                    
                </div>

                <div className="bg-white rounded-sm shadow-sm p-3 flex flex-wrap items-center justify-end gap-2">

                    {taskDetails?.status === TASK_STATUS.IN_PROGRESS.value && (
                        <button
                            type="button"
                            onClick={handleDevDone}
                            className="inline-flex items-center gap-1.5 bg-blue-600 text-xs font-medium text-white rounded-sm px-2.5 py-1.5 border border-blue-700 hover:bg-blue-700 transition-colors"
                        >
                            <BadgeCheckIcon size={14} /> Dev Done
                        </button>
                    )}

                    {(taskDetails?.status === TASK_STATUS.TESTING_FAILED.value || taskDetails?.status === TASK_STATUS.TESTING_COMPLETED.value) && (
                        <>
                            <button
                                type="button"
                                onClick={handleReopen}
                                className="inline-flex items-center gap-1.5 bg-white text-xs font-medium text-gray-700 rounded-sm px-2.5 py-1.5 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <SkipBack size={14} /> Reopen
                            </button>

                        </>
                    )}

                    {taskDetails?.status === TASK_STATUS.DEV_DONE.value && (
                        <>
                            <button
                                type="button"
                                onClick={() => setMarkReadyConfirm(true)}
                                className="inline-flex items-center gap-1.5 bg-green-600 text-xs font-medium text-white rounded-sm px-2.5 py-1.5 border border-green-700 hover:bg-green-700 transition-colors"
                            >
                                <ShieldCheck size={14} /> Mark Ready for Testing
                            </button>
                        </>
                    )}

                </div>

            </div>

            
            
            

        </div>
        </>
    )
}

export default TaskDetails;