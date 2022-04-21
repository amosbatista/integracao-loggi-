import model from '../model'
import dbConnection from '../../../database/helper'
const service = class {

  constructor () {
    this.requestConnection = dbConnection('requestPayment', model)
  }

  save(requestId, payment) {
    
    return new Promise((resolve, reject)=> {
      let requestConnection = this.requestConnection
      
      requestConnection.sync().then( () => {
        requestConnection.create({
          requestId,
          cardNumber: payment.cardNumber,
          cardHolder: payment.cardHolder,
          authorizationCode: payment.authorizationCode,
          paymentId: payment.paymentId,
          transactionStatus: payment.transactionStatus,
          returnCode: payment.returnCode,
          returnMessage: payment.returnMessage,
          status: payment.status,
          cardHash: payment.cardHash
        })
        .then((newPayment)=>{
          resolve(newPayment)
        })
        .catch((err)=>{
          console.log(err)
          reject({
            message: 'Erro ao criar nova autorização de compra',
            data: err
          })
        })
      })
    })
    
  }
}

export default service