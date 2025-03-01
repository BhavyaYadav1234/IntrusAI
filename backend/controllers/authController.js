const User = require("backend/models/User");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
});

exports.sendOtp = async(req, res) => {
    const { email } = req.body;
    const otp = speakeasy.totp({ secret: "secret-key", encoding: "base32" });
    await User.findOneAndUpdate({ email }, { otp, otpExpiry: Date.now() + 5 * 60 * 1000 }, { upsert: true, new: true });
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
    });
    res.json({ message: "OTP Sent" });
};

exports.verifyOtp = async(req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp });
    if (!user || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: "Invalid or Expired OTP" });
    }
    res.json({ message: "OTP Verified", token: "mock-jwt-token" });
};