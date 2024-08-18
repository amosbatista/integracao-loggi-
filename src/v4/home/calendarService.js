import national from "../calendar/calendars/national"
import lunar from "../calendar/calendars/moon"
import Service from '../calendar/calendar.service'

export default () => {
  const service = Service();

  return {
    national: service.getTheNextDateInsideCalendar(national),
    lunar: service.getTheNextDateInsideCalendar(lunar)
  }
}