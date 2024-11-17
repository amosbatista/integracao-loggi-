import nationalService from "../calendar/national.service"
import lunarService from "../calendar/lunar.service"
import judaicService from "../calendar/judaic.service"

export default () => {
  
  return new Promise ((resolve, reject) => {

    return Promise.all([
      nationalService(),
      lunarService(),
      judaicService()
    ]).then()
    .catch(error => {
      reject(error)
    }).then((resolveList: void | unknown[])  => {
      resolve({
        national: resolveList ? resolveList[0] : {},
        lunar: resolveList ? resolveList[1] : {},
        judaic: resolveList ? resolveList[2] : {}
      })
    })
  });
  
}