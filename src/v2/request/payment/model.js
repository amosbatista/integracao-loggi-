import Sequelize from 'sequelize'
import Status from './paymentStatus'

const model = {   
  requestId: {
    type: Sequelize.INTEGER
  },
  cardNumber: {
    type: Sequelize.STRING
  },
  cardHolder: {
    type: Sequelize.STRING
  },
  cardHash: {
    type: Sequelize.STRING
  },
  authorizationCode: {
    type: Sequelize.STRING
  },
  paymentId: {
    type: Sequelize.STRING
  },
  transactionStatus: {
    type: Sequelize.STRING
  },
  returnCode: {
    type: Sequelize.STRING
  },
  returnMessage: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.ENUM(
      Status.AUTHORIZED,
      Status.REFUSED,
      Status.CONFIRMED,
      Status.CANCELED,
    )
  }
}


export default model