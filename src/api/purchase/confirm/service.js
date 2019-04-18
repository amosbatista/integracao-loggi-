import httpReq from 'superagent'

const service = (addressData, auth) => {

  return new Promise ( (resolve, reject) => {

    const notariusStoreId = process.env.LOGGI_STORE_ID
    const originCoordinate = addressData.coordinates

    const query = `query {
      estimate(
        shopId: ${notariusStoreId},
        packagesDestination: [
          {
            lat: ${originCoordinate.lat},
            lng: ${originCoordinate.lng}   
          }
        ]
        chargeMethod: 1,
        optimize: true
      ) {
        packages {
          error
          eta
          index
          rideCm
          outOfCityCover
          outOfCoverageArea
          originalIndex
          waypoint {
            indexDisplay
            originalIndexDisplay
            role
          }
        }
        routeOptimized
        normal {
          cost
          distance
          eta
        }
        optimized {
          cost
          distance
          eta
        }
      }   
    }
    `

    httpReq.post(process.env.LOGGI_API_V2)
    .send({
      query: query
    })
    .set('Authorization', auth)
    .set('Content-Type', 'application/json')
    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: 'Error in client API request',
          object: JSON.stringify(err)
        })

        return
      }

      const firstPackage = 0
      
      if(apiRes.body.data.estimate.packages[firstPackage].error){
        reject({
          message: 'API request is done but there"s errors ',
          object: JSON.stringify(apiRes.body.data.estimate.packages[firstPackage].error)
        })

        return
      }

      if(apiRes.body.data.estimate.packages[firstPackage].outOfCityCover){
        reject({
          message: 'Delivery request is so far from São Paulo.',
          object: ""
        })

        return
      }

      if(apiRes.body.data.estimate.packages[firstPackage].outOfCoverageArea){
        reject({
          message: 'Delivery request is so far from Loggi',
          object: ""
        })

        return
      }
      
      resolve({
        estimatedCost:apiRes.body.data.estimate.packages[firstPackage].rideCm
      })
      
    })
  })
}

export default service