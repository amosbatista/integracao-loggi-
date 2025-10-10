import nationalService from "../calendar/national.service"
import lunarService from "../calendar/lunar.service"
import CalendarProcessor from "../calendar/calendar.processor";
import catholicService from '../calendar/catholic.service'

export default () => {
  
  return new Promise (async (resolve, reject) => {

    const processor = CalendarProcessor();

    const catholicCalendar = await catholicService();
    const catholic = processor.getTheNextDateInsideCalendar(catholicCalendar)

    return Promise.all([
      nationalService(),
      lunarService()
    ]).then()
    .catch(error => {
      reject(error)
    }).then(resolveList => {
      resolve({
        national: resolveList[0],
        lunar:  resolveList[1],
        catholic
      })
    })
  });
  
}