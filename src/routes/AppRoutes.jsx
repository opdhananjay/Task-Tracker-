import { Route, Routes } from "react-router-dom";
import Login from "../pages/Auth/LoginPage";
import Layout from "../layouts/Layout";
import Dashboard from "../pages/Dashaboard";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/" element={<Layout/>}>
                <Route path="/dashboard" element={<Dashboard/>} />
            </Route>
        </Routes>
    )
}

export default AppRoutes;