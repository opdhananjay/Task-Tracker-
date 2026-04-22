import { Route, Routes } from "react-router-dom";
import Login from "../pages/Auth/LoginPage";
import Layout from "../layouts/Layout";
import { Toaster } from "react-hot-toast";
import DashboardPage from "../pages/DashaboardPage";
import CreateTaskPage from "../pages/Tasks/CreateTaskPage";

const AppRoutes = () => {
    return (
        <>
            <Toaster/>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route element={<Layout/>}>
                    
                    <Route path="/dashboard" element={<DashboardPage/>} />

                    <Route path="tasks">   
                        <Route path="create" element={<CreateTaskPage/>} />
                    </Route>

                </Route>
            </Routes>
        </> 
    )
}

export default AppRoutes;