import httpReq from 'superagent'

// {
//   inquiryId: 0
// }

const service = (inquiryId, auth) => {

  return new Promise ((resolve, reject) => {

    const paymentMethod = process.env.LOGGI_PAYMENT_METHODID
    
    httpReq.post(process.env.LOGGI_API_V2)
    .query({
      "query": `mutation {
        confirmOrder(input: {
          inquiry: "${inquiryId}"
          paymentMethod: ${paymentMethod}
          clientMutationId: "confirm_order"
        }) {
          success
          order {
            pk
            status
          }
          errors {
            field
            message
          }
        }
      }
      `
    })
    .set('Content-Type', "application/json")
    .set('authorization', auth)

    .end((err, apiRes) => {
      if(err){
        reject({
          message: "Error at Loggi's API order confirmation",
          data: err
        })
      }

      if(!apiRes.body.data.confirmOrder.success) {
        reject({
          message: `The Loggi's order confirmation has response, but rertuned errors`,
          data: apiRes.body.data.confirmOrder.errors
        })
      }
      
      resolve({
        "loggiOrderId": apiRes.body.data.confirmOrder.order.pk,
        "status": apiRes.body.data.confirmOrder.order.status
      })
    })
  })
}

export default service