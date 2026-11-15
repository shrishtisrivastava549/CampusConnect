
const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;

    if (!user || !pass) {
        console.error("OTP MAIL ERROR: MAIL_USER or MAIL_PASS missing");
        throw new Error("Email service is not configured");
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user, pass },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
        tls: { minVersion: "TLSv1.2" }
    });

    try {
        const info = await transporter.sendMail({
            from: `"CampusConnect" <${user}>`,
            to: email,
            subject: title,
            html: body
        });

        console.log("OTP EMAIL SENT:", info.messageId);
        return info;

    } catch (error) {
        console.error("OTP MAIL ERROR:", error.code, error.message);
        throw error;

    } finally {
        transporter.close();
    }
};

module.exports = mailSender;
