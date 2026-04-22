import { useEffect } from "react";
import toast from "react-hot-toast";

const DashboardPage = () => {

    useEffect(()=>{
        toast.success('Welcome Dhananjay !');
    },[]);

    return (
        <div>
            Dashboard 
        </div>
    )
}

export default DashboardPage;