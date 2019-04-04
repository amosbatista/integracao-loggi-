import httpReq from 'superagent'

// {
//   orderId: 0
// }

const service = (orderId, auth) => {

  return new Promise ((resolve, reject) => {

    httpReq.post(process.env.LOGGI_API_V2)
    .query({
      "query": `mutation {
        cancelOrder(input: {
          id: ${orderId}
          clientMutationId: "test_cancel"
        }) {
          success
          order {
            status
          }
        }
      }`
    })
    .set('Content-Type', "application/json")
    .set('authorization', auth)

    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: "Error at Loggi's API order cancelation",
          data: err
        })
      }

      if(!apiRes.body.data.cancelOrder.success) {
        reject({
          message: `The Loggi's order cancelation has response, but returned errors`,
          data: apiRes.body.data.confirmOrder.errors
        })
      }
      
      resolve()
    })
  })
}

export default service