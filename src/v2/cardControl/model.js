import Sequelize from 'sequelize'

const entity = {
  userId: {
    type: Sequelize.INTEGER,
  },
  cardHash: {
    type: Sequelize.STRING,
  },
  cardNumber: {
    type: Sequelize.STRING,
  },
  cardBrand: {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt:  {
    type: Sequelize.DATE
  }
}

export default entity