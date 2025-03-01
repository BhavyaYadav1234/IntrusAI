import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OtpInput from "../components/OtpInput";

const Login = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleSendOtp = async() => {
        try {
            const res = await axios.post("http://localhost:5000/api/send-otp", { email });
            if (res.data.success) {
                setStep(2);
            } else {
                alert("Failed to send OTP");
            }
        } catch (error) {
            alert("Error sending OTP");
        }
    };

    const handleVerifyOtp = async() => {
        try {
            const res = await axios.post("http://localhost:5000/api/verify-otp", { email, otp });
            if (res.data.success) {
                navigate("/dashboard");
            } else {
                alert("Invalid OTP");
            }
        } catch (error) {
            alert("Error verifying OTP");
        }
    };

    return ( <
        div style = {
            { textAlign: "center", marginTop: "50px" } } >
        <
        h2 > { step === 1 ? "Login with OTP" : "Enter OTP" } < /h2>

        {
            step === 1 ? ( <
                >
                <
                input type = "email"
                placeholder = "Enter your email"
                value = { email }
                onChange = {
                    (e) => setEmail(e.target.value) }
                style = {
                    { padding: "10px", fontSize: "16px", marginBottom: "10px" } }
                /> <
                br / >
                <
                button onClick = { handleSendOtp }
                style = {
                    { padding: "10px 20px", fontSize: "16px" } } >
                Send OTP <
                /button> <
                />
            ) : ( <
                >
                <
                OtpInput length = { 6 }
                onChange = { setOtp }
                /> <
                br / >
                <
                button onClick = { handleVerifyOtp }
                style = {
                    { padding: "10px 20px", fontSize: "16px" } } >
                Verify OTP <
                /button> <
                />
            )
        } <
        /div>
    );
};

export default Login;