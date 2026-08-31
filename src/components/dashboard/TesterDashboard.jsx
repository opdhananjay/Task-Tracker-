import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDashboard from "../../hooks/useDashboard";

const TesterDashboard = ({ userName, testerId }) => {

    const navigate = useNavigate();

    const { GetTesterDashboard } = useDashboard();

    const [dashboardData,setDashboardData] = useState(null);

    useEffect(()=>{
         const fetchDashboard = async () => {
            const payload = {
                testerId:testerId
            }
            const response = await GetTesterDashboard(payload);
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
                            Welcome back, {userName}
                        </h1>
                        <p className="text-gray-500 mt-1">
                             Here's what's happening with your testing today.
                        </p>
                    </div>
                    <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        onClick={()=>{
                            navigate('/testing/testinglist')
                        }}>
                        View Testing Que.
                    </button>
                </div>  

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-gray-500 text-sm">Testing Total Task</p>
                        <h2 className="text-3xl font-bold mt-2">{dashboardData?.totalTasks}</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-gray-500 text-sm">Testing Queue</p>
                        <h2 className="text-3xl font-bold mt-2">{dashboardData?.testingQueue}</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-gray-500 text-sm">Testing InProgress</p>
                        <h2 className="text-3xl font-bold mt-2">{dashboardData?.testingInProgress}</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-gray-500 text-sm">Testing Failed</p>
                        <h2 className="text-3xl font-bold mt-2">{dashboardData?.testingFailed}</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-gray-500 text-sm">Testing Completed</p>
                        <h2 className="text-3xl font-bold mt-2">{dashboardData?.testingCompleted}</h2>
                    </div>

                </div>
            </div>
        </>
    )
}

export default TesterDashboard;