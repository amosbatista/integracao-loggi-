
const service = (paymentData) => {

  return new Promise ((resolve, reject) => {

    /*reject({
      message: "Erro ao efetuar pagamento com cartão salvo.",
      data: err
    })*/
    resolve({
      Payment: {
        AuthorizationCode: "1111",
        PaymentId: "111122222",
        Status: "qwe2312",
        ReturnCode: "3123",
        ReturnMessage: "ok"
      }
    })
    
  })
}

export default service