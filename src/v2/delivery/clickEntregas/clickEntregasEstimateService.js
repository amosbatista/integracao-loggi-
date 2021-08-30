import httpReq from 'superagent'
import log from '../request/log/logGenerator'
import notaryAddress from '../../notary/entity'

const service = (addressData) => {

  return new Promise ( (resolve, reject) => {

    const query = `
      {
        "matter":"Documents",
        "points":[{
          "address":"${addressData.completeAddress}"
        },{
          "address":"${notaryAddress.completeAddress}"
      }]}
    `

    httpReq.post(`${process.env.CLICK_ENTREGAS_API}/calculate-order`)
    .send(query)
    .set('X-DV-Auth-Token', process.env.CLICK_ENTREGAS_TOKEN)
    .set('Content-Type', 'application/json')
    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: 'Erro ao fazer requisição para calcular entrega na API da Click Entregas',
          object: JSON.stringify(err)
        })

        return
      }

      log("Estimative delivery result:", apiRes.body)

      if(apiRes.body.errors){
        reject({
          message: 'Erro interno da API Click Entregas ao realizar requisição',
          object: JSON.stringify(apiRes.body.errors)
        })

        return
      }

      if(apiRes.body.warnings.length > 0){
        reject({
          message: 'Está faltando informações para fazer o cálculo.',
          object: apiRes.body.parameter_warnings
        })

        return
      }
      
      resolve({
        estimatedCost:apiRes.body.order.payment_amount,
      })
      
    })
  })
}

export default service