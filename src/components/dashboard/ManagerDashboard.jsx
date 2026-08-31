import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDashboard from "../../hooks/useDashboard";

const ManagerDashboard = ({ userName, orgId }) => {
    
    const { GetManagerDashboard } = useDashboard();

    const navigate = useNavigate();
    
    const [dashaboardData,setDashboardData] = useState(null);

    useEffect(()=>{
        
        const fetchDashboard = async () => {
            
            const payload = {
                organizationId:orgId
            }

            const response = await GetManagerDashboard(payload);

            if(response?.success){
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
                          Here's what's happening with your organization.
                        </p>

                    </div>

                    <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        onClick={()=>{
                        navigate('/tasks/all')
                    }}>
                        View My Tasks
                    </button>

                </div>
                
                {/* Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <p className="text-gray-500 text-sm">Total Tasks</p>
                        <h2 className="text-3xl font-bold mt-2">{dashaboardData?.totalTasks}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <p className="text-gray-500 text-sm">NotStarted</p>
                        <h2 className="text-3xl font-bold mt-2">{dashaboardData?.notStarted}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <p className="text-gray-500 text-sm">InProgress</p>
                        <h2 className="text-3xl font-bold mt-2">{dashaboardData?.inProgress}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <p className="text-gray-500 text-sm">Development Completed</p>
                        <h2 className="text-3xl font-bold mt-2">{dashaboardData?.developmentCompleted}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <p className="text-gray-500 text-sm">Testing Queue</p>
                        <h2 className="text-3xl font-bold mt-2">{dashaboardData?.testingQueue}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <p className="text-gray-500 text-sm">Testing InProgress</p>
                        <h2 className="text-3xl font-bold mt-2">{dashaboardData?.testingInProgress}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <p className="text-gray-500 text-sm">Testing Failed</p>
                        <h2 className="text-3xl font-bold mt-2">{dashaboardData?.testingFailed}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <p className="text-gray-500 text-sm">Testing Completed</p>
                        <h2 className="text-3xl font-bold mt-2">{dashaboardData?.testingCompleted}</h2>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <p className="text-gray-500 text-sm">Development Stopped</p>
                        <h2 className="text-3xl font-bold mt-2">{dashaboardData?.developmentStopped}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <p className="text-gray-500 text-sm">Closed</p>
                        <h2 className="text-3xl font-bold mt-2">{dashaboardData?.closed}</h2>
                    </div>

                </div>

            </div>
        </>
    )
}

export default ManagerDashboard;