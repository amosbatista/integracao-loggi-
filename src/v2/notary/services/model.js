import Sequelize from 'sequelize'

const decimalIntegerPartLimit = 5
const decimalDigitLimit = 2

const model = {
  requestId: {
    type: Sequelize.INTEGER
  },
  serviceId: {
    type: Sequelize.INTEGER
  },
  amount: {
    type: Sequelize.INTEGER
  },
  value: {
    type: Sequelize.DECIMAL(decimalIntegerPartLimit, decimalDigitLimit) 
  },
  totalValue: {
    type: Sequelize.DECIMAL(decimalIntegerPartLimit, decimalDigitLimit) 
  },
  text: {
    type: Sequelize.STRING
  } 
}


export default model