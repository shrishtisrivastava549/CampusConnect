
const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;

    // Check email configuration
    if (!user || !pass) {
        console.error("OTP MAIL ERROR: MAIL_USER or MAIL_PASS is missing");

        const error = new Error(
            "Email service is not configured. Set MAIL_USER and MAIL_PASS in backend environment."
        );

        error.code = "EMAIL_NOT_CONFIGURED";
        throw error;
    }

    // Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,

        // Force IPv4 to avoid IPv6 ENETUNREACH error
        family: 4,

        auth: {
            user: user,
            pass: pass
        },

        connectionTimeout: 20000,
        greetingTimeout: 20000,
        socketTimeout: 30000,

        tls: {
            minVersion: "TLSv1.2"
        }
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
