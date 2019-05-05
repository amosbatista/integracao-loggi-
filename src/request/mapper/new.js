import model from '../model'
import dbConnection from '../../database/helper'
import status from '../status'

const service = class {

  constructor () {
    this.transactionLog = dbConnection('request', model)
  }

  save(transactionData) {
    return new Promise((resolve, reject)=> {
      let transactionLog = this.transactionLog
      
      transactionLog.sync().then( () => {

        transactionLog.create({
          clientName: transactionData.clientName,
          clientEmail: transactionData.clientEmail,
          clientPhone: transactionData.clientPhone,
          completeAddress: transactionData.completeAddress,
          addressComplement: transactionData.addressComplement,
          totalPurchase: transactionData.totalPurchase,
          servicesSum: transactionData.servicesSum,
          deliveryTax: transactionData.deliveryTax,
          transactionOperationTax: transactionData.transactionOperationTax,
          status: status.AT_RECEIVE
        })
        .then(()=>{
          resolve()
        })
        .catch((err)=>{
          reject({
            message: 'Error at create new request into database',
            data: err
          })
        })
      })
    })
    
  }
}

export default service