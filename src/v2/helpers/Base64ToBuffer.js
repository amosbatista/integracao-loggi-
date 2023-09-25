export default (value) => {
  return Buffer.from(
    value.replace(/data:[a-z0-9\.\/\,]+;base64,/g, '')
  ,'base64')
}