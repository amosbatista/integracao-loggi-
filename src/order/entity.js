import Sequelize from 'sequelize'

const entity = {
  clientName: {
    type: Sequelize.STRING
  },
  clientEmail: {
    type: Sequelize.STRING
  },
  clientPhone: {
    type: Sequelize.STRING
  },
  completeAddress: {
    type: Sequelize.STRING,
    allowNull: true
  },
  addressComplement: {
    type: Sequelize.STRING
  },
  totalPurchase: {
    type: Sequelize.DECIMAL
  },
  deliveryTax: {
    type: Sequelize.DECIMAL
  },
  servicesSum: {
    type: Sequelize.DECIMAL
  },
  transactionOperationTax: {
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
  creditCardPaymentId:{
    type: Sequelize.STRING
  },
  creditCardLinksData:{
    type: Sequelize.TEXT
  }
}

export default entity