
const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;

    // Check environment variables
    if (!user || !pass) {
        const error = new Error(
            "Email service is not configured. Set MAIL_USER and MAIL_PASS."
        );

        error.code = "EMAIL_NOT_CONFIGURED";

        console.error("OTP MAIL ERROR:", error.message);

        throw error;
    }

    // Gmail SMTP configuration
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        family: 4,

        auth: {
            user: user,
            pass: pass
        },

        requireTLS: true,

        tls: {
            minVersion: "TLSv1.2"
        },

        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 45000
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
        console.error(
            "OTP MAIL ERROR:",
            error.code || "UNKNOWN",
            error.message
        );

        throw error;

    } finally {
        transporter.close();
    }
};

module.exports = mailSender;
