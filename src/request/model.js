import Sequelize from 'sequelize'
import Status from './status'

const decimalIntegerPartLimit = 5
const decimalDigitLimit = 2

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
    type: Sequelize.STRING
  },
  addressComplement: {
    type: Sequelize.STRING
  },
  totalPurchase: {
    type: Sequelize.DECIMAL(decimalIntegerPartLimit, decimalDigitLimit) 
  },
  deliveryTax: {
    type: Sequelize.DECIMAL(decimalIntegerPartLimit, decimalDigitLimit) 
  },
  servicesSum: {
    type: Sequelize.DECIMAL(decimalIntegerPartLimit, decimalDigitLimit) 
  },
  transactionOperationTax: {
    type: Sequelize.DECIMAL(decimalIntegerPartLimit, decimalDigitLimit) 
  },
  addressLat: {
    type: Sequelize.STRING
  },
  addressLng: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.ENUM(
      Status.AT_RECEIVE,
      Status.AT_FINISH,
      Status.WAITING_PAYMENT,
      Status.READY_TO_RETURN,
      Status.RETURNED,
      Status.CANCELED
    )
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt:  {
    type: Sequelize.DATE
  }
}

export default entity