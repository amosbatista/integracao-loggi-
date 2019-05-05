import Sequelize from 'sequelize'

const model = (requestModel) => {
  
  return {    
    proposedValue: {
      type: Sequelize.DECIMAL
    },
    realValue: {
      type: Sequelize.DECIMAL
    },
    isRealValueDifferentFromProposed: {
      type: Sequelize.BOOLEAN
    },
    reasonToDifference: {
      type: Sequelize.STRING,
      allowNull: true
    },
    requestId: {
      type: Sequelize.INTEGER,
   
      references: {   
        model: requestModel,
        key: 'id'
      }
    }
  }
}

export default model