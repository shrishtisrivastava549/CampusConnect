const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;

    if (!user || !pass) {
        const error = new Error(
            "Email service is not configured. Set MAIL_USER and MAIL_PASS in the backend environment."
        );
        error.code = "EMAIL_NOT_CONFIGURED";
        throw error;
    }

    // Use Gmail's SMTP endpoint directly. Avoid transporter.verify() here:
    // it creates an extra SMTP connection before the actual send and can
    // make OTP requests unnecessarily slow.
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        tls: {
            minVersion: "TLSv1.2"
        }
    });

    try {
        return await transporter.sendMail({
            from: `"CampusConnect" <${user}>`,
            to: email,
            subject: title,
            html: body
        });
    } finally {
        transporter.close();
    }
};

module.exports = mailSender;
