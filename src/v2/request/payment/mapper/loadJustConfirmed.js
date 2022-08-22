import model from '../model'
import dbConnection from '../../../database/helper'
import paymentStatus from '../paymentStatus'

const service = class {

  constructor () {
    this.paymentModel = dbConnection('requestPayment', model)
  }

  load(requestId) {

    return new Promise((resolve, reject)=> {
      let paymentModel = this.paymentModel
      
      paymentModel.sync().then( () => {

        paymentModel.findAll({
          where: { 
            requestId,
          }
        })
        .then((payments)=>{
          if (payments.find(payment => {
            return payment.status == paymentStatus.CONFIRMED
          })) {
            reject({
              message: `Pagamento do pedido ${requestId} já foi capturado.`,
              data: null
            })
          }
          else {
            const approvedPayment = payments.find(payment => {
              return payment.status == paymentStatus.AUTHORIZED
            });

            if(!approvedPayment){
              reject({
                message: `Não existe pagamento para o pedido ${requestId}.`,
                data: null
              })
            }
            else {
              resolve(approvedPayment)
            }
          }
          paymentModel.sequelize.close()
          
        })
        .catch((err)=>{
          paymentModel.sequelize.close()
          reject({
            message: `Erro ao carregar o pagamento do pedido ${requestId}.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service