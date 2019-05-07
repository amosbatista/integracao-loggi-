import Sendmail from 'sendmail'

const service = (emailTo, clientName, message) => { 

  return new Promise( (resolve, reject) => {

    const sendmail = Sendmail({
      silent: false,
      smtpPort:process.env.EMAIL_PORT,
      smtpHost: process.env.EMAIL_HOST
    })

    sendmail({
      from: process.env.EMAIL_FROM,
      to: emailTo,
      subject: "20º Cartório - Delivery",
      html:  `
        <h5>Olá, ${clientName}</h5>
        <p>${message}</p>
        <p><strong>20º Cartório</strong></p>
      `,
    }, function(err, reply) {
      console.log(err && err.stack);
      console.dir(reply);
      if(err){
        reject({
          message: `Erro ao enviar e-mail ${emailTo}, depois de configurar conjunto de dados.`,
          data: err
        })
        return
      }
      resolve(reply)
    });

  })

  
}

export default service