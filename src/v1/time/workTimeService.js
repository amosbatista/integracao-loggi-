import moment from 'moment'

export default {

  isWorkTime: () => {
    const workOpenning = moment(process.env.OPENNING_TIME, 'HH:mm');
    const workClosing = moment(process.env.CLOSING_TIME, 'HH:mm');
    const current =  moment();

    return {
      isOnWorkTime: current.isBetween(workOpenning, workClosing),
      currentTime: current
    }
  }
}