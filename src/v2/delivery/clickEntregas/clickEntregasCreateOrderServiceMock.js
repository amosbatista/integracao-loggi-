const service = (addressData, servicesData) => {
  console.log("addressData", addressData);
  console.log("servicesData", servicesData);
  
  return new Promise ( (resolve, reject) => {
    
    /*reject({
      message: 'Erro ao fazer requisição para criar entrega na API da Click Entregas',
      data: JSON.stringify(apiRes.body)
    })

    return;*/
      
    resolve({
      "loggiOrderId": 12345,
      "packageId": 67890,
    })
    
  })
}

export default service