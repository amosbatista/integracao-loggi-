import Sequelize from 'sequelize'

const entity = {
  userId:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description:{
    type: Sequelize.STRING,
    allowNull: true
  },
  enabled:{
    type: Sequelize.BOOLEAN,
    default: true,
  },
  avatar: {
    type: Sequelize.BLOB('medium'),
    allowNull: true
  }
}

export default entity