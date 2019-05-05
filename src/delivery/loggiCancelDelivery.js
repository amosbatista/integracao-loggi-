import httpReq from 'superagent'

// {
//   orderId: 0
// }

const service = (orderId, auth) => {

  return new Promise ((resolve, reject) => {

    httpReq.post(process.env.LOGGI_API_V2)
    .send({
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
          message: "Erro no cancelamento de pedido da Loggi",
          data: err
        })
      }

      if(!apiRes.body.data.cancelOrder.success) {
        reject({
          message: `O cancelamento foi feito na APi da Loggi, mas ela retornou erro`,
          data: apiRes.body.data.confirmOrder.errors
        })
      }
      
      resolve()
    })
  })
}

export default service