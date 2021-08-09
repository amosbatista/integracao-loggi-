const formatCurrency = (valueToFormat) => {
  if(!valueToFormat){
    return ""
  }
  const valueToProcess = typeof valueToFormat == "string" ?
    Number.parseFloat(valueToFormat) :
    valueToFormat

  return "R$ " + valueToProcess.toFixed(2).replace(".", ",") 
}

export default formatCurrency