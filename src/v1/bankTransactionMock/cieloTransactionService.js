
const service = (paymentData) => {

  return new Promise ((resolve, reject) => {

    /*reject({
      message: "Erro ao efetuar pagamento com cartão salvo.",
      data: err
    })*/
    console.log ("Valor que está sendo passado no cartão: ", paymentData.totalAmount)
    resolve({
      Payment: {
        AuthorizationCode: "1111",
        PaymentId: "111122222",
        Status: "qwe2312",
        ReturnCode: "3123",
        ReturnMessage: "ok",
        CreditCard: {
          CardNumber: '*****000',
          Holder: 'foo bar'
        }
      }
    })
    
  })
}

export default service