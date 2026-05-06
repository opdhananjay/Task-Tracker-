import { Route, Routes } from "react-router-dom";
import Login from "../pages/Auth/LoginPage";
import Layout from "../layouts/Layout";
import { Toaster } from "react-hot-toast";
import DashboardPage from "../pages/DashaboardPage";
import CreateTaskPage from "../pages/Tasks/CreateTaskPage";
import TaskListPage from "../pages/Tasks/TaskListPage";
import CreateUserPage from "../pages/Users/CreateUserPAge";
import UsersListPage from "../pages/Users/UsersListPage";

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
                        <Route path="all" element={<TaskListPage/>} />
                    </Route>

                    <Route path="users">
                        <Route path="create" element={<CreateUserPage/>}  />
                        <Route path="list" element={<UsersListPage/>} />
                    </Route>

                </Route>
            </Routes>
        </> 
    )
}

export default AppRoutes;