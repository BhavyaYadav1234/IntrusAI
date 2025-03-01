import React, { useState } from "react";

const OtpInput = ({ length, onChange }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        let newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        onChange(newOtp.join(""));
    };

    return ( <
        div style = {
            { display: "flex", justifyContent: "center", gap: "10px" }
        } > {
            otp.map((_, index) => ( <
                input key = { index }
                type = "text"
                maxLength = "1"
                value = { otp[index] }
                onChange = {
                    (e) => handleChange(index, e.target.value)
                }
                style = {
                    { width: "40px", height: "40px", textAlign: "center", fontSize: "20px" }
                }
                />
            ))
        } <
        /div>
    );
};

export default OtpInput;