import nodemailer from "nodemailer"

const service = (emailTo, clientName) => { 

  return new Promise( (resolve, reject) => {

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_IS_SECURE, // true for 465, false for other ports
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
        <p>Obrigado por ter usado nossos serviços.</p>
      ` // html body
    };

    const info = await transporter.sendMail(mailOptions)

    console.log("Message sent: %s", info.messageId);

    resolve()
  })
}

export default service