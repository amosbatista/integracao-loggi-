import httpReq from 'superagent'
import log from '../request/log/logGenerator'

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
          message: 'Erro ao fazer requisição na API da Loggi',
          object: JSON.stringify(apiRes.body)
        })

        return
      }

      const firstPackage = 0
      log("Estimative delivery result:", apiRes.body)

      if(apiRes.body.errors){
        reject({
          message: 'Erro interno da API Loggi ao realizar requisição',
          object: JSON.stringify(apiRes.body.errors.text)
        })

        return
      }
      
      if(apiRes.body.data.estimate.packages[firstPackage].error){
        reject({
          message: 'Requisição na API foi concluída, mas há erros',
          object: JSON.stringify(apiRes.body.data.estimate.packages[firstPackage].error)
        })

        return
      }

      if(apiRes.body.data.estimate.packages[firstPackage].outOfCityCover){
        reject({
          message: 'Endereço de origem da retirada está longe demais de São Paulo.',
          object: ""
        })

        return
      }

      if(apiRes.body.data.estimate.packages[firstPackage].outOfCoverageArea){
        reject({
          message: 'Endereço de origem da retirada está longe demais da Loggi.',
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