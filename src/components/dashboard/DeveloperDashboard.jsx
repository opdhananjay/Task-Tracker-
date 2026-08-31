import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useDashboard from "../../hooks/useDashboard";
import TaskList from "../Tasks/TaskList";
import { useNavigate } from "react-router-dom";

const DeveloperDashboard = ({userName,developerId}) => {
  
  const { GetDeveloperDashboard } = useDashboard();

  const [dashboardData,setDashboardData] = useState(null);

  const navigate = useNavigate();

  useEffect(()=>{

    const fetchDashboard = async () => {
      const payload = {
        developerId:developerId
      }
      const response = await GetDeveloperDashboard(payload);
      if(response?.success && response?.data){
        setDashboardData(response?.data);
      }
    }

    fetchDashboard();

  },[]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userName} 👋 
            </h1>

            <p className="text-gray-500 mt-1">
              Here's what's happening with your tasks today.
            </p>
          </div>

          <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={()=>{
              navigate('/development/mytasks')
            }}>
            View My Tasks
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-gray-500 text-sm">Total Tasks</p>

            <h2 className="text-3xl font-bold mt-2">{dashboardData?.totalTasks}</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-gray-500 text-sm">In Progress</p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">{dashboardData?.inProgressTasks}</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-gray-500 text-sm">Pending Testing</p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">{dashboardData?.pendingTestingTasks}</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-gray-500 text-sm">Completed</p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">{dashboardData?.completedTasks}</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-gray-500 text-sm">Testing Failed</p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">{dashboardData?.testingFailedTasks}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          {/* My Tasks */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border">
            <div className="border-b px-5 py-4">
              <h3 className="font-semibold text-lg">My Priority Tasks</h3>
            </div>

            <div className="p-5">
                {/* <TaskList /> */}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="border-b px-5 py-4">
              <h3 className="font-semibold text-lg">Recent Activity</h3>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div>
                <p className="font-medium">Login API Fixed</p>

                <p className="text-sm text-gray-500">10 mins ago</p>
              </div>

              <div>
                <p className="font-medium">User Module Completed</p>

                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border mt-6">
          <div className="border-b px-5 py-4">
            <h3 className="font-semibold text-lg">Upcoming Deadlines</h3>
          </div>

          <div className="p-5">Deadline Table Here</div>
        </div>
      </div>
    </>
  );
};

export default DeveloperDashboard;
