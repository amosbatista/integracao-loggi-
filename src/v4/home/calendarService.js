import nationalService from "../calendar/national.service"
import lunarService from "../calendar/lunar.service"

export default async () => {
  
  return {
    national: await nationalService(),
    lunar: await lunarService()
  }
}