import httpReq from 'superagent'

const service = (packageId, auth) => {

  return new Promise ((resolve, reject) => {

    httpReq.post(process.env.LOGGI_API_V2)
    .send({
      "query": `query {
        retrieveOrderWithPk(orderPk: ${packageId}) {
          status
          statusDisplay
          originalEta
          totalTime
          pricing {
            totalCm
          }
          packages {
            pk
            shareds {
              edges {
                node {
                  trackingUrl
                }
              }
            }
          }
          currentDriverPosition {
            lat
            lng
            currentWaypointIndex
            currentWaypointIndexDisplay
          }
        }
      }`
    })
    .set('Content-Type', "application/json")
    .set('authorization', auth)

    .end((err, apiRes) => {
      if(err){
        resolve({
          name: "unknown",
          translated: "Desconhecido"
        })
      }
      else{
        resolve({
          name: apiRes.body.data.retrieveOrderWithPk ? 
            apiRes.body.data.retrieveOrderWithPk.status : "unknown",
            translated: apiRes.body.data.retrieveOrderWithPk ? 
            apiRes.body.data.retrieveOrderWithPk.statusDisplay : "Desconhecido"
        })
      }
    })
  })
}

export default service