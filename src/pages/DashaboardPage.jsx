import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ManagerDashboard from "../components/dashboard/ManagerDashboard";
import TeamLeadDashboard from "../components/dashboard/TeamLeadDashboard";
import DeveloperDashboard from "../components/dashboard/DeveloperDashboard";
import TesterDashboard from "../components/dashboard/TesterDashboard";
import useAuth from "../hooks/useAuth";
import useMaster from "../hooks/useMaster";

const DashboardPage = () => {

    useEffect(()=>{
        toast.success('Welcome Dhananjay !');
    },[]);

    const { getUserFromToken } = useAuth();

    const { fetchDevelopersAndTestersAndOrg ,userMap } = useMaster();

    const [userName,setUserName] = useState('Unknown');

    const user = getUserFromToken();

    const userRole = user.role;
    
    const userId = user.userId;

    const orgId = user.organizationId;
    
    useEffect(() => {

        const fetchData = async () => {

          
            const organizationId = user.organizationId;

            await fetchDevelopersAndTestersAndOrg(organizationId);
        };

        fetchData();

    }, []);

    useEffect(() => {

        if (userMap && user.userId) {
            setUserName(userMap[user.userId] || "Unknown");
        }

    }, [userMap, user.userId]);


    const renderDashboard = () => {

        if(userRole == 'Manager'){
             return <ManagerDashboard userName={userName} orgId={orgId} />
        }

        if(userRole == 'TeamLead'){
             return <TeamLeadDashboard userName={userName} teamLeaderId={userId}  />
        }

        if(userRole == 'Developer'){
             return <DeveloperDashboard userName={userName} developerId={userId} />
        }

        if(userRole == 'Tester'){
            return <TesterDashboard userName={userName} testerId={userId} />
        }

        // return <DeveloperDashboard />

        return (<div>
            No Dashboard founds
        </div>);
    }


    return (
        <div className="min-h-screen ">
            {/* <small>Different Role Different Dashboard Component Will Load in This Page </small>  flex flex-col items-center justify-center */}
            {renderDashboard()}
        </div>
    )
}

export default DashboardPage;