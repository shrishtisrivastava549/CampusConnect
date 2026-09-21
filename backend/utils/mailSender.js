const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"Campus Connect" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body
        });

        return info;

    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = mailSender;