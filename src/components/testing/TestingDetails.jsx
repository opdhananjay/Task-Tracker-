import {
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  Code,
  FolderDot,
  Logs,
  Play,
  ShieldAlert,
  TestTube,
  User,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateTime } from "../../utils/dateUtils";
import Modal from "../shared/Modal";
import TestCaseTransaction from "../developement/TestCaseTransaction";
import useDeveloper from "../../hooks/useDeveloper";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { TASK_STATUS } from "../../Enums/appEnums";
import useMaster from "../../hooks/useMaster";
import ConfirmationModal from "../shared/ConfirmationModal";

const TestingDetails = () => {
  const { organizationId, action, taskId } = useParams();

  const navigate = useNavigate();

  const { getUserFromToken } = useAuth();

  const {
    GetTaskDetails,
    TestCasesSaveUpdateService,
    GetTaskStatusHistoryByTaskId,
    GetTestCasesByTaskId,
    GetTaskCommentsByTaskId,
    CreateTaskComment,
    CreateTaskHistory,
    CreateTaskTestingLogAsync,
    GetTaskTestingDetails
  } = useDeveloper();

  const {
    fetchDevelopersAndTestersAndOrg,
    developerMap,
    testerMap,
    organizationMap,
    userMap,
  } = useMaster();

  const [openTestCases, setOpenTestCases] = useState(false);

  const [taskDetails, setTaskDetails] = useState(null);

  const [statusHistory, setStatusHistory] = useState([]);

  const [selectedTestCase,setSelectedTestCase] = useState(null);

  const [testCases, setTestCases] = useState([]);

  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] = useState("");

  const [openCommentsModal, setOpenCommentsModal] = useState(false);

  const [testingFailedConfirm, setTestingFailedConfirm] = useState(false);

  const [testingCompletedConfirm, setTestingCompletedConfirm] = useState(false);

  const [testingLogId, setTestingLogId] = useState(null);

  const handleBack = () => {
    navigate("/testing/testinglist");
  };

  const handleViewTestCase = (testCase) => {
    setSelectedTestCase(testCase);
    setOpenTestCases(true);
  };

  const handleNewCase = () => {
    setSelectedTestCase(null);
    setOpenTestCases(true);
  }

  const fetchTaskDetails = async () => {
    if (!taskId) {
      return;
    }
    const response = await GetTaskDetails(taskId);
    if (response?.success && response?.data) {
      const task = response.data[0];
      setTaskDetails(task);
    } else {
      toast.error(response?.message || "Failed to fetch task details");
    }
  };

  const fetchTaskStatusHistory = async () => {
    if (!taskId) {
      setStatusHistory([]);
      return;
    }

    const response = await GetTaskStatusHistoryByTaskId(taskId);
    if (response?.success && Array.isArray(response?.data)) {
      const sortedHistory = [...response.data].sort(
        (a, b) => new Date(b.createdAtUtc) - new Date(a.createdAtUtc),
      );
      setStatusHistory(sortedHistory);
      return;
    }

    setStatusHistory([]);
  };

  const getStatusMeta = (statusValue) => {
        return TASK_STATUS[statusValue] || {
            label: statusValue || "Unknown",
            color: "bg-gray-100 text-gray-700"
        };
  };

  const fetchTestCases = async () => {
      const response = await GetTestCasesByTaskId(taskId);
      if (response?.success && response?.data) {
        setTestCases(response.data);
        console.log('test cases', response.data);
      } else {
        console.error(response?.message || "Failed to fetch test cases");
      }
  };

  useEffect(() => {
    if (taskId) {
      fetchDevelopersAndTestersAndOrg(organizationId);
      fetchTaskDetails();
      fetchTaskStatusHistory();
      fetchTestCases();
    }
  }, []);

  useEffect(() => {
    if (taskDetails?.testerId && taskId) {
      GetTaskTestingDet();
    }
  }, [taskDetails?.testerId, taskId]);

  const handleTestCaseTransactionResponse = () => {
      fetchTestCases();
      setOpenTestCases(false);
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

    const handleStartTesting = async () => {

        await CreateTaskHistory({
            taskId: Number(taskId),
            previousStatus: taskDetails?.status || "",
            newStatus: TASK_STATUS.TESTING_IN_PROGRESS.value,
            changedBy: Number(getUserFromToken()?.userId),
            remarks: "Testing started by tester"
        });

        await CreateTaskTestingLogA(TASK_STATUS.TESTING_IN_PROGRESS.value,"Testing Started.");

        await fetchTaskDetails();
  };

  const handleTestingFailedConfirm = async () => {

      await CreateTaskHistory({
          taskId: Number(taskId),
          previousStatus: taskDetails?.status || "",
          newStatus: TASK_STATUS.TESTING_FAILED.value,
          changedBy: Number(getUserFromToken()?.userId),
          remarks:''
      });

      await CreateTaskTestingLogA(TASK_STATUS.TESTING_FAILED.value,"Testing failed");

      await fetchTaskDetails();

      setTestingFailedConfirm(false);
  };

  const handleTestingCompletedConfirm = async () => {

    await CreateTaskHistory({
        taskId: Number(taskId),
        previousStatus: taskDetails?.status || "",
        newStatus: TASK_STATUS.TESTING_COMPLETED.value,
        changedBy: Number(getUserFromToken()?.userId),
        remarks: "Testing completed successfully"
    });

    await CreateTaskTestingLogA(TASK_STATUS.TESTING_COMPLETED.value,"Testing completed successfully");

    await fetchTaskDetails();

    setTestingCompletedConfirm(false);
  };

  const CreateTaskTestingLogA = async (finalStatus,remarks = '') => {
    
    const payload = {
      "id": testingLogId,
      "taskId": taskId,
      "testerId":taskDetails?.testerId,
      "finalStatus":finalStatus,
      "remarks":remarks
    }

    var response = await CreateTaskTestingLogAsync(payload);
    debugger;
    if(response?.success){
       var testingLogIdstr = response?.data?.testingLogId || '';
       setTestingLogId(testingLogIdstr);
    } 
    else{
       toast.error(response?.message)
    }
  }

  const GetTaskTestingDet = async () => {

    const payload = {
      "taskId": taskId,
      "testerId": taskDetails?.testerId
    }

    var response = await GetTaskTestingDetails(payload);
    debugger;
    if(response?.success && response?.data){
      var data = response?.data;
      var testingLogIdStr = data[0].id;
      setTestingLogId(testingLogIdStr);
    }
    else{
       toast.error(response?.message)
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
        <TestCaseTransaction onSuccess={handleTestCaseTransactionResponse} taskId={taskId} testCase={selectedTestCase} mode={'new'} TestCasesSaveUpdateService={TestCasesSaveUpdateService} getUserFromToken={getUserFromToken} />
      </Modal>

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
          <div
            onClick={handleBack}
            className="flex items-center gap-2 cursor-pointer text-blue-500 font-bold text-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to Testing List</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button" onClick={handleOpenCommentsModal} 
              className="flex flex-1 items-center justify-center bg-gray-200 text-gray-700 text-sm rounded-sm px-3 py-2 gap-1 hover:bg-gray-300 transition-colors"
            >
              Add Comments
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2 p-4 bg-white rounded-sm shadow-sm">
          <div className="">
            <span className="text-sm font-boldf flex items-center gap-1 bg-blue-100 text-blue-600 rounded-sm px-2 py-1 w-fit">
              Task - {taskId}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                Testing - {taskDetails?.title}{" "}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {taskDetails?.status === TASK_STATUS.TESTING_QUEUED.value && (
                <button
                  type="button"
                  onClick={() => setStartTaskConfirm(true)}
                  className="flex items-center gap-1 bg-white-600  text-sm rounded-sm px-3 py-2 border border-gray-300 hover:bg-gray-100"
                >
                  <Play size={16} /> Start Testing
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-start items-center gap-2">
            <div className="">
              <span className="text-sm text-gray-500 bg-gray-100 text-red-600 rounded-sm px-2 py-1 w-fit">
                {taskDetails?.priority || "-"}
              </span>
            </div>

            <div className="">
              <span className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 text-gray-600 rounded-sm px-2 py-1 w-fit font-semibold">
                <CalendarClock size={16} /> Due :{" "}
                {formatDateTime(taskDetails?.dueDateTime) || "-"}
              </span>
            </div>

            <div className={``}>
              <span
                className={`flex items-center gap-2 text-sm text-gray-500 text-gray-600 rounded-sm px-2 py-1 w-fit font-semibold`}
              >
                Status : {taskDetails?.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-col-1 md:grid-cols-[1fr_1fr_1fr] gap-4 rounded-sm shadow-sm mt-4">
          <div className="bg-white rounded-sm shadow-sm p-4 h-64 overflow-y-auto">
            <div className="flex flex-col gap-2 text-sm mb-2">
              <h4 className="font-bold">Task Description</h4>
              <p className="text-sm text-gray-600 mt-2">
                {" "}
                {taskDetails?.description || "-"}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <h4 className="font-bold ">Acceptance Criteria</h4>
              <p className="text-sm text-gray-600 mt-2">
                {taskDetails?.acceptanceCriteria || "-"}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <h4 className="font-bold ">Developer Note</h4>
              <p className="text-sm text-gray-600 mt-2">
                {taskDetails?.devNote || "-"}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <h4 className="font-bold ">Unit Testing Note</h4>
              <p className="text-sm text-gray-600 mt-2">
                {taskDetails?.devUnitTestingNote || "-"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm p-4 h-64 overflow-y-auto">
            <div className="flex flex-col gap-2 text-sm mb-2">
              <h4 className="fomt-bold">Task Information</h4>

              <div className="flex justify-between gap-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <FolderDot size={16} />
                  <span>Project</span>
                </div>
                <div>User Management</div>
              </div>

              <div className="flex justify-between gap-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span> {userMap[taskDetails?.createdBy] || "-"}</span>
                </div>
                <div>{"-"}</div>
              </div>

              <div className="flex justify-between gap-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarClock size={16} />
                  <span>Created on</span>
                </div>
                <div> {formatDateTime(taskDetails?.createdAt) || "-"}</div>
              </div>

              <div className="flex justify-between gap-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <Code size={16} />
                  <span>Developer</span>
                </div>
                <div> {developerMap[taskDetails?.developerId] || "-"}</div>
              </div>

              <div className="flex justify-between gap-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <TestTube size={16} />
                  <span>Tester</span>
                </div>
                <div>{testerMap[taskDetails?.testerId] || "-"}</div>
              </div>

              <div className="flex justify-between gap-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} />
                  <span>Priority</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 bg-gray-100 text-red-600 rounded-sm px-2 py-1 w-fit font-semibold">
                    {taskDetails?.priority || "-"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between gap-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <Logs size={16} />
                  <span>Task Type</span>
                </div>
                <div>{taskDetails?.taskType || "-"}</div>
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
                <div
                  key={item?.id}
                  className="flex items-start justify-between gap-2 text-xs border p-2 rounded-sm mb-2"
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-xs break-words">
                      {statusMeta.label}
                    </h2>
                    <span className="text-gray-600 whitespace-pre-wrap break-words block">
                      {item?.remarks || "-"}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] rounded px-1.5 py-0.5 h-fit font-medium whitespace-nowrap ${statusMeta.color}`}
                  >
                    {formatDateTime(item?.createdAtUtc) || "-"} |{" "}
                    {userMap[item?.changedBy] || "-"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 mt-4 bg-white rounded-sm shadow-sm h-128 overflow-y-auto mb-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold flex items-center gap-1 bg-orange-100 text-orange-700 rounded-sm px-2 py-1">
              Test Cases
            </span>

             <div className="rounded-md flex items-center justify-end mb-2 gap-2">
              <span className="text-xs text-gray-500">{testCases.length} Test Cases </span>
              <button onClick={handleNewCase}
                className={`px-2 py-1 text-sm text-white rounded-md bg-gray-600`}
                
              >
                 New Test Case 
              </button>
            </div>
          </div>


          {/* Test Cases List */}
          <div className="flex flex-col gap-2">

             {
                testCases.map((testCase,i)=>{
                  return (
                    <>
                        {/* Test Case */}
                        <div key={i} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                          <div className="flex items-center justify-between gap-4">
                            {/* Test Case Title */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {testCase.testCaseTitle}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                               {testCase.expectedResult}
                              </p>
                            </div>

                            {/* Developer Status */}
                            <div className="w-32">
                              <p className="text-[11px] text-gray-500 mb-1">Developer</p>

                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm bg-white-600 text-green-700`}>
                                {testCase.developerStatus}
                              </span>
                            </div>

                            {/* Tester Status */}
                            <div className="w-32">
                              <p className="text-[11px] text-gray-500 mb-1">Tester</p>

                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-sm bg-gray-100 text-gray-600">
                               {testCase.testerStatus}
                              </span>
                            </div>

                            {/* View Button */}
                            <div>
                              <button
                                type="button"
                                className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
                                onClick={() => handleViewTestCase(testCase)}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                    </>
                  )
                })
             }

          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-sm shadow-sm mt-4 mb-2">

             <div className="bg-white rounded-sm shadow-sm p-3 flex flex-wrap items-center justify-end gap-2">

                    {/* =================================================
                        TESTING QUEUED
                        Tester can start testing
                    ================================================== */}
                    {taskDetails?.status === TASK_STATUS.TESTING_QUEUED.value && (
                        <button
                            type="button"
                            onClick={handleStartTesting}
                            className="
                                inline-flex items-center gap-1.5
                                bg-blue-600 text-xs font-medium text-white
                                rounded-sm px-2.5 py-1.5
                                border border-blue-700
                                hover:bg-blue-700
                                transition-colors
                            "
                        >
                            <Play size={14} />
                            Start Testing
                        </button>
                    )}


                    {/* =================================================
                        TESTING IN PROGRESS
                        Tester can complete or fail testing
                    ================================================== */}
                    {taskDetails?.status === TASK_STATUS.TESTING_IN_PROGRESS.value && (
                        <>
                            {/* Testing Failed */}
                            <button
                                type="button"
                                onClick={() => setTestingFailedConfirm(true)}
                                className="
                                    inline-flex items-center gap-1.5
                                    bg-red-600 text-xs font-medium text-white
                                    rounded-sm px-2.5 py-1.5
                                    border border-red-700
                                    hover:bg-red-700
                                    transition-colors
                                "
                            >
                                <XCircle size={14} />
                                Testing Failed
                            </button>

                            {/* Testing Completed */}
                            <button
                                type="button"
                                onClick={() => setTestingCompletedConfirm(true)}
                                className="
                                    inline-flex items-center gap-1.5
                                    bg-green-600 text-xs font-medium text-white
                                    rounded-sm px-2.5 py-1.5
                                    border border-green-700
                                    hover:bg-green-700
                                    transition-colors
                                "
                            >
                                <CheckCircle size={14} />
                                Testing Completed
                            </button>
                        </>
                    )}

                </div>

        
        </div>

      </div>


    <ConfirmationModal
      isOpen={testingCompletedConfirm}
      title="Complete Testing?"
      description="Are you sure you want to mark this task as testing completed? Please make sure all test cases have been tested and the results are updated."
      confirmText="Yes, Complete Testing"
      cancelText="No, Continue Testing"
      onConfirm={handleTestingCompletedConfirm}
      onCancel={() => setTestingCompletedConfirm(false)}
  />

  <ConfirmationModal
      isOpen={testingFailedConfirm}
      title="Mark Testing as Failed?"
      description="Are you sure you want to mark this task as testing failed? Please provide the testing results and remarks explaining the issue."
      confirmText="Yes, Mark as Failed"
      cancelText="No, Continue Testing"
      onConfirm={handleTestingFailedConfirm}
      onCancel={() => setTestingFailedConfirm(false)}
  />

    </>
  );
};

export default TestingDetails;
