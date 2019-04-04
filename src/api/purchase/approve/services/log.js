import Sequelize from 'sequelize'
// {
//   clientName, address, number, neighborhood, totalPurchase, 
//   creditCardData: {
//     numberFromAPI, brand, holder,proofOfSale, tid, authorizationCode, softDescriptor, paymentId, linksData 
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

    this.transactionLog = sequelize.define('transactionLog', {
      clientName: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      number: {
        type: Sequelize.STRING
      },
      neighborhood: {
        type: Sequelize.STRING
      },
      totalPurchase: {
        type: Sequelize.DECIMAL
      },
      creditCardNumberFromAPI:{
        type: Sequelize.STRING
      },
      creditCardBrand:{
        type: Sequelize.STRING
      },
      creditCardHolder:{
        type: Sequelize.STRING
      },
      creditCardProofOfSale:{
        type: Sequelize.STRING
      },
      creditCardTid:{
        type: Sequelize.STRING
      },
      creditCardAuthorizationCode:{
        type: Sequelize.STRING
      },
      creditCardSoftDescriptor:{
        type: Sequelize.STRING
      },
      creditCardPaymentId:{
        type: Sequelize.STRING
      },
      creditCardLinksData:{
        type: Sequelize.TEXT
      }
    })
  }

  save(transactionData) {
    return new Promise((resolve, reject)=> {
      let transactionLog = this.transactionLog

      transactionLog.sync().then( () => {
        transactionLog.create({
          clientName: transactionData.clientName,
          address: transactionData.address,
          number: transactionData.number,
          neighborhood: transactionData.neighborhood,
          totalPurchase: transactionData.neighborhood,
          creditCardNumberFromAPI: transactionData.creditCard.numberFromAPI,
          creditCardBrand: transactionData.creditCard.brand,
          creditCardHolder: transactionData.creditCard.holder,
          creditCardProofOfSale: transactionData.creditCard.proofOfSale,
          creditCardTid: transactionData.creditCard.tid,
          creditCardAuthorizationCode: transactionData.creditCard.authorizationCode,
          creditCardSoftDescriptor: transactionData.creditCard.softDescriptor,
          creditCardPaymentId: transactionData.creditCard.paymentId,
          creditCardLinksData: transactionData.creditCard.linksData
        })
        .then(()=>{
          resolve()
        })
        .catch((err)=>{
          reject({
            message: 'Error at log into database',
            data: err
          })
        })
      })
    })
    
  }
}

export default service