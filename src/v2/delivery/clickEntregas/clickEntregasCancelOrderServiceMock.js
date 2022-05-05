const service = (orderId) => {

  return new Promise ( (resolve, reject) => {

    const query = `
      {"order_id": ${orderId}}
    `
    console.log(query);

    
    /*reject({
      message: `Erro interno da API Click Entregas ao cancelar pedido ${orderId}`,
      data: JSON.stringify(apiRes.body.errors.text)
    })

    return;*/
  
    resolve()
  })
}

export default service