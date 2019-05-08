import Sequelize from 'sequelize'

const decimalIntegerPartLimit = 5
const decimalDigitLimit = 2

const model = {   
  proposedValue: {
    type: Sequelize.DECIMAL(decimalIntegerPartLimit, decimalDigitLimit)
  },
  realValue: {
    type: Sequelize.DECIMAL(decimalIntegerPartLimit, decimalDigitLimit)
  },
  realServiceValue: {
    type: Sequelize.DECIMAL(decimalIntegerPartLimit, decimalDigitLimit)
  },
  isRealValueDifferentFromProposed: {
    type: Sequelize.BOOLEAN
  },
  reasonToDifference: {
    type: Sequelize.STRING(1000),
    allowNull: true
  },
  isOrderComplete: {
    type: Sequelize.BOOLEAN
  },
  requestId: {
    type: Sequelize.INTEGER
  }
}


export default model