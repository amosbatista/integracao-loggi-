import httpReq from 'superagent'

const service = (orderId) => {

  return new Promise ( (resolve, reject) => {

    const query = `
      {
        "order_id": ${orderId}
      }
    `

    httpReq.post(`${process.env.CLICK_ENTREGAS_API}/create-order`)
    .send(query)
    .set('X-DV-Auth-Token', process.env.CLICK_ENTREGAS_TOKEN)
    .set('Content-Type', 'application/json')
    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: `Erro ao carregar pedido ${orderId}`,
          object: JSON.stringify(err)
        })

        return
      }

      if(apiRes.body.errors){
        reject({
          message: `Erro interno do sistema ao carregar pedido ${orderId}`,
          object: JSON.stringify(apiRes.body.errors)
        })

        return
      }

      if(apiRes.body.warnings.length > 0){
        reject({
          message: `Está faltando informações para carregar o pedido ${orderId}.`,
          object: apiRes.body.parameter_warnings
        })

        return
      }
      
      resolve({
          name: apiRes.body.order.status,
          translated: apiRes.body.order.status_description,
        })
      
    })
  })
}

export default service