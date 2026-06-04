import { ArrowLeft, BadgeCheckIcon, CalendarClock, Code, Edit, EllipsisVertical, FolderDot, Info, Logs, MessageCircle, Play, ShieldAlert, ShieldCheck, SkipBack, TestTube, User } from "lucide-react";
import { useParams } from "react-router-dom";
import Modal from "../shared/Modal";
import { useState } from "react";

const TaskDetails = () => {

    const { action,taskId } = useParams();

    console.log("TaskDetails Route Params:", { action, taskId });

    const [testCases,setTestCases] = useState(true);

    return (
        <>

        <Modal
        isOpen={testCases}
        onClose={() => setTestCases(false)}
        title="Task Details"
        >
            <div className="w-full p-4">
                <p>Task details content goes here...</p>
            </div>
        </Modal>

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
                    Task - 1024
                    </span>
                </div>

                <div className="flex justify-between items-center gap-2">

                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Implement User Authentication API</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button type="button" className="flex items-center gap-1 bg-white-600  text-sm rounded-sm px-3 py-2 border border-gray-300 hover:bg-gray-100">
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
                            High
                        </span>
                    </div>
                    
                    <div className="">
                        <span className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 text-gray-600 rounded-sm px-2 py-1 w-fit font-semibold"> <CalendarClock size={16} />  Due : 2024-07-15</span>
                    </div>

                </div>
           </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 rounded-sm shadow-sm mt-4 h-auto">

                <div className="bg-white rounded-sm shadow-sm p-4">

                    <div className="flex flex-col gap-2 text-sm mb-2">
                        <h4 className="font-bold">Task Description</h4>
                        <p className="text-sm text-gray-600 mt-2">
                        Implement a secure user authentication API using JWT tokens. The API should support user registration, login, and token refresh functionality. Ensure that passwords are hashed and that the API follows best practices for security and performance.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                        <h4 className="font-bold ">Acceptance Criteria</h4>
                        <p className="text-sm text-gray-600 mt-2">
                        Implement a secure user authentication API using JWT tokens. The API should support user registration, login, and token refresh functionality. Ensure that passwords are hashed and that the API follows best practices for security and performance.</p>
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
                                Admin
                            </div>
                        </div>

                        <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <CalendarClock size={16} />
                                <span>Created on</span>
                            </div>
                            <div>
                                12 May 2026 10:30 AM
                            </div>
                        </div>

                        <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Code size={16} />
                                <span>Developer</span>
                            </div>
                            <div>
                                Dhananjay (you)
                            </div>
                        </div>


                        <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <TestTube size={16} />
                                <span>Tester</span>
                            </div>
                            <div>
                               Rahul Tester
                            </div>
                        </div>

                         <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <ShieldAlert size={16} />
                                <span>Priority</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500 bg-gray-100 text-red-600 rounded-sm px-2 py-1 w-fit font-semibold">
                                 High
                                </span>
                            </div>
                        </div>

                         <div className="flex justify-between gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Logs size={16} />
                                <span>Task Type</span>
                            </div>
                            <div>
                               Feature
                            </div>
                        </div>

                     </div>

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 rounded-sm shadow-sm mt-4">

                <div className="bg-white rounded-sm shadow-sm p-4">
                    
                    <div className="">
                        <h4 className="font-bold mb-2">Development Details</h4>
                    </div>

                    <div className="flex flex-col gap-2 text-sm mb-2">

                        <div className="flex flex-col gap-2 text-sm">
                            <h5 className="flex items-center gap-2 ">Development Notes <Info size={16} /></h5>
                            <textarea
                            className="w-full h-32 resize-none p-2 border border-gray-300 rounded-sm text-sm"
                            placeholder="Add development notes here..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-sm shadow-sm mt-4 mb-2">
                            
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">
                                    Started At
                                </label>

                                <div className="relative">
                                    <input
                                    type="text"
                                    className="w-full p-2 pr-10 border border-gray-300 rounded-sm text-sm"
                                    placeholder="Started At"
                                    />

                                    <CalendarClock
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">
                                    Ended At
                                </label>

                                <div className="relative">
                                    <input
                                    type="text"
                                    className="w-full p-2 pr-10 border border-gray-300 rounded-sm text-sm"
                                    placeholder="Started At"
                                    />

                                    <CalendarClock
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">
                                    Time Spent
                                </label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-sm text-sm" placeholder="Duration" />
                            </div>

                        </div>


                        <div className="flex flex-col gap-2 text-sm">
                            <h5 className="flex items-center gap-2 ">Unit Testing Notes <Info size={16} /></h5>
                            <textarea
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

                        <button type="button" className="flex items-center gap-1 bg-white-600 text-sm rounded-sm px-3 py-2 border border-gray-300 hover:bg-white-100 ml-2">
                            <Edit size={16} /> Save Progress
                        </button>


                        <button type="button" className="flex items-center gap-1 bg-blue-600  text-sm text-white rounded-sm px-3 py-2 border border-blue-300 hover:bg-white-100 ml-2">
                            <ShieldCheck size={16} /> Write Test Cases
                        </button>

                    </div>

                </div>

                <div className="bg-white rounded-sm shadow-sm p-4 flex items-center justify-end">

                    <button type="button" className="flex items-center gap-1 bg-green-600 text-sm text-white rounded-sm px-3 py-2 border border-blue-300 hover:bg-white-100 ml-2">
                            <ShieldCheck size={16} /> Mark as Ready for Testing
                    </button>

                </div>

            </div>

        </div>
        </>
    )
}

export default TaskDetails;