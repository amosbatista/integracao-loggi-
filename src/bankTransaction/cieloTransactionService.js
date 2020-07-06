import httpReq from 'superagent'

// {
//   totalAmount: 0
//   creditCard: {
//    cardNumber: this.cardNumber,
//    nameFromCard: this.nameFromCard,
//    validate: this.validate,
//    cvv: this.cvv,
//    brand: ''
//  }
//}

const validate = (paymentData) => {
  
  return paymentData.totalAmount &&
  paymentData.cardNumber &&
  paymentData.nameFromCard &&
  paymentData.validate &&
  paymentData.cvv &&
  paymentData.brand
}

const creditCardInstallments = 1

const service = (paymentData) => {

  return new Promise ((resolve, reject) => {

    if(!validate(paymentData)) {
      reject({
        message: "Existem campos faltando para efetuar o pagamento"
      })
    }

    const decimalConversorFactor = 100;

    httpReq.post(process.env.CIELO_API_REQUEST + "/1/sales")
    .send(JSON.stringify({
      "MerchantOrderId": process.env.CIELO_API_MERCHANTID,
      "Customer":{
         "Name": paymentData.nameFromCard
      },
      "Payment":{
        "Type":"CreditCard",
        "Amount": Math.round(paymentData.totalAmount * decimalConversorFactor),
        "Installments": creditCardInstallments,
        "CreditCard":{
          "CardNumber":paymentData.cardNumber,
          "Holder": paymentData.nameFromCard,
          "ExpirationDate": paymentData.validate,
          "SecurityCode":paymentData.cvv,
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
          message: "Erro ao efetuar pagamento do operador.",
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
            message: `A transação não funcionou: ${apiRes.body.Payment.ReturnMessage}`,
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