import httpReq from 'superagent'

const service = (paymentId) => {

  return new Promise ((resolve, reject) => {

    
    /*reject({
      message: `Erro ao efetuar captura do pagamento ${paymentId}.`,
      data: err
    })
    */
    
    console.log("capture code", paymentId)
    resolve()

  })
}

export default service