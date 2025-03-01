import React from "react";

function OtpInput({ value, onChange }) {
    const handleChange = (e) => {
        if (/^\d*$/.test(e.target.value)) onChange(e.target.value);
    };

    return <input type = "text"
    value = { value }
    onChange = { handleChange }
    maxLength = "6"
    placeholder = "Enter OTP" / > ;
}
export default OtpInput;