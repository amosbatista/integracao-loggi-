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
  paymentData.creditCard.cardNumber &&
  paymentData.creditCard.nameFromCard &&
  paymentData.creditCard.validate &&
  paymentData.creditCard.cvv &&
  paymentData.creditCard.brand
}

const creditCardInstallments = 1
const transactionMessage = "20Cartorio_Delivery"

const service = (paymentData) => {

  return new Promise ((resolve, reject) => {
    if(!validate(paymentData)) {
      reject({
        message: "There's any payment field missing"
      })
    }

    httpReq.post(process.env.CIELO_API_REQUEST + "/1/sales")
    .query({
      "MerchantOrderId": process.env.CIELO_API_MERCHANTID,
      "Customer":{
         "Name": creditCardData.nameFromCard
      },
      "Payment":{
        "Type":"CreditCard",
        "Amount": paymentData.totalAmount,
        "Installments": creditCardInstallments,
        "CreditCard":{
          "CardNumber":paymentData.creditCard.cardNumber,
          "Holder": paymentData.creditCard.nameFromCard,
          "ExpirationDate": paymentData.creditCard.validate,
          "SecurityCode":paymentData.creditCard.cvv,
          "Brand": paymentData.creditCard.brand
        }
      }
    })
    .set('Content-Type', "application/json")
    .set("MerchantId", process.env.CIELO_API_MERCHANTID)
    .set("MerchantKey", process.env.CIELO_API_MERCHANTKEY)

    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: "Error at card operator transaction",
          data: err
        })
      }

      const transactionStatusApproved = "1"
      const transactionStatusSuccess = "2"

      if(apiRes.body.Payment.ReturnCode != transactionStatusSuccess) {
        reject({
          message: `The transaction not worked well: ${apiRes.body.Payment.ReturnMessage}`,
          data: apiRes.body
        })
      }
      
      resolve(apiRes.body)
    })
  })
}

export default service