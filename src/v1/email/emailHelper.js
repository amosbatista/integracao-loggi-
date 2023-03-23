const helper = (subject, clientName, clientEmail, contentList) => {

  const htmlMiddleContent = contentList.reduce( (totalContent, currentParagraph) => {
    return totalContent + `<p>${currentParagraph}</p>`
  }, "" )

  const mailHeader = `<h2>Olá, ${clientName},</h2>`
  const mailFooter = `
    <p>Obrigado</p>
    <h5>Equipe 20º Cartório Itaim Bibi</h5>
  `

  return {
    emailTo: clientEmail,
    subject: `20 º Cartório Delivery - ${subject}`,
    htmlContent: mailHeader + htmlMiddleContent + mailFooter
  }
}

export default helper