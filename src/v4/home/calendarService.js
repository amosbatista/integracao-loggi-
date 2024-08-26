import nationalService from "../calendar/national.service"
import lunarService from "../calendar/lunar.service"

export default () => {
  
  return new Promise ((resolve, reject) => {

    return Promise.all([
      nationalService(),
      lunarService()
    ]).then()
    .catch(error => {
      reject(error)
    }).then(resolveList => {
      resolve({
        national: resolveList[0],
        lunar:  resolveList[1]
      })
    })
  });
  
}