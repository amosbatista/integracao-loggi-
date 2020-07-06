import httpReq from 'superagent'

const service = (paymentId) => {

  return new Promise ((resolve, reject) => {

    if(!paymentId) {
      reject({
        message: "Não foi informado o ID de pagamento para captura."
      })
    }

    httpReq.put(`${process.env.CIELO_API_REQUEST}/1/sales/${paymentId}/capture`)
    .set('Content-Type', "application/json")
    .set("MerchantId", process.env.CIELO_API_MERCHANTID)
    .set("MerchantKey", process.env.CIELO_API_MERCHANTKEY)

    .end((err, apiRes) => {

      if(err){
        reject({
          message: `Erro ao efetuar captura do pagamento ${paymentId}.`,
          data: err
        })
      }

      else {
        const transactionStatusApproved = "4"
        const transactionStatusApproved2 = "6"
        const transactionStatusApproved_ZeroAuth = "00"

        if(apiRes.body.ReturnCode != transactionStatusApproved && 
          apiRes.body.ReturnCode != transactionStatusApproved2 && 
          apiRes.body.ReturnCode != transactionStatusApproved_ZeroAuth) {
          reject({
            message: `A transação para captura não funcionou para o pagamento ${paymentId}: ${apiRes.body.ReturnMessage}`,
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