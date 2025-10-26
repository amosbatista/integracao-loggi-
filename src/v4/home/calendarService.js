import nationalService from "../calendar/national.service"
import lunarService from "../calendar/lunar.service"
import CalendarProcessor from "../calendar/calendar.processor";
import catholicService from '../calendar/catholic.service'
import hoursService from '../calendar/hours.service';

export default () => {
  
  return new Promise (async (resolve, reject) => {

    const processor = CalendarProcessor();

    const catholicCalendar = await catholicService();
    const catholic = processor.getTheNextDateInsideCalendar(catholicCalendar)

    const planHours = await hoursService();
    const weekDay = processor.getToday().isoWeekday();
    const hourNow = processor.getToday().hour();

    console.log('Weekday', weekDay)
    console.log('Hour Now', hourNow)

    const planetHour = planHours.find ( hourObj => ( hourObj.weekDay === weekDay && hourObj.hour === hourNow ) )


    const national = await nationalService();
    const lunar = await lunarService();

    const calendarResolve = {
      national,
      lunar,
      catholic,
      planetHour
    }
    
    resolve(calendarResolve)
    
  });
  
}