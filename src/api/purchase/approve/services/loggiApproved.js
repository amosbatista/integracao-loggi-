import httpReq from 'superagent'

// {
//   inquiryId: 0
// }

const service = (deliveryData, auth) => {

  return new Promise ((resolve, reject) => {

    resolve({
      "loggiOrderId": '12345abc',
      "status": 'ok'
    })
    return

    const paymentMethod = process.env.LOGGI_PAYMENT_METHODID
    
    httpReq.post(process.env.LOGGI_API_V2)
    .send({
      "query": `mutation {
        confirmOrder(input: {
          inquiry: "${deliveryData.inquiryId}"
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
      else{
        if(!apiRes.body.data.confirmOrder.success) {
          
          reject({
            message: `The Loggi's order confirmation has response, but returned errors`,
            data: apiRes.body.data.confirmOrder.errors
          })
        }
        
        else{
          resolve({
            "loggiOrderId": apiRes.body.data.confirmOrder.order.pk,
            "status": apiRes.body.data.confirmOrder.order.status
          })
        }
      }
    })
  })
}

export default service