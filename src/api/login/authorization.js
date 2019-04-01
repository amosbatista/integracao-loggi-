const auth = (req) => {
  const apiId = req.get('Authorization')
  const userLogin = req.get('UserLogin')

  if(!apiId){
    return null
  }

  return `Apikey ${userLogin}:${apiId}`
}

export default auth