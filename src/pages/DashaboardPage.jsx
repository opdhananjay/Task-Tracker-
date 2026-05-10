import { useEffect } from "react";
import toast from "react-hot-toast";
import ManagerDashboard from "../components/dashboard/ManagerDashboard";
import TeamLeadDashboard from "../components/dashboard/TeamLeadDashboard";
import DeveloperDashboard from "../components/dashboard/DeveloperDashboard";
import TesterDashboard from "../components/dashboard/TesterDashboard";

const DashboardPage = () => {

    useEffect(()=>{
        toast.success('Welcome Dhananjay !');
    },[]);

    const userRole = localStorage.getItem('role');

    const renderDashboard = () => {

        if(userRole == 'Manager'){
             return <ManagerDashboard />
        }

        if(userRole == 'TeamLeader'){
             return <TeamLeadDashboard />
        }

        if(userRole == 'Developer'){
             return <DeveloperDashboard />
        }

        if(userRole == 'Tester'){
            return <TesterDashboard />
        }

        return (<div>
            No Dashboard founds
        </div>);
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <small>Different Role Different Dashboard Component Will Load in This Page </small> 
            {renderDashboard()}
        </div>
    )
}

export default DashboardPage;