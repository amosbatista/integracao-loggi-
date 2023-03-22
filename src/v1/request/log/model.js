import Sequelize from 'sequelize'
import RequestStatus from '../status'

const model = {   
  lastStatus: {
    type: Sequelize.ENUM(
      RequestStatus.AT_RECEIVE,
      RequestStatus.AT_FINISH,
      RequestStatus.WAITING_PAYMENT,
      RequestStatus.READY_TO_RETURN,
      RequestStatus.RETURNED,
      RequestStatus.CANCELED,
      RequestStatus.WAITING_DELIVERY_RECEIVE_ORDER,
      RequestStatus.WAITING_DELIVERY_RETURN_ORDER
    )
  },
  newStatus: {
    type: Sequelize.ENUM(
      RequestStatus.AT_RECEIVE,
      RequestStatus.AT_FINISH,
      RequestStatus.WAITING_PAYMENT,
      RequestStatus.READY_TO_RETURN,
      RequestStatus.RETURNED,
      RequestStatus.CANCELED,
      RequestStatus.WAITING_DELIVERY_RECEIVE_ORDER,
      RequestStatus.WAITING_DELIVERY_RETURN_ORDER
    )
  },
  requestId: {
    type: Sequelize.INTEGER
  }
}

export default model