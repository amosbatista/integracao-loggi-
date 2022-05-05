import httpReq from 'superagent'

const validate = (paymentData) => {
  
  return paymentData.totalAmount &&
  paymentData.CardToken &&
  paymentData.brand
}

const creditCardInstallments = 1

const service = (paymentData) => {

  return new Promise ((resolve, reject) => {

    if(!validate(paymentData)) {
      reject({
        message: "Existem campos faltando para efetuar o pagamento com cartão salvo"
      })
    }

    const decimalConversorFactor = 100;

    httpReq.post(process.env.CIELO_API_REQUEST + "/1/sales")
    .send(JSON.stringify({
      "MerchantOrderId": process.env.CIELO_API_MERCHANTID,
      "Payment":{
        "Type":"CreditCard",
        "Amount": Math.round(paymentData.totalAmount * decimalConversorFactor),
        "Installments": creditCardInstallments,
        "CreditCard":{
          "CardToken":paymentData.CardToken,
          "Brand": paymentData.brand
        }
      }
    }))
    .set('Content-Type', "application/json")
    .set("MerchantId", process.env.CIELO_API_MERCHANTID)
    .set("MerchantKey", process.env.CIELO_API_MERCHANTKEY)

    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: "Erro ao efetuar pagamento com cartão salvo.",
          data: err
        })
      }

      else {
        const transactionStatusApproved = "4"
        const transactionStatusApproved2 = "6"
        const transactionStatusApproved_ZeroAuth = "00"

        if(apiRes.body.Payment.ReturnCode != transactionStatusApproved && 
          apiRes.body.Payment.ReturnCode != transactionStatusApproved2 && 
          apiRes.body.Payment.ReturnCode != transactionStatusApproved_ZeroAuth) {
          reject({
            message: `A transação com cartão salvo não funcionou: ${apiRes.body.Payment.ReturnMessage}`,
            data: apiRes.body
          })
        }
        else {
          resolve(apiRes.body)
        }
      }
    })
  })
}

export default service