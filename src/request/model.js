import Sequelize from 'sequelize'
import Status from './status'

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
  completeAddress: {
    type: Sequelize.STRING,
    allowNull: true
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
  }
}

export default entity