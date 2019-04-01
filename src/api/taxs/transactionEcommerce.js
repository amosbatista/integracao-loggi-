const taxValue = 2.40

const tax = (transactionValue) => {
  const valuePostTax = parseFloat(transactionValue) + taxValue
  return {
    taxValue,
    description: 'Taxa E-commerce',
    calculedValue: valuePostTax
  }
}

export default tax