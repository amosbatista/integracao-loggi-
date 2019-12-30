export default (content) => {
  return encodeURIComponent(escape(content))
}