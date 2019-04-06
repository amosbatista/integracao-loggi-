import httpReq from 'superagent'

// {
//   PaymentId,purchaseAmount

// }


const service = (PaymentId, purchaseAmount) => {

  return new Promise ((resolve, reject) => {

    httpReq.put(process.env.CIELO_API_REQUEST + `/1/sales/${PaymentId}/void?amount=${purchaseAmount}`)
    .set('Content-Type', "application/json")
    .set("MerchantId", process.env.CIELO_API_MERCHANTID)
    .set("MerchantKey", process.env.CIELO_API_MERCHANTKEY)

    .end((err, apiRes) => {

      if(err){
        reject({
          message: "Error at card operator cancelation",
          data: err
        })
      }

      else{
        const cancelationStatusSucess = "0"

        if(apiRes.body.ReturnCode != cancelationStatusSucess) {
          reject({
            message: `The transaction cancelation not worked well: ${apiRes.Payment.ReturnMessage}`,
            data: apiRes.body
          })
        }
        else 
          resolve()
      }
    })
  })
}

export default service