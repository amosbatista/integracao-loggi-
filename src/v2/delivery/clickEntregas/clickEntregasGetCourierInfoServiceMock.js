
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
    //new
    resolve({
      name: `Emílio Gaspar`,
      phone: `551199221323`,
      lat: Number.parseFloat('-23.586361'),
      lng: Number.parseFloat('-46.657982')
    })
    
  })
}

export default service