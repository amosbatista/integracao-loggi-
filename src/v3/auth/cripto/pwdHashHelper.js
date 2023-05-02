import hashStringWithSaltService from "./hashStringWithSaltService"

export default (pwd) => {
  const salt = process.env.SALT || "";

  return hashStringWithSaltService(pwd, salt);
}