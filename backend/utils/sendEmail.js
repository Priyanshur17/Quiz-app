import transporter from "../configs/emailConfig.js";

const sendMail = async (from, to, subject, text, html) => {
    const info = await transporter.sendMail({
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
    console.log("Message sent: %s", info.messageId);
}

export default sendMail;