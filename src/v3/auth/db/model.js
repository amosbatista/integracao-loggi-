import Sequelize from 'sequelize'
import userTypes from './types'

const entity = {
  name:{
    type: Sequelize.STRING,
    allowNull: false
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false
  },
  pwd:{
    type: Sequelize.STRING,
    allowNull: false
  },
  pwdRecoverToken:{
    type: Sequelize.STRING,
  },
  pwdRecoverKey:{
    type: Sequelize.STRING,
  },
  userType: {
    type: Sequelize.ENUM(
      userTypes.COMMON,
      userTypes.OPERATOR
    ),
    allowNull: false,
  }
}

export default entity