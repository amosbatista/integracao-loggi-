import httpReq from 'superagent'

const service = (orderId, packageId, auth) => {

  return new Promise ((resolve, reject) => {

    httpReq.post(process.env.LOGGI_API_V2)
    .send({
      "query": `mutation {
        retailEditOrder (input: {
          shouldExecute: false
          shouldAddReturn: true
          orderId: ${orderId}
          packages: [
            {
              pk: ${packageId},
              payload: {
                cancellation: true            
              }
            }	
          ]
        }) {
          errors {
            field
            message
            title
          }
          packagesDraft {
            pk
            draftStatus
          }
          diff {
            pricing {
              oldValue
              newValue
            }
            packages {
              pk
              editType
              label
              oldValue
              newValue
            }
          }
        }
      }`
    })
    .set('Content-Type', "application/json")
    .set('authorization', auth)

    .end((err, apiRes) => {
      
      if(err){
        console.log({
          message: "Erro no cancelamento de pedido da Loggi",
          data: err
        })
      }
      resolve()
    })
  })
}

export default service