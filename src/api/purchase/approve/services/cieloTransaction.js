import httpReq from 'superagent'

// {
//   cardNumber: this.cardNumber,
//   nameFromCard: this.nameFromCard,
//   validate: this.validate,
//   cvv: this.cvv,
//   brand: ''
// }
// {
//   totalAmount: 0
// }

const validate = (paymentData, creditCardData) => {
  return paymentData.totalAmount &&
  creditCardData.cardNumber &&
  creditCardData.nameFromCard &&
  creditCardData.validate &&
  creditCardData.cvv &&
  creditCardData.brand
}

const creditCardInstallments = 1
const transactionMessage = "20Cartorio_Delivery"

const service = (paymentData, creditCardData) => {

  return new Promise ((resolve, reject) => {
    if(!validate(creditCardData)) {
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
        "SoftDescriptor": transactionMessage,
        "CreditCard":{
          "CardNumber":creditCardData.cardNumber,
          "Holder": creditCardData.nameFromCard,
          "ExpirationDate": creditCardData.validate,
          "SecurityCode":creditCardData.cvv,
          "Brand": creditCardData.brand
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