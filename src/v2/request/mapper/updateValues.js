import model from '../model'
import dbConnection from '../../database/helper'

const service = class {

  constructor () {
    this.requestModel = dbConnection('request', model)
  }

  update(request, newServicesSum, newTotalPurchase, newTransactionOperationTax) {

    return new Promise((resolve, reject)=> {
      let requestModel = this.requestModel
      
      requestModel.sync().then( () => {

        requestModel.update(
          {
            servicesSum: newServicesSum,
            totalPurchase: newTotalPurchase,
            transactionOperationTax: newTransactionOperationTax
          },
          {
            returning: true, 
            where: {
              id: request.id
            }
          }
        )
        .then((updatedRequests)=>{
          requestModel.sequelize.close()
          resolve(updatedRequests)
        })
        .catch((err)=>{
          requestModel.sequelize.close()
          reject({
            message: 'Erro ao atualizar valores de pagamento da requisição no banco de dados',
            data: err
          })
        })
      })
    })
    
  }
}

export default service