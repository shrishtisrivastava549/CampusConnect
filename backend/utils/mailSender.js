// Sends transactional email through Resend's HTTPS API.
// HTTPS works on Render Free, unlike outbound SMTP ports (465/587).
const mailSender = async (email, title, body) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;

    if (!apiKey) {
        const error = new Error("Email service is not configured. Set RESEND_API_KEY in the backend environment.");
        error.code = "RESEND_NOT_CONFIGURED";
        throw error;
    }

    if (!from) {
        const error = new Error("Email sender is not configured. Set RESEND_FROM_EMAIL to a verified Resend sender.");
        error.code = "RESEND_FROM_NOT_CONFIGURED";
        throw error;
    }

    let response;
    try {
        response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from,
                to: [email],
                subject: title,
                html: body
            }),
            signal: AbortSignal.timeout(12000)
        });
    } catch (cause) {
        const error = new Error(
            cause?.name === "TimeoutError" || cause?.name === "AbortError"
                ? "Resend email request timed out."
                : "Could not connect to Resend email service."
        );
        error.code = "RESEND_NETWORK_ERROR";
        throw error;
    }

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        // Provider message is useful for Render logs; never log the API key.
        console.error("Resend API rejected email:", response.status, result?.message || result?.name || "Unknown provider error");
        const error = new Error(result?.message || "Resend could not send the email.");
        error.code = "RESEND_SEND_FAILED";
        error.status = response.status;
        throw error;
    }

    return result;
};

module.exports = mailSender;
