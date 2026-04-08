
import nodemailer from 'nodemailer'

export const sendMail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.MAILTRAP_SMPT_HOST,
            port:process.env.MAILTRAP_SMPT_PORT,
            secure:false,
            auth:{
                user:process.env.MAILTRAP_SMPT_USER,
                pass:process.env.MAILTRAP_SMPT_PASS
            },
        }) ;

         
            const info = await transporter.sendMail({
                from: "Inngest TMS",
                to,
                subject,
                text
            })      ;
            console.log(info);
            return info ;

              
    } catch (error) {
        console.log('send_mail_error',error.message);
    }
}