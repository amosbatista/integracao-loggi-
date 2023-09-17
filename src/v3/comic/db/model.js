import Sequelize from 'sequelize'

const entity = {
  creatorId:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  name:{
    type: Sequelize.STRING,
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
  frontPage: {
    type: Sequelize.BLOB('medium'),
    allowNull: true
  },
  url: {
    type: Sequelize.STRING,
    allowNull: true
  },
  fileName: {
    type: Sequelize.STRING,
    allowNull: true
  },
}

export default entity