export default (phone) => {
  const FULL_PHONE_CHAR_COUNT = 13
  return phone.length < FULL_PHONE_CHAR_COUNT ? `55${phone}` : phone;
}