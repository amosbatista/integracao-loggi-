const service = (addressData, servicesData, requestId) => {
  console.log("addressData", addressData);
  console.log("servicesData", servicesData);
  console.log("request id", requestId)
  
  return new Promise ( (resolve, reject) => {
    
    /*reject({
      message: 'Erro ao fazer requisição para criar entrega na API da Click Entregas',
      data: JSON.stringify(apiRes.body)
    })

    return;*/
      
    resolve({
      "loggiOrderId": 1111,
      "packageId": 22222,
    })
    
  })
}

export default service