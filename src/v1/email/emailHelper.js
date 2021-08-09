const helper = (subject, clientName, clientEmail, contentList) => {

  const htmlMiddleContent = contentList.reduce( (totalContent, currentParagraph) => {
    return totalContent + `<p>${currentParagraph}</p>`
  }, "" )

  const mailHeader = `<h2>Olá, ${clientName},</h2>`
  const mailFooter = `
    <p>Caso precise tirar alguma dúvida, ou verificar alguma falha no seu pedido, favor entrar em contato</p>
    <p>Obrigado</p>
    <h5>20º Cartório</h5>
  `

  return {
    emailTo: clientEmail,
    subject: `20 º Cartório Delivery - ${subject}`,
    htmlContent: mailHeader + htmlMiddleContent + mailFooter
  }
}

export default helper