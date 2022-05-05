import httpReq from 'superagent'

const validate = (cardData) => {
  
  return cardData.cardNumber &&
  cardData.nameFromCard &&
  cardData.validate &&
  cardData.brand
}

const service = (cardData) => {

  return new Promise ((resolve, reject) => {

    if(!validate(cardData)) {
      reject({
        message: "Existem campos faltando para salvar o cartão"
      })
    }

    httpReq.post(process.env.CIELO_API_REQUEST + "/1/card")
    .send(JSON.stringify({
      "CardNumber": cardData.cardNumber,
      "CustomerName": cardData.nameFromCard,
      "Holder": cardData.nameFromCard,
      "ExpirationDate": cardData.validate,
      "Brand": cardData.brand,
    }))
    .set('Content-Type', "application/json")
    .set("MerchantId", process.env.CIELO_API_MERCHANTID)
    .set("MerchantKey", process.env.CIELO_API_MERCHANTKEY)

    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: "Erro ao gerar token do cartão.",
          data: err
        })
      }

      else {
        
        const NUMBERS_EXIBIT_CARD = 4;
        
        if(!apiRes.body.CardToken){
          reject({
            message: `Não foi possível gerar o token do cartão ${cardData.cardNumber.substr(cardData.cardNumber.length - NUMBERS_EXIBIT_CARD, NUMBERS_EXIBIT_CARD)}.`,
            data: apiRes.body
          })
        }
        else {
          resolve(apiRes.body.CardToken)
        }
      }
    })
  })
}

export default service