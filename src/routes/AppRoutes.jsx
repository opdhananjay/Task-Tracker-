import { Route, Routes } from "react-router-dom";
import Login from "../pages/Auth/LoginPage";
import Layout from "../layouts/Layout";
import { Toaster } from "react-hot-toast";
import DashboardPage from "../pages/DashaboardPage";
import CreateTaskPage from "../pages/Tasks/CreateTaskPage";
import TaskListPage from "../pages/Tasks/TaskListPage";
import CreateUserPage from "../pages/Users/CreateUserPAge";
import UsersListPage from "../pages/Users/UsersListPage";
import OragnizationProfilePage from "../pages/Organization/OragnizationProfilePage";
import RegistrationPage from "../pages/Auth/RegistrationPage";
import MyTasksPage from "../pages/Development/MyTasksPage";
import TaskDetails from "../components/developement/TaskDetails";

const AppRoutes = () => {
    return (
        <>
            <Toaster/>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/register" element={<RegistrationPage/>} />
                <Route element={<Layout/>}>
                    
                    <Route path="/dashboard" element={<DashboardPage/>} />

                    <Route path="tasks">   
                        <Route path="create/:taskId?/:action?" element={<CreateTaskPage/>} />
                        <Route path="all" element={<TaskListPage/>} />
                    </Route>

                    <Route path="users">
                        <Route path="create/:userId?/:action?" element={<CreateUserPage/>}  />
                        <Route path="list" element={<UsersListPage/>} />
                    </Route>

                    <Route path="organization">
                        <Route path="profile" element={<OragnizationProfilePage/>} />
                    </Route>

                    <Route path="development" >
                        <Route path="mytasks" element={<MyTasksPage/>} />
                        <Route path="taskdetails/:organizationId/:taskId/:action?" element={<TaskDetails/>} />
                    </Route>

                </Route>
            </Routes>
        </> 
    )
}

export default AppRoutes;