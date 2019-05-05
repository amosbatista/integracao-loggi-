const tax = (transactionValue) => {

  const totalPercent = 100
  const percentualTax = 0.02

  const taxValue = parseFloat(transactionValue) * percentualTax / totalPercent
  const valuePostTax = transactionValue + taxValue

  return {
    taxValue,
    description: 'Taxa E-commerce',
    calculedValue: valuePostTax
  }
}

export default tax