import Sequelize from 'sequelize'
import Entity from '../entity'

// {
//   clientName, address, number, neighborhood, totalPurchase, 
//   creditCardData: {
//     numberFromAPI, brand, holder,proofOfSale, tid, authorizationCode, paymentId, linksData 
//   }
// }

const service = class {

  constructor () {

    const maxConnections = 5
    const minConnections = 1
    const idleSecondsBeforeClose = 10000
    
    this.sequelize = new Sequelize(process.env.LOG_DATABASE, process.env.LOG_LOGIN, process.env.LOG_PASSWORD, {
      host: process.env.LOG_HOST,
      dialect: process.env.LOG_DATABASE_TYPE,
    
      pool: {
        max: maxConnections,
        min: minConnections,
        idle: idleSecondsBeforeClose
      }
    })

    this.transactionLog = this.sequelize.define('request', Entity)
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