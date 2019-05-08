import nodemailer from "nodemailer"

const service = (emailData) => { 

  return new Promise( (resolve, reject) => {

    try{

      const transporterOptions = {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: JSON.parse(process.env.IS_EMAIL_SECURE), // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_ACCOUNT_PASSWORD
        },
        requireTLS: true
      }
      let transporter = nodemailer.createTransport(transporterOptions )

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`, // sender address
        to: emailData.emailTo, // list of receivers
        subject: emailData.subject, // Subject line
        html:emailData.htmlContent
      };

      transporter.sendMail(mailOptions).then((info)=>{
        console.log("Message sent: %s", info.messageId)
        resolve()
      }).catch((err)=>{
        reject({
          message: `Erro ao enviar e-mail ${emailData.emailTo}, depois de configurar conjunto de dados.`,
          data: err
        })
      })
    }
    catch(err){
      reject({
        message: `Erro ao enviar e-mail para ${emailData.emailTo}`,
        data: err
      })
    }
  })
}

export default service