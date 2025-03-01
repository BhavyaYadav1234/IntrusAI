import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return ( <
        div style = {
            { textAlign: "center", marginTop: "50px" } } >
        <
        h2 > Welcome to IntrusAI Dashboard < /h2> <
        button onClick = { handleLogout }
        style = {
            { padding: "10px 20px", fontSize: "16px" } } >
        Logout <
        /button> <
        /div>
    );
};

export default Dashboard;