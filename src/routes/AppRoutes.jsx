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
import TestingListPage from "../pages/Testing/TestingListPage";
import TestingDetails from "../components/testing/TestingDetails";
import ReviewListPage from "../pages/Testing/ReviewListPage";
import Profile from "../pages/Auth/Profile";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <>
            <Toaster/>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/register" element={<RegistrationPage/>} />

                <Route element={<ProtectedRoute/>}>
                    <Route element={<Layout/>}>
                        
                        <Route path="/dashboard" element={<DashboardPage/>} />

                        <Route path="tasks" element={
                            <ProtectedRoute allowedRoles={["Admin", "Manager", "TeamLead"]} />
                        }>   
                            <Route path="create/:taskId?/:action?" element={<CreateTaskPage/>} />
                            <Route path="all" element={<TaskListPage/>} />
                        </Route>

                        <Route path="users"  element={
                            <ProtectedRoute allowedRoles={["Admin", "Manager"]} />
                        }>
                            <Route path="create/:userId?/:action?" element={<CreateUserPage/>}  />
                            <Route path="list" element={<UsersListPage/>} />
                        </Route>

                        <Route path="organization" element={
                            <ProtectedRoute allowedRoles={["Developer", "Admin", "Manager", "TeamLead", "Tester"]} />
                        }>
                            <Route path="profile" element={<OragnizationProfilePage/>} />
                        </Route>

                        <Route path="development" element={
                            <ProtectedRoute allowedRoles={["Developer", "Admin"]} />
                        } >
                            <Route path="mytasks" element={<MyTasksPage/>} />
                            <Route path="taskdetails/:organizationId/:taskId/:action?" element={<TaskDetails/>} />
                        </Route>

                        <Route path="testing" element={
                            <ProtectedRoute allowedRoles={["Tester", "Admin"]} />
                        }>
                            <Route path="testinglist" element={<TestingListPage/>} />
                            <Route path="testingDetails/:organizationId/:taskId/:action?" element={<TestingDetails/>} />
                            <Route path="reviewList" element={<ReviewListPage/>} />
                        </Route>

                        <Route path="profile" element={<Profile/>} />

                    </Route>
                </Route>
            </Routes>
        </> 
    )
}

export default AppRoutes;