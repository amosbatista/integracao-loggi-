const service = (valueToFormat) => {
  return Number.parseFloat(valueToFormat.toString().replace(",", "").replace(" ", ""))
}

export default service