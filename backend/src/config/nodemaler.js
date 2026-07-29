import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.HOST_GMAIL || "smtp.gmail.com",
    port: Number(process.env.PORT_GMAIL) || 465,
    secure: Number(process.env.PORT_GMAIL) === 465,
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL,
    }
})

const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"greenHOUSE" <${process.env.USER_GMAIL}>`,
            to,
            subject,
            html,
        })
        console.log("Email enviado: ", info.messageId)
    } catch (error) {
        console.log("Error enviando email:", error.message)
        console.log("Error completo:", error)
    }
}

export default sendMail