export default (userFromDb) => {
  return {
    id: userFromDb.id, 
    name: userFromDb.name,
    email: userFromDb.email,
    userType: userFromDb.userType,
    pdwRecoverToken: userFromDb.pdwRecoverToken,
    pdwRecoverKey: userFromDb.pdwRecoverKey,
  }
}