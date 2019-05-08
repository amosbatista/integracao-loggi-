import Sequelize from 'sequelize'

const model = {   
  proposedValue: {
    type: Sequelize.DECIMAL
  },
  realValue: {
    type: Sequelize.DECIMAL
  },
  realServiceValue: {
    type: Sequelize.DECIMAL
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