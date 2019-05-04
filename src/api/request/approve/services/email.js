import nodemailer from "nodemailer"

const service = (emailTo, clientName, message) => { 

  return new Promise( (resolve, reject) => {

    try{

      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.IS_EMAIL_SECURE, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_ACCOUNT_PASSWORD
        }
      })

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`, // sender address
        to: emailTo, // list of receivers
        subject: "20º Cartório - Delivery", // Subject line
        html: `
          <h5>Olá, ${clientName}</h5>
          <p>${message}</p>
          <p><strong>20º Cartório</strong></p>
        ` // html body
      };

      transporter.sendMail(mailOptions)
      .then((info)=>{
        console.log("Message sent: %s", info.messageId)
        resolve()
      })

      .catch((err)=>{
        reject({
          message: `Error in send e-mail to ${emailTo}, after data set`,
          data: err
        })
      })
    }
    catch(err){
      reject({
        message: `Error in send e-mail to ${emailTo}`,
        data: err
      })
    }
  })
}

export default service