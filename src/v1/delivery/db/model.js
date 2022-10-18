import Sequelize from 'sequelize'
import deliveryType from './deliveryType'

const entity = {
  
  requestId:{
    type: Sequelize.STRING
  },
  deliveryId:{
    type: Sequelize.STRING
  },
  packageId:{
    type: Sequelize.STRING
  },
  deliveryStatus:{
    type: Sequelize.STRING
  },
  type: Sequelize.ENUM(
    deliveryType.TO_RECEIVE,
    deliveryType.TO_RETURN
  )
}

export default entity