import httpReq from 'superagent'

const service = (orderId) => {

  return new Promise ( (resolve, reject) => {

    const query = `
      {"order_id": ${orderId}}
    `

    httpReq.post(`${process.env.CLICK_ENTREGAS_API}/cancel-order`)
    .send(query)
    .set('X-DV-Auth-Token', process.env.CLICK_ENTREGAS_TOKEN)
    .set('Content-Type', 'application/json')
    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: `Erro ao fazer cancelamento de pedido ${orderId} na API da Click Entregas`,
          data: JSON.stringify(apiRes.body)
        })

        return
      }

      if(apiRes.body.errors){
        reject({
          message: `Erro interno da API Click Entregas ao cancelar pedido ${orderId}`,
          data: JSON.stringify(apiRes.body.errors.text)
        })

        return
      }

      if(apiRes.body.warnings &&  apiRes.body.warnings.length > 0){
        reject({
          message: `Está faltando informações para cancelar o pedido ${orderId}.`,
          data: apiRes.body.parameter_warnings
        })

        return
      }
      
      resolve()
      
    })
  })
}

export default service