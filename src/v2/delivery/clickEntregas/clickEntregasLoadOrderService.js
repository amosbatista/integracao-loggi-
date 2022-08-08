import httpReq from 'superagent'

const service = (orderId) => {

  return new Promise ( (resolve, reject) => {


    httpReq.get(`${process.env.CLICK_ENTREGAS_API}/orders?order_id=${orderId}`)
      .send(query)
      .set('X-DV-Auth-Token', process.env.CLICK_ENTREGAS_TOKEN)
      .set('Content-Type', 'application/json')
      .end((err, apiRes) => {
      
      if(err){
        reject({
          message: `Erro ao carregar pedido ${orderId}`,
          data: JSON.stringify(err)
        })

        return
      }

      if(apiRes.body.errors){
        reject({
          message: `Erro interno do sistema ao carregar pedido ${orderId}`,
          data: JSON.stringify(apiRes.body.errors.text)
        })

        return
      }

      if(apiRes.body.warnings &&  apiRes.body.warnings.length > 0){
        reject({
          message: `Está faltando informações para carregar o pedido ${orderId}.`,
          data: apiRes.body.parameter_warnings
        })

        return
      }
      
      const ONLY_FIRST_ORDER = 0;
      const order =  apiRes.body.orders[ONLY_FIRST_ORDER];

      resolve({
          name: order.status,
          translated: order.status_description,
        })
      
    })
  })
}

export default service