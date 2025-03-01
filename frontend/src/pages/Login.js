import React, { useState } from "react";
import OtpInput from "../components/OtpInput";

function Login() {
    const [otp, setOtp] = useState("");

    const handleSubmit = async() => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp }),
        });
        const data = await response.json();
        if (data.success) window.location.href = "/dashboard";
        else alert("Invalid OTP");
    };

    return ( <
        div >
        <
        h2 > Enter OTP < /h2> <
        OtpInput value = { otp }
        onChange = { setOtp }
        /> <
        button onClick = { handleSubmit } > Submit < /button> < /
        div >
    );
}
export default Login;