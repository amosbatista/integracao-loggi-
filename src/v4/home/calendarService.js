import national from "../calendar/calendars/national"
import Service from '../calendar/calendar.service'

export default () => {
  const service = Service();

  return {
    national: service.getTheNextDateInsideCalendar(national)
  }
}