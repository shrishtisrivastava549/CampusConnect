
// Sends emails through Brevo HTTPS API.
const mailSender = async (email, title, body) => {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.BREVO_FROM_EMAIL;
    const fromName = process.env.BREVO_FROM_NAME || "CampusConnect";

    if (!apiKey) {
        throw new Error("BREVO_API_KEY is not configured.");
    }

    if (!fromEmail) {
        throw new Error("BREVO_FROM_EMAIL is not configured.");
    }

    let response;

    try {
        response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": apiKey,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: fromName,
                    email: fromEmail
                },
                to: [
                    { email: email }
                ],
                subject: title,
                htmlContent: body
            }),
            signal: AbortSignal.timeout(15000)
        });
    } catch (cause) {
        console.error("Brevo connection error:", cause.message);
        throw new Error("Could not connect to Brevo email service.");
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        console.error(
            "Brevo API rejected email:",
            response.status,
            result.message || "Unknown error"
        );

        throw new Error(
            result.message || "Brevo could not send the email."
        );
    }

    console.log("Brevo email accepted:", result.messageId);
    return result;
};

module.exports = mailSender;
