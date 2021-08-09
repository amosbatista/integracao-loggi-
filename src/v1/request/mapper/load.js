import model from '../model'
import dbConnection from '../../database/helper'

const service = class {

  constructor () {
    this.requestModel = dbConnection('request', model)
  }

  load(requestId) {

    return new Promise((resolve, reject)=> {
      let requestModel = this.requestModel
      
      requestModel.sync().then( () => {

        requestModel.findOne({
          where: { 
            id: requestId
          }
        })
        .then((request)=>{

          // Forcing conversion values to decimal (due MYSQL2 preciosion bug)
          request.totalPurchase = Number.parseFloat(request.totalPurchase)
          request.deliveryTax = Number.parseFloat(request.deliveryTax)
          request.servicesSum = Number.parseFloat(request.servicesSum)
          request.transactionOperationTax = Number.parseFloat(request.transactionOperationTax)

          requestModel.sequelize.close()
          resolve(request)
        })
        .catch((err)=>{
          requestModel.sequelize.close()
          reject({
            message: `Erro ao carregar a requisição ${requestId} do banco.`,
            data: err
          })
        })
      })
    })
    
  }
}

export default service