
const service = (orderId) => {

  return new Promise ( (resolve, reject) => {

    const query = `
      {
        "order_id": ${orderId}
      }
    `
    
    console.log(query);

    /*reject({
      message: `Erro ao carregar pedido ${orderId}`,
      data: JSON.stringify(apiRes.body)
    })

    return*/
    
    // active
    // delayed
    // new
    resolve({
      name: "new",
      translated: "new",
    })
    
  })
}

export default service