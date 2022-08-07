import httpReq from 'superagent'

const service = (orderId) => {

  return new Promise ( (resolve, reject) => {

    httpReq.get(`${process.env.CLICK_ENTREGAS_API}/courier?order_id=${orderId}`)
    .set('X-DV-Auth-Token', process.env.CLICK_ENTREGAS_TOKEN)
    .set('Content-Type', 'application/json')
    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: `Erro ao pesquisar o status do delivery da ordem de entrega ${orderId}`,
          data: JSON.stringify(apiRes.body)
        })

        return
      }

      if(apiRes.body.errors){
        reject({
          message: `Erro interno do sistema ao carregar pedido ${orderId} para status`,
          data: JSON.stringify(apiRes.body.errors.text)
        })

        return
      }

      if(apiRes.body.warnings &&  apiRes.body.warnings.length > 0){
        reject({
          message: `Está faltando informações para pesquisar o status do pedido ${orderId}.`,
          data: apiRes.body.parameter_warnings
        })

        return
      }

      console.log("motoboy", apiRes.body.courier)

      if(apiRes.body.courier ) {
        
        resolve({
          name: `${apiRes.body.courier.name} ${apiRes.body.courier.surname}`,
          phone: `${apiRes.body.courier.phone}`,
          latitude: Number.parseFloat(apiRes.body.courier.latitude),
          longitude: Number.parseFloat(apiRes.body.courier.longitude),
        })
      }else {
        resolve({
          name: `Desconhecido`,
          phone: `000`,
          latitude: 0,
          longitude: 0,
        })
      }
      
    })
  })
}

export default service