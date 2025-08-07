import nodeMailer from 'nodemailer'
export const SendEmail=async(options)=>{
    const sendmailer=nodeMailer.createTransport({
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASS
        }
    })
    const mailoption={
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await sendmailer.sendMail(mailoption);

}