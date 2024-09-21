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
    }).then((resolveList: void | unknown[])  => {
      resolve({
        national: resolveList ? resolveList[0] : {},
        lunar: resolveList ? resolveList[1] : {}
      })
    })
  });
  
}