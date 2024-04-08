const moment = require("moment");

const service = (dateLib = moment) => {
  const dateFormat = 'YYYY-MM-DD';
  const hoursInADay = 24;
  const hoursInAWeek = hoursInADay * 7;
  const hoursInAMonth = hoursInAWeek * 30;
  
  return {

    setDateToLib(date) {     
      if (date.search(/^[0-9]{2}-[0-9]{2}$/) === 0) {
        return dateLib(`${this.getToday().year()}-${date}`, dateFormat)  
      }
      return dateLib(date, dateFormat)
    },

    getHoursRemaingToToday(date) {
      const diffFormat = 'hours';

      return this.setDateToLib(date).diff(
        this.getToday(), diffFormat
      )
    },

    getToday() {
      return dateLib()
    },

    getRemaingPeriod(period) {
      if (period < hoursInADay) {

        return {
          value: period,
          type: 'hours'
        }
      }

      if (period >= hoursInADay && period < hoursInAWeek) {

        return {
          value: this.convertHoursToRemainingDays(period),
          type: 'days'
        }
      }

      if (period >= hoursInAWeek && period < hoursInAMonth) {

        return {
          value: this.convertHoursToRemainingWeeks(period),
          type: 'weeks'
        }
      }

      return {
        value: this.convertHoursToRemainingMonths(period),
        type: 'months'
      }
    },

    convertHoursToRemainingDays(hours) {
      const hoursPlusEntireDay = hours % hoursInADay

      if (hours < hoursInADay) {
        return hours
      }

      return hoursPlusEntireDay === 0 ? 
        hours / hoursInADay :
        ((hours - hoursPlusEntireDay) / hoursInADay) + 1
    },

    convertHoursToRemainingWeeks(hours) {
      const hoursPlusEntireWeek = hours % hoursInAWeek

      if (hours < hoursInAWeek) {
        return 0
      }

      return hoursPlusEntireWeek === 0 ? 
        hours / hoursInAWeek :
        ((hours - hoursPlusEntireWeek) / hoursInAWeek) + 1
    },

    convertHoursToRemainingMonths(hours) {
      const hoursPlusEntireMonth = hours % hoursInAMonth

      if (hours < hoursInAMonth) {
        return 0
      }

      return hoursPlusEntireMonth === 0 ? 
        hours / hoursInAMonth :
        ((hours - hoursPlusEntireMonth) / hoursInAMonth) + 1
    },

    parseCalendarObject(calendarItem) {
      return {
        ...calendarItem,
        remainning: this.getRemaingPeriod(
          this.getHoursRemaingToToday(calendarItem.date))
      }
    },

    getTheNextDateInsideCalendar(calendar) {
      const ordered = calendar.sort((itemA, itemB) => {
        const itemADiff = this.getHoursRemaingToToday(itemA.date)
        const itemBDiff = this.getHoursRemaingToToday(itemB.date)
      
        const AMinorB = -1;
        const AEqualB = 0;
        const BMinorA = 1;

        if (itemADiff < 0) {
          return BMinorA;
        }
        if (itemBDiff < 0) {
          return AMinorB;
        }
        if (itemBDiff == itemADiff) {
          return AEqualB;
        }

        return itemADiff > itemBDiff ? BMinorA : AMinorB
      });

      const itemToGet = 0;

      return this.parseCalendarObject(ordered[itemToGet]);
    }

  }
};

export default service;