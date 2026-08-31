import { BellRing, LogOut, Menu, UserRoundPen } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useMaster from "../hooks/useMaster";

const Header = ({ toggleSidebar }) => {

    const navigate = useNavigate();
    
    const { logout, getUserFromToken } = useAuth();

    const { fetchDevelopersAndTestersAndOrg, userMap } = useMaster();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    const [userName,setUserName] = useState('Unknown');

    const fetchUser = async () => {
        const user = getUserFromToken();
        const userId = user.userId;
        await fetchDevelopersAndTestersAndOrg(user.organizationId);
        setUserName(userMap[userId]);
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const user = getUserFromToken();

            if (!user) {
                return;
            }

            await fetchDevelopersAndTestersAndOrg(user.organizationId);
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const user = getUserFromToken();

        if (user?.userId && userMap) {
            setUserName(userMap[user.userId] || "Unknown");
        }
    }, [userMap]);

    return (
      <>
        <header className="flex items-center justify-between bg-white shadow px-4 py-4">
            
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="text-xl font-bold px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                    <Menu size={16} />     
                </button>
                <h1 className="text-lg font-semibold">
                    Tracker <small className="text-gray-500">| Intenal JIRA Module</small>
                </h1>
                
            </div>

            {/* Middle Section  */}
            <div>
               
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">

                <button className="relative">
                    <BellRing color="#49ca58" />
                    <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full px-1">7</span>
                </button>

                <div className="flex items-center gap-2 cursor-pointer">
                    <UserRoundPen color="#dd368f" />
                    <span className="hidden md:block text-sm">
                       {userName}
                    </span>
                </div>

                <button onClick={handleLogout} className="cursor-pointer">
                    <LogOut color="#df0c0c" />
                </button>

            </div>

        </header>
      </>
    )
}

export default Header;