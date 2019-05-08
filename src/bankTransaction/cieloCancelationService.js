import httpReq from 'superagent'

// {
//   PaymentId,purchaseAmount

// }


const service = (PaymentId) => {

  return new Promise ((resolve, reject) => {

    httpReq.put(process.env.CIELO_API_REQUEST + `/1/sales/${PaymentId}/capture`)
    .set('Content-Type', "application/json")
    .set("MerchantId", process.env.CIELO_API_MERCHANTID)
    .set("MerchantKey", process.env.CIELO_API_MERCHANTKEY)

    .end((err, apiRes) => {

      if(err){
        reject({
          message: "Erro na operação de cancelamento do pagamento",
          data: err
        })
        return
      }


      const cancelationStatusSucess = "6"

      if(apiRes.body.ReturnCode != cancelationStatusSucess) {
        reject({
          message: `O cancelamento da transação não funcionou: ${apiRes.body.ReturnMessage}`,
          data: apiRes.body
        })
        return
      }
      
      resolve()
    })
  })
}

export default service