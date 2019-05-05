import Sequelize from 'sequelize'
import RequestStatus from '../status'

const model = (requestModel) => {
  
  return {    
    lastStatus: {
      type: Sequelize.ENUM(
        RequestStatus.AT_RECEIVE,
        RequestStatus.AT_FINISH,
        RequestStatus.WAITING_PAYMENT,
        RequestStatus.READY_TO_RETURN,
        RequestStatus.RETURNED,
        RequestStatus.CANCELED
      )
    },
    newStatus: {
      type: Sequelize.ENUM(
        RequestStatus.AT_RECEIVE,
        RequestStatus.AT_FINISH,
        RequestStatus.WAITING_PAYMENT,
        RequestStatus.READY_TO_RETURN,
        RequestStatus.RETURNED,
        RequestStatus.CANCELED
      )
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